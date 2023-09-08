import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

import * as yup from 'yup';
import { View, Button, Text, Spinner } from 'components';

import { Formik } from 'formik';

import ConfirmPage from 'components/layout/ConfirmPage';
import ResultPage from 'components/layout/ResultPage';

import PrepaidVoucherList from '../pages/AddFundsPage/PrepaidVoucherList';
import PaymentMethodSelector, {
  PaymentMethodSelectorCard,
} from '../pages/AddFundsPage/PaymentMethodSelector';
import CurrencySelector from './CurrencySelector';
import CompanyBankAccountDeposit from './CompanyBankAccountDeposit';
import { formatAmountString } from '../util/rates';
import {
  getStripePaymentMethods,
  makeStripePayment,
  getStripePayment,
} from 'utility/rehive';
import ErrorOutput from 'components/outputs/ErrorOutput';
import client from 'config/client';

const PrepaidForm = props => {
  const {
    currency,
    currencies,
    initialValues,
    actionsConfig,
    onSuccess,
    handleStateChange,
  } = props;

  const prepaidConfig = get(actionsConfig, ['prepaid', 'config']);
  const cardConfig = get(prepaidConfig, ['paymentMethod', 'options', 'card']);
  const hasCard = Boolean(cardConfig);
  const bankConfig = get(prepaidConfig, ['paymentMethod', 'options', 'bank']);
  const hasBank = Boolean(bankConfig);
  const [reload, setReload] = useState(true);

  const defaultPayment = get(prepaidConfig, ['paymentMethod', 'default']);
  const isCardDefaultPayment =
    (hasCard && defaultPayment === 'card') || (hasCard && !hasBank);

  const [state, setState] = useState('');
  const [payment, setPayment] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(isCardDefaultPayment);
  const [loaded, setLoaded] = useState(false);
  const [cardPaymentMethods, setCardPaymentMethods] = useState([]);

  useEffect(() => {
    async function handleGetPaymentMethods() {
      setLoaded(false);
      const resp = await getStripePaymentMethods();
      // const lastPayment = await getStripeUser();
      if (resp && resp.status === 'success' && resp.data) {
        let { data } = resp;
        // if (lastPayment.status === 'success') {
        //   shiftToStart(
        //     data,
        //     'id',
        //     get(lastPayment, ['data', 'last_payment_method']),
        //   );
        // }
        if (hasBank) {
          if (isCardDefaultPayment) {
            data.push({ type: 'bank', id: 'bank' });
          } else {
            data.unshift({ type: 'bank', id: 'bank' });
          }
        }
        setCardPaymentMethods(data);
        setReload(false);
      } else {
        // onSuccess();
      }
      setLoading(false);
      setLoaded(true);
    }
    if (reload) {
      if (hasCard) {
        handleGetPaymentMethods();
      } else if (hasBank) {
        setCardPaymentMethods([{ type: 'bank', id: 'bank' }]);
      }
    }
  }, [hasBank, hasCard, isCardDefaultPayment, prepaidConfig, reload]);

  if (!hasCard && !hasBank) {
    return <ErrorOutput>This app has not set up adding funds</ErrorOutput>;
  }

  if (!currency) {
    return null;
  }

  const validationSchema = yup.object().shape({
    voucher: yup.string().required('Voucher is required'),
    paymentMethod: yup.string().required('Payment method is required'),
  });
  const defaultVoucher = get(prepaidConfig, [
    'voucherList',
    'default',
    get(currency, ['currency', 'code']),
  ]);

  const formInitialValues = {
    voucher: defaultVoucher,
    paymentMethod: isCardDefaultPayment
      ? cardPaymentMethods.length
        ? cardPaymentMethods[0]
        : { id: 'card', type: 'card' }
      : { id: 'bank', type: 'bank' },
    ...initialValues,
  };

  const sharedProps = {
    currency,
    config: prepaidConfig.voucherList,
  };
  function handleCurrencyUpdate(currency, formikProps) {
    formikProps.setFieldValue('currency', currency);
  }

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      isInitialValid={
        cardPaymentMethods.length &&
        Boolean(
          get(prepaidConfig, [
            'voucherList',
            'options',
            get(currency, ['currency', 'code']),
            defaultVoucher,
          ]),
        )
      }
      enableReinitialize={!loaded}>
      {formikProps =>
        result ? (
          <ResultPage
            {...sharedProps}
            formikProps={formikProps}
            handleButtonPress={
              result.status === 'success'
                ? () => {
                    setState('');
                    setResult(null);
                    props.navigation.navigate('CurrencyDetail', {
                      currencyCode: get(currency, ['currency', 'code']),
                      accountRef: get(currency, 'account'),
                    });
                  }
                : () => {
                    setState('');
                    setResult(null);
                  }
            }
            result={result}
            text={
              result.status === 'success'
                ? 'Payment successful'
                : 'Something went wrong'
            }
          />
        ) : state === 'bank' ? (
          <PrepaidBankConfirm {...sharedProps} formikProps={formikProps} />
        ) : state === 'card' ? (
          <PrepaidCardConfirm
            {...sharedProps}
            formikProps={formikProps}
            setResult={setResult}
            setState={setState}
            setPayment={setPayment}
          />
        ) : state === 'processing' ? (
          <StripeCardConfirmProcessing
            {...sharedProps}
            formikProps={formikProps}
            payment={payment}
            setResult={setResult}
            onSuccess={onSuccess}
          />
        ) : (
          <View scrollView p={1}>
            <CurrencySelector
              // rates={rates}
              config={actionsConfig}
              action="prepaid"
              item={get(formikProps, ['values', 'currency'])}
              // returnIndex
              items={currencies.data}
              updateItem={item => handleCurrencyUpdate(item, formikProps)}
            />
            <PrepaidVoucherList {...sharedProps} formikProps={formikProps} />
            <PaymentMethodSelector
              loading={loading}
              data={cardPaymentMethods}
              changeText={
                cardPaymentMethods.length > 1 || hasBank ? 'Change' : 'Add card'
              }
              disabled={!hasCard}
              {...sharedProps}
              formikProps={formikProps}
              config={prepaidConfig.paymentMethod}
              setReload={setReload}
            />
            <Button
              wide
              label="CONTINUE"
              disabled={!formikProps.isValid || formikProps.isSubmitting}
              loading={formikProps.isSubmitting}
              onPress={() =>
                setState(get(formikProps, ['values', 'paymentMethod', 'type']))
              }
            />
            {/*
          {pinVisible ? (
            <LocalAuthentication
              modal // TODO:
              localAuth={localAuth}
              modalVisible={pinVisible}
              onSuccess={() => {
                this.hidePin();
                this.handleFormSubmit(props);
              }}
              onDismiss={() => this.hidePin()}
            />
          ) : null} */}
          </View>
        )
      }
    </Formik>
  );
};

