import React, { useState } from 'react';
import { View, ButtonList, Text } from 'components';
import HeaderNew from 'components/layout/HeaderNew';
import CartList from './CartList';
import { calculateInvoiceTotal } from 'utility/general';
import { createBusinessInvoice, getPaymentRequest } from 'utility/rehive';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { useQuery } from 'react-query';
import { formatAmountString } from 'utility/rates';
import PoSCheckoutProcessing from './PoSCheckoutProcessing';
import PoSCheckoutSuccess from './PoSCheckoutSuccess';
import PoSCheckoutEmail from './PoSCheckoutEmail';
import PoSCheckoutPaymentOptions from './PoSCheckoutPaymentOptions';
import PoSCheckoutScan from './PoSCheckoutScan';

export default function PoSCheckout(props) {
  const {
    setState,
    state,
    items,
    id,
    context: { currency, business },
  } = props;

  function handleCancel() {
    setState('');
  }
  const [loading, setLoading] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [error, setError] = useState('');
  const [enabled, setEnabled] = useState(true);

  const { data } = useQuery(
    ['request', invoiceId],
    () => getPaymentRequest(invoiceId, true),
    {
      enabled: !!invoiceId && state === 'scan' && enabled,
      refetchInterval: 2000,
      onSuccess: data => {
        if (data.status === 'paid') {
          setEnabled(false);
        }
      },
    },
  );
  const status = data?.status ?? 'initiated';

  async function createInvoice() {
    setLoading(true);
    setError('');

    let tempItems = items.filter(item => item);

    let data = {
      request_reference: 'Point of sale invoice',
      request_amount: calculateInvoiceTotal(items, currency?.divisibility),
      status: 'initiated',
      metadata: {
        service_business: { items: tempItems },
      },
    };

    const resp = await createBusinessInvoice(business?.id, data);

    if (resp?.status === 'success') {
      setInvoiceId(resp?.data?.id);
      // setItems([]);
      setState('email');
    } else {
      setError(resp?.message);
    }
    setLoading(false);
  }

  let buttons = [
    {
      label: 'CHECKOUT',
      disabled: !items?.length,
      loading,
      onPress: createInvoice,
    },
    { label: 'Cancel', type: 'text', onPress: handleCancel },
  ];

  if (status === 'processing') {
    return <PoSCheckoutProcessing {...props} invoiceId={invoiceId} />;
  } else if (status === 'paid' || status === 'overpaid') {
    return <PoSCheckoutSuccess {...props} invoiceId={invoiceId} data={data} />;
  } else if (invoiceId)
    switch (state) {
      case 'email':
        return <PoSCheckoutEmail {...props} invoiceId={invoiceId} />;
      case 'options':
        return <PoSCheckoutPaymentOptions {...props} invoiceId={invoiceId} />;
      case 'scan':
        return <PoSCheckoutScan {...props} invoiceId={invoiceId} />;
      default:
    }

  const request_amount = calculateInvoiceTotal(items, currency?.divisibility);
  const amountString = formatAmountString(request_amount, currency, true);

  return (
    <View w="100%" screen f={1}>
      <HeaderNew handleBack={handleCancel} title="checkout" dense />
      <View f={1} scrollView>
        <CartList {...props} />
        <View fD="row" w="100%" ph={1.5} pb={1}>
          <Text s={20} c="primary" fW="700">
            Total
          </Text>
          <View f={1}>
            <Text s={20} c="primary" tA="right" fW="700">
              {amountString}
            </Text>
          </View>
        </View>
        <ErrorOutput>{error}</ErrorOutput>
      </View>
      <ButtonList items={buttons} ph={1.5} pv={0.25} />
    </View>
  );
}
