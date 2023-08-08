import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import Big from 'big.js';
import PayForm from './PayForm';
import PayConfirm from './PayConfirm';
import PayResult from './PayResult';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { View, HeaderButton, LocalAuthentication, Spinner } from 'components';
// import { fetchAccounts } from 'core/main/redux/actions';
import {
  currenciesSelector,
  conversionRatesSelector,
  conversionPairsSelector,
} from '../../redux/reducer';
import { uuidv4, toDivisibility } from 'utility/general';
import {
  createTransactionCollection,
  getPaymentRequest,
  choosePaymentRequestMethod,
} from 'utility/rehive';
import { getFee, calculateFee } from '../../util/fees';
import { formatDecimals } from '../../util/rates';
import ExpiredTimer from './ExpiredTimer';
import { useLocalAuth } from 'contexts/LocalAuthContext';
import { isEmpty } from 'lodash';
import { useRehiveContext } from 'contexts/RehiveContext';
import PayInitiated from './PayInitiated';
import { fetchAccounts } from '@redux/actions';
import PayStatic from './PayStatic';
import { useWyreCurrency } from 'extensions/wyre/hooks';
import PayPending from './PayPending';

export default function Pay(props) {
  let {
    navigation,
    status,
    data,
    contactMatch,
    userLabel,
    currentRequest,
    onQuoteAdded,
    onSuccess,
    onError,
    config = {},
    onPending,
    embedded,
  } = props;

  const { hideBack, hideInvoice, hideCurrency, hideConversion } = config;

  const currencies = useSelector(currenciesSelector);
  const { localAuth } = useLocalAuth();
  const rates = useSelector(conversionRatesSelector);
  const {
    context,
    config: { actionsConfig, pinConfig, checkoutConfig, posConfig },
  } = useRehiveContext();
  const conversionPairs = useSelector(conversionPairsSelector);

  const { user, tier, services } = context;
  const [accountRef, setAccountRef] = useState(
    data?.currentCurrency?.account ??
      data?.currency?.account ??
      currencies?.primaryAccount,
  );
  const [currencyCode, setCurrencyCode] = useState(
    data?.currentCurrency?.currency?.code ??
      data?.currency?.currency?.code ??
      data?.currency ??
      currencies?.accounts?.[accountRef]?.keys?.[0],
  );
  let [formState, setFormState] = useState('init');
  const [result, setResult] = useState(null);
  const [request, setRequest] = useState(currentRequest);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const business = request?.metadata?.service_business?.business;
  const [quotes, setQuotes] = useState(
    currentRequest?.payment_processor_quotes ?? [],
  );
  const [conversionQuote, setConversionQuote] = useState(null);
  const [pinVisible, setPinVisible] = useState(false);

  onSuccess =
    onSuccess ??
    (result => {
      // setResult(result) //TODO:
      dispatch(fetchAccounts);
      setFormState(isRequest ? 'initiated' : 'result');
    });

  onError =
    onError ??
    (error => {
      setError(error);
      setFormState('result');
    });

  let {
    request_id = data?.request,
    amount = '',
    subtype,
    subtype_debit,
    recipient,
    qr_id,
  } = data;
  const currency =
    currencies?.accounts?.[accountRef]?.currencies?.[currencyCode];
  // const isQr = formState === 'qr';

  const { data: wyreCurrency } = useWyreCurrency(currency);

  if (!request_id && !request) {
    return (
      <PayStatic
        {...props}
        onSuccess={onSuccess}
        onError={onError}
        wyreCurrency={wyreCurrency}
      />
    );
  }
  const isRequest = Boolean(request);
  const isBlankRequest =
    isRequest && [0, null, 'None'].includes(request?.request_amount);
  const isComplete =
    request && !Boolean(request?.status.match(/pending|processing|initiated/));

  let quote = quotes.find(
    item =>
      item.payment_processor.unique_string_name === 'native' &&
      item.status.match(/pending|processing/) &&
      item.currency.code === currencyCode,
  );

  const [expired, setExpired] = useState(quote?.status === 'expired');

  useEffect(() => {
    setExpired(quote?.status === 'expired');
  }, [quote]);

  useEffect(() => {
    setError(null);
  }, [currencyCode]);

  async function fetchData() {
    const resp = await getPaymentRequest(request_id);

    if (resp.status === 'success') {
      setFormState(formState === 'init' ? '' : formState);
      setRequest(resp.data);
      setQuotes(resp.data.payment_processor_quotes);
    } else {
      onError();
      setResult({ message: 'Unable to fetch request' });
    }
  }

  useEffect(() => {
    let timer = null;
    function handleRefreshing() {
      fetchData();
      if (formState === 'initiated' && !isComplete) {
        timer = setTimeout(() => {
          handleRefreshing();
        }, 1000);
      }
    }

    if (formState === 'initiated') {
      handleRefreshing();
    }
    return () => clearTimeout(timer);
  }, [formState]);

  useEffect(() => {
    if (request_id && !request) {
      fetchData();
    } else {
      setFormState('');
    }
  }, [request_id]);

  let filteredCurrencies = { ...currencies };

  const availableAmount = currency
    ? currency.available_balance /
      (request_id ? 1 : 10 ** currency?.currency?.divisibility)
    : 0;

  const requiresQuote =
    (request && !quote && request?.request_currency?.code !== currencyCode) ||
    (!request &&
      data?.currencyCode &&
      currencyCode !== data?.currencyCode &&
      !conversionQuote) ||
    expired;

  async function handleRequestConfirm({ formikProps, freshQuote }) {
    const { values, setSubmitting, setFieldError } = formikProps;
    try {
      const user = context?.user?.email ?? context?.user?.id;
      let { amount, tip, rating, account } = values;
      let _quote = freshQuote ?? quote;

      setSubmitting(true);
      const amountValue =
        _quote?.amount ?? toDivisibility(amount, currency?.currency);

      const uuid1 = uuidv4();
      const uuid2 = _quote?.reference ?? (qr_id ? qr_id : uuidv4());
      let metadata = null;
      if (business || data?.name) {
        let pay_context = {};
        if (business) pay_context.business = business;
        if (request?.metadata?.service_business?.items)
          pay_context.items = request?.metadata?.service_business?.items;
        if (data?.name) pay_context.name = data?.name;
        metadata = {
          pay_context,
        };
      }
      let tnx1 = {
        id: uuid1,
        partner: uuid2,
        tx_type: 'debit',
        status: wyreCurrency?.wyre_code ? 'Pending' : 'Complete',
        user,
        amount: amountValue,
        currency: currencyCode,
        account: accountRef,
        subtype: subtype_debit
          ? subtype_debit
          : business
          ? 'purchase_pos'
          : 'send_email',
        note: rating ? 'Rating ' + rating : '',
        metadata,
      };
      let transactions = [
        tnx1,
        {
          id: uuid2,
          partner: uuid1,
          tx_type: 'credit',
          status: wyreCurrency?.wyre_code ? 'Pending' : 'Complete',
          amount: amountValue,
          currency: currencyCode,
          note: rating ? 'Rating ' + rating : '',
          account: request?.account ?? account ?? 'sales',
          subtype:
            _quote?.payment_processor?.rehive_subtype ??
            (subtype ? subtype : business ? 'sale_pos' : 'receive_email'),
          user: request?.user?.email ?? request?.user?.id ?? recipient,
          metadata,
        },
      ];
      if (tip) {
        const tipInt = parseInt(Big(tip).times(10 ** currency.divisibility));

        const uuid3 = uuidv4();
        const uuid4 = uuidv4();
        transactions.push({
          id: uuid3,
          partner: uuid4,
          tx_type: 'debit',
          status: wyreCurrency?.wyre_code ? 'Pending' : 'Complete',
          user,
          amount: tipInt,
          currency: currencyCode,
          account: accountRef,
          subtype: 'tip',
          note: rating ? 'Rating ' + rating : '',
        });
        transactions.push({
          id: uuid4,
          partner: uuid3,
          tx_type: 'credit',
          status: wyreCurrency?.wyre_code ? 'Pending' : 'Complete',
          amount: tipInt,
          note: rating ? 'Rating ' + rating : '',
          currency: currencyCode,
          account: account,
          subtype: 'tip',
          user: recipient,
        });
      }
      const response = await createTransactionCollection(transactions);
      if (response?.transactions?.[0]?.status === 'Pending') {
        setFormState('pending');
        typeof onPending === 'function' && onPending();
      } else {
        onSuccess(response, request);
        dispatch(fetchAccounts());
      }
      setResult(response);
    } catch (error) {
      let { data, message } = error;
      if (data && (data.credit_subtype || data.debit_subtype)) {
        message = 'This transaction flow is not supported by this company';
      }
      setError(message);
      onError(error);
      setResult({ ...error, message });
      setSubmitting(false);
    }
    // if (!isRequest) {
    // }
  }

  async function createRequestQuote(formikProps) {
    const { setSubmitting, values } = formikProps;
    setSubmitting(true);

    const conversionCurrency =
      currencies?.accounts?.[accountRef]?.currencies[currencyCode];

    let data = {
      payment_processor_currency: currencyCode,
      primary_payment_processor: 'native',
    };
    if (user?.email) data.payer_email = user?.email;
    else if (user?.mobile) data.payer_mobile_number = user?.mobile;

    if (isBlankRequest)
      data.quote_amount =
        (values?.baseAmount ?? values?.amount) *
        10 ** conversionCurrency?.currency?.divisibility;

    const resp = await choosePaymentRequestMethod(request.id, data);

    if (resp.status === 'success') {
      setRequest(resp.data);
      setQuotes(resp.data.payment_processor_quotes);

      onQuoteAdded && onQuoteAdded(resp.data);

      if (
        conversionCurrency?.currency?.code ===
        resp?.data?.request_currency?.code
      )
        return handleSubmit({
          formikProps,
          quote: resp.data.payment_processor_quotes[0],
        });
    } else {
      setError(resp?.message);
    }
    setSubmitting(false);
  }

  const toCurrency =
    currencies?.accounts?.[accountRef]?.currencies?.[
      (data?.amount ? data?.currencyCode : currencyCode) ??
        data?.currency?.currency?.code
    ] ??
    currencies?.accounts?.[currencies?.primaryAccount]?.currencies?.[
      data?.currency
    ] ??
    currencies?.data?.find(item => item?.currency?.code === data?.currency);

  function handleSubmit({ formikProps, quote }) {
    handleRequestConfirm({ formikProps, freshQuote: quote });
  }

  function handleButtonPress(formikProps, type) {
    let nextFormState = formState;

    if (type === 'success') {
      navigation.goBack();
      // navigation.navigate('Wallets', { currency });
    } else if (request && (!quote || expired)) {
      createRequestQuote(formikProps);
    } else {
      if (pinConfig.pay && localAuth.enabled) {
        setPinVisible(true);
      } else {
        handleSubmit({ formikProps });
      }
    }

    setFormState(nextFormState);
  }

  function validation(values) {
    try {
      let { amount = 0, display, baseAmount = 0, tip = 0 } = values;

      amount = parseFloat(
        isEmpty(display ? baseAmount : amount)
          ? 0
          : display
          ? baseAmount
          : amount,
      );

      if (isBlankRequest && (amount <= 0 || Number.isNaN(amount)) && !quote)
        return {
          amount: 'Amount must be more than 0',
        };

      let amountValue =
        parseFloat(amount ? amount : 0) + parseFloat(tip ? tip : 0);

      let feeAmount = 0.0;
      let totalAmount = amountValue;
      const fee = getFee(tier, 'pay', currency.currency);

      if (fee) {
        feeAmount = calculateFee(amountValue, fee, currency);
        totalAmount = parseFloat(amountValue) + feeAmount;
      }

      if (totalAmount > availableAmount) {
        return {
          amount: 'Available balance exceeded',
        };
      }

      return {};
    } catch (e) {}
  }

  amount = request
    ? formatDecimals(request?.request_amount, request?.request_currency, true)
    : amount;

  const initialValues = {
    note: '',
    display: false,
    editing: !Boolean(amount),
    rating: '',
    tip: '',
    amount,
    baseAmount: amount,
    displayAmount: 0,
    ...data,
    ...(quote ? quote : {}),
  };

  const hooks = {
    currencyCode,
    setCurrencyCode,
    accountRef,
    setAccountRef,
    expired,
    setExpired,
    error,
    setError,
    conversionQuote,
    setConversionQuote,
  };

  const pageProps = {
    ...props,
    data,
    actionConfig: actionsConfig,
    currencies: filteredCurrencies,
    checkoutConfig,
    posConfig,
    toCurrency,
    currency,
    wallet: currency,
    handleButtonPress,
    rates,
    services,
    tier,
    request,
    quotes,
    quote,
    conversionPairs,
    hooks,
    business,
    error,
    hideInvoice,
    contactMatch,
    userLabel,
    hideCurrency,
    requiresQuote,
    hideConversion,
  };

  // const

  return (
    <>
      <View
        pl={1.5}
        pv={0.5}
        fD="row"
        bC={isComplete || formState === 'result' ? '#F8F8F8' : 'white'}
        w="100%"
        jC="space-between"
        style={{ position: hideBack ? 'absolute' : 'relative' }}>
        {!hideBack && (
          <HeaderButton
            onPress={() => navigation.goBack()}
            icon="chevron-left"
            size={32}
            color={'primary'}
            containerStyle={{
              padding: 0,
              paddingTop: 0,
              marginLeft: -10,
            }}
          />
        )}
        {formState !== 'initiated' &&
          !(isComplete || formState === 'result') && (
            <View pr={0.5} w={hideBack ? '100%' : null}>
              <ExpiredTimer
                quote={quote}
                conversionQuote={conversionQuote}
                setExpired={setExpired}
              />
            </View>
          )}
      </View>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        isInitialValid={validation(initialValues)}
        validate={values => validation(values)}>
        {formikProps =>
          status && status.error ? (
            <ErrorOutput>{status.error}</ErrorOutput>
          ) : (
            <>
              <>
                {formState === 'pending' ? (
                  <PayPending
                    setFormState={setFormState}
                    result={result}
                    onSuccess={response => {
                      onSuccess(response, request);
                      dispatch(fetchAccounts());
                    }}
                  />
                ) : isComplete ||
                  formState === 'result' ||
                  formState === 'error' ? (
                  <PayResult
                    formikProps={formikProps}
                    result={result}
                    {...pageProps}
                  />
                ) : (
                  <View ph={embedded ? 0 : 1.5} pt={0.5}>
                    {formState === 'initiated' ? (
                      <PayInitiated {...pageProps} />
                    ) : formState === 'confirm' ? (
                      <PayConfirm formikProps={formikProps} {...pageProps} />
                    ) : formState === 'init' ? (
                      <Spinner />
                    ) : (
                      <PayForm formikProps={formikProps} {...pageProps} />
                    )}
                  </View>
                )}
              </>
              {pinVisible ? (
                <LocalAuthentication
                  modal // TODO:
                  localAuth={localAuth}
                  modalVisible={pinVisible}
                  onSuccess={() => {
                    setPinVisible(false);
                    handleSubmit({ formikProps });
                  }}
                  onDismiss={() => setPinVisible(false)}
                />
              ) : null}
            </>
          )
        }
      </Formik>
    </>
  );
}
