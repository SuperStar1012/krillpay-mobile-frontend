import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Big from 'big.js';
import PayStaticForm from './PayStaticForm';
import PayConfirm from './PayStaticConfirm';
import PayResult from './PayResult';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { View, LocalAuthentication } from 'components';
import {
  currenciesSelector,
  conversionRatesSelector,
} from '../../redux/reducer';
import { uuidv4, toDivisibility } from 'utility/general';
import { createTransactionCollection } from 'utility/rehive';
import { useLocalAuth } from 'contexts/LocalAuthContext';
import { useRehiveContext } from 'contexts/RehiveContext';
import { fetchAccounts } from '@redux/actions';
import HeaderNew from 'components/layout/HeaderNew';
import { useForm } from 'react-hook-form';
import PayRecipientSmall from './PayRecipientSmall';
import PayPending from './PayPending';

export default function PayStatic(props) {
  let {
    navigation,
    status,
    data,
    onSuccess,
    onError,
    wyreCurrency,
    // config = {},
  } = props;

  const currencies = useSelector(currenciesSelector);
  const { localAuth } = useLocalAuth();
  const rates = useSelector(conversionRatesSelector);
  const {
    context: rehiveContext,
    config: { actionsConfig, pinConfig, checkoutConfig, posConfig },
  } = useRehiveContext();
  const { tier, services } = rehiveContext; //TODO:

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
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const [pinVisible, setPinVisible] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  let { amount = '' } = data;

  let filteredCurrencies = { ...currencies };

  const wallet = currencies?.accounts?.[accountRef]?.currencies?.[currencyCode];

  const defaultValues = {
    rating: '',
    tip: '',
    amount,
    // baseAmount: amount,
    amountDisplay: 0,
  };

  const form = useForm({
    defaultValues,
  });

  function handleSuccess(response) {
    setResult(response);
    if (response?.transactions?.[0]?.status === 'Pending') {
      setFormState('pending');
    } else {
      setFormState('result');
      typeof onSuccess === 'function' && onSuccess(response);
      dispatch(fetchAccounts());
    }
  }

  function handleError(error) {
    typeof onError === 'function' && onError(error);
    setFormState('result');
    setError(error?.message);
    setResult(error);
  }
  const values = form.getValues();

  const methods = {
    handleSuccess,
    handleError,
    setSubmitting,
  };

  const context = { ...rehiveContext, data, wallet, rates, wyreCurrency };
  function handleSubmit() {
    handleRequestConfirm({
      context,
      values,
      methods,
    });
  }

  function handleButtonPress() {
    let nextFormState = formState;

    if (formState === 'result') {
      navigation.navigate('Wallets', { currency: wallet });
    } else if (formState === 'init') {
      nextFormState = 'confirm';
    } else {
      if (pinConfig.pay && localAuth.enabled) {
        setPinVisible(true);
      } else {
        handleSubmit();
      }
    }

    setFormState(nextFormState);
  }

  const hooks = {
    currencyCode,
    setCurrencyCode,
    accountRef,
    setAccountRef,
    error,
    setError,
    isSubmitting,
    setSubmitting,
  };

  const pageProps = {
    data,
    actionConfig: actionsConfig,
    currencies: filteredCurrencies,
    checkoutConfig,
    posConfig,
    wallet,
    handleButtonPress,
    onNext: handleButtonPress,
    rates,
    services,
    tier,
    hooks,
    error,
    navigation,
    values,
    context,
    form,
    state: formState,
  };

  function handleBack() {
    if (formState === 'confirm') setFormState('init');
    else navigation.goBack();
  }

  const isResult = formState === 'result' || formState === 'error';
  return (
    <>
      <HeaderNew
        handleBack={handleBack}
        dense
        bC={isResult || formState === 'confirm' ? '#F8F8F8' : 'white'}
        title={formState === 'init' && <PayRecipientSmall {...props} />}
      />

      {status && status.error ? (
        <ErrorOutput>{status.error}</ErrorOutput>
      ) : (
        <>
          <>
            {isResult ? (
              <PayResult result={result} {...pageProps} />
            ) : (
              <>
                {formState === 'pending' ? (
                  <PayPending
                    setFormState={setFormState}
                    result={result}
                    onSuccess={handleSuccess}
                  />
                ) : formState === 'confirm' ? (
                  <PayConfirm {...pageProps} />
                ) : (
                  <View ph={1.5} pt={0.5} f={1}>
                    <PayStaticForm {...pageProps} />
                  </View>
                )}
              </>
            )}
          </>
          {pinVisible ? (
            <LocalAuthentication
              modal // TODO:
              localAuth={localAuth}
              modalVisible={pinVisible}
              onSuccess={() => {
                setPinVisible(false);
                handleSubmit();
              }}
              onDismiss={() => setPinVisible(false)}
            />
          ) : null}
        </>
      )}
    </>
  );
}

async function handleRequestConfirm({ values, context, methods }) {
  const { data, wallet, wyreCurrency } = context;
  const { setSubmitting, handleError, handleSuccess } = methods;
  try {
    const user = context?.user?.id;
    const { subtype_debit, qr_id, subtype, recipient } = data;
    let { amount, tip, rating, account } = values;

    setSubmitting(true);
    const amountValue = toDivisibility(amount, wallet?.currency);
    const { currency } = wallet;
    const currencyCode = currency?.code;
    const accountRef = wallet?.account;

    const uuid1 = uuidv4();
    const uuid2 = qr_id ? qr_id : uuidv4();
    let tnx1 = {
      id: uuid1,
      partner: uuid2,
      tx_type: 'debit',
      status: wyreCurrency?.wyre_code ? 'Pending' : 'Complete',
      user,
      amount: amountValue,
      currency: currencyCode,
      account: accountRef,
      subtype: subtype_debit ? subtype_debit : 'purchase_pos', // TODO: 'send_email'
      note: rating ? 'Rating ' + rating : '',
    };
    if (data?.name) {
      let rehive_context = {};
      // if (business) rehive_context.business = business;
      if (data?.name) rehive_context.name = data?.name;
      tnx1.metadata = {
        rehive_context,
      };
    }
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
        account: account ?? 'sales',
        subtype: subtype ? subtype : 'sale_pos', // TODO: business ?  : 'receive_email',
        user: recipient,
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

    handleSuccess(response);
  } catch (error) {
    let { data, message } = error;
    if (data && (data.credit_subtype || data.debit_subtype)) {
      message = 'This transaction flow is not supported by this company';
    }
    handleError({ ...error, message });
    setSubmitting(false);
  }
  // if (!isRequest) {
  // }
}

// function validation(values) {
//   try {
//     let { amount = 0, display, baseAmount = 0, tip = 0 } = values;

//     amount = parseFloat(
//       isEmpty(display ? baseAmount : amount)
//         ? 0
//         : display
//         ? baseAmount
//         : amount,
//     );

//     // if (isBlankRequest && (amount <= 0 || Number.isNaN(amount)) && !quote)
//     //   return {
//     //     amount: 'Amount must be more than 0',
//     //   };

//     let amountValue =
//       parseFloat(amount ? amount : 0) + parseFloat(tip ? tip : 0);

//     let feeAmount = 0.0;
//     let totalAmount = amountValue;
//     const fee = getFee(tier, 'pay', currency.currency);

//     if (fee) {
//       feeAmount = calculateFee(amountValue, fee, currency);
//       totalAmount = parseFloat(amountValue) + feeAmount;
//     }

//     if (totalAmount > availableAmount) {
//       return {
//         amount: 'Available balance exceeded',
//       };
//     }

//     return {};
//   } catch (e) {}
// }
