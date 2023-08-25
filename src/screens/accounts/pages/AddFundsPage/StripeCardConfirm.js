import React, { useState, useEffect } from 'react';
import ConfirmPage from 'components/layout/ConfirmPageNew';
import { View, Text, Spinner } from 'components';
import { PaymentMethodSelectorCard } from './PaymentMethodSelector';
import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

import { get } from 'lodash';
import { formatAmountString } from '../../util/rates';
import { useCompany } from 'contexts/CompanyContext';
import { getStripePayment, makeStripePayment } from 'utility/rehive';

export default function StripeCardConfirm(props) {
  const { company: client } = useCompany();
  const {
    formikProps,
    config,
    currency,
    setResult,
    setState,
    cardPaymentMethods,
  } = props;
  const [payment, setPayment] = useState(null);
  const { values, setSubmitting } = formikProps;
  const { amount, paymentMethod, stripeId } = values;
  const currencyCode = get(currency, ['currency', 'code']);

  const amountValue = get(config, ['fixed', 'options', amount, 'amount'], 0);

  const amountString = formatAmountString(
    amountValue,
    get(currency, ['currency']),
    true,
  );

  async function handleConfirm() {
    setSubmitting(true);
    const data = {
      currency: currencyCode,
      amount: amountValue,
      payment_method: stripeId,
      return_url:
        client.website + '/publicStripeRedirectPage/success/?secure3d=true',
    };

    const resp = await makeStripePayment(data);
    if (resp.status === 'success') {
      setPayment(get(resp, ['data']));
    } else {
      setResult({ status: 'failed' });
    }

    setSubmitting(false);
  }

  if (payment) {
    return <StripeCardConfirmProcessing payment={payment} {...props} />;
  }

  return (
    <ConfirmPage
      // hideBack
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
          <PaymentMethodSelectorCard
            disabled
            f={1}
            item={cardPaymentMethods.find(item => item.id === stripeId)}
          />
        </View>
      </View>
    </ConfirmPage>
  );
}

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
