import React, { useState } from 'react';
import { WebView } from 'react-native-webview';

import { uploadWithdrawalInvoice } from 'utility/rehive';
import BitrefillConfirm from './BitrefillConfirm';
import { View, Spinner } from 'components';
import { useRehiveContext } from 'contexts/RehiveContext';
import { useToast } from 'contexts/ToastContext';
import HeaderNew from 'components/layout/HeaderNew';
const BITREFILL_URL = 'https://embed.bitrefill.com/';

export default function Bitrefill(props) {
  const { visible, onDismiss, navigation } = props;
  const { showToast } = useToast();

  const {
    context: {
      company: { id },
      user: { email },
    },
  } = useRehiveContext();
  const uri =
    BITREFILL_URL +
    '?email=' +
    encodeURIComponent(email) +
    '&paymentMethod=lightning&showPaymentInfo=false&utm_source=rehive' +
    encodeURIComponent(':' + id);

  const [invoice, setInvoice] = useState('');
  const [loading, setLoading] = useState(false);
  const [initiated, setInitiated] = useState(false);
  const [error, setError] = useState('');

  async function confirmOrder() {
    setLoading(true);
    const resp = await uploadWithdrawalInvoice(invoice);
    if (resp.status === 'success') {
      setInitiated(true);
      showToast({
        text: 'Payment successfully initiated',
      });
    } else {
      setError(resp.message);
      setLoading(false);
    }
  }

  function handleMessage(event) {
    const { nativeEvent } = event;
    if (nativeEvent) {
      const { data } = nativeEvent;
      if (data) {
        try {
          const { invoiceId, paymentUri, event } = JSON.parse(data);
          if (event === 'invoice_created') {
            const temp = paymentUri.split(':');
            const invoice = temp[1];
            setInvoice(invoice);
          } else if (event === 'invoice_complete') {
            showToast({
              text: 'Payment successful',
            });
            handleDismiss();
          }
        } catch (e) {}
      }
    }
  }

  function handleDismiss() {
    setInvoice('');
    setLoading(false);
    setError('');
  }
  const open = Boolean(invoice);

  const confirmProps = {
    open,
    confirmOrder,
    handleDismiss,
    loading,
    error,
    invoice,
    initiated,
  };

  return (
    <React.Fragment visible={visible} onDismiss={onDismiss} noPadding>
      <HeaderNew navigation={navigation} />
      <BitrefillConfirm {...confirmProps} />
      <View fG={1} pt={0.5}>
        <View
          style={{
            zIndex: 100,
            position: 'absolute',
            width: '100%',
            top: 100,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}>
          <Spinner size={'large'} />
        </View>
        <View
          fG={1}
          style={{
            zIndex: 50,
            backgroundColor: 'transparent',
          }}>
          <WebView
            style={{
              zIndex: 50,
              height: '100%',
              backgroundColor: 'transparent',
            }}
            source={{ uri }}
            onMessage={event => handleMessage(event)}
          />
        </View>
      </View>
    </React.Fragment>
  );
}