export default PrepaidForm;

const PrepaidBankConfirm = props => {
  const { formikProps, config, currency } = props;
  const { values } = formikProps;
  const { voucher } = values;

  const { amount } = get(config, ['options', currency.currency.code, voucher]);

  const amountString = formatAmountString(amount, currency.currency, true);

  return (
    <CompanyBankAccountDeposit
      TextComponent={
        <Text p={1} tA={'center'}>
          {'Transfer exactly '}
          <Text c="primary" fW="700">
            {amountString}
          </Text>
          {
            ' to the bank details below. Make sure to use the correct reference number.'
          }
        </Text>
      }
      currency={currency}
    />
  );
};

const PrepaidCardConfirm = props => {
  const { formikProps, config, currency, setPayment, setState, setResult } =
    props;
  const { values, setSubmitting } = formikProps;
  const { voucher, paymentMethod } = values;
  const currencyCode = get(currency, ['currency', 'code']);

  const { amount } = get(config, ['options', currencyCode, voucher]);

  const amountString = formatAmountString(
    amount,
    get(currency, ['currency']),
    true,
  );

  async function handleConfirm() {
    setSubmitting(true);
    const data = {
      currency: currencyCode,
      amount,
      payment_method: get(paymentMethod, 'id'),
      return_url:
        client.url + '/publicStripeRedirectPage/success/?secure3d=true',
    };
    const resp = await makeStripePayment(data);
    if (resp.status === 'success') {
      setPayment(get(resp, ['data']));
      setState('processing');
    } else {
      setResult({ status: 'failed' });
    }

    setSubmitting(false);
  }

  return (
    <ConfirmPage
      onBack={() => setState('')}
      onConfirm={handleConfirm}
      formikProps={formikProps}>
      <View p={1} w={'100%'} pb={0.01}>
        <Text tA={'center'}>
          {'You are about to fund '}
          <Text c="primary" fW="700">
            {amountString}
          </Text>
          {' with the following card '}
        </Text>
        <View style={{ paddingTop: 16, width: '100%' }}>
          <PaymentMethodSelectorCard disabled f={1} item={paymentMethod} />
        </View>
      </View>
    </ConfirmPage>
  );
};

const StripeCardConfirmProcessing = props => {
  const { setResult, payment, onSuccess } = props;
  const [attempts, setAttempts] = useState(1);
  const isAndroid = Boolean(Constants.platform.android);
  const [loadCount, setLoadCount] = useState(0);
  const [loadStartCount, setLoadStartCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const resp = await getStripePayment(payment.id);

      if (resp.data.status === 'processing') {
        const timer = setTimeout(() => {
          setAttempts(attempts + 1);
        }, 1000);
        return () => {
          clearTimeout(timer);
        };
      } else if (resp.data.status === 'succeeded') {
        onSuccess();
        setResult({ status: 'success' });
      } else {
        let message = get(resp, ['data', 'error'], '');
        if (message) {
          if (message.includes('failed authentication')) {
            message = '3D Secure authentication failed';
          }
        }
        setResult({ status: 'failed', message });
      }
    }
    if (payment && payment.id && attempts < 60) {
      fetchData();
    } else {
      setResult({
        status: 'failed',
        message: attempts === 60 ? 'Timed out...' : 'Something went wrong...',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment, attempts]);

  const redirectUrl = get(payment, ['next_action', 'redirect_to_url', 'url']);

  useEffect(() => {
    async function handleWebBrowser() {
      await WebBrowser.openBrowserAsync(redirectUrl);
    }
    if (redirectUrl && isAndroid) {
      handleWebBrowser();
    }
  }, [redirectUrl]);

  return (
    <React.Fragment>
      {(loadCount < 2 || loadStartCount > 4 || isAndroid) && (
        <View p={2} fD="column" aI="center" w="100%" f={1}>
          <Spinner />
          <View h={16} />
          <Text p={2} align="center">
            {'Processing payment... (0:' + (60 - attempts).toString() + ')'}
          </Text>
        </View>
      )}
      {Boolean(redirectUrl) && !isAndroid && (
        <WebView
          style={{
            zIndex: 50,
            height: loadCount !== 2 ? 0 : '100%',
            maxHeight: loadCount !== 2 ? 0 : '100%',
            width: '100%',
            flex: 1,
          }}
          originWhitelist={['*']}
          source={{
            uri: redirectUrl,
          }}
          onLoadStart={event => setLoadStartCount(loadStartCount + 1)}
          onLoad={event => setLoadCount(loadCount + 1)}
        />
      )}
    </React.Fragment>
  );
};
