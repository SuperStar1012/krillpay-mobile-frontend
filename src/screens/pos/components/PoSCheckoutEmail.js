import React, { useState } from 'react';
import { View, ButtonList } from 'components';
import HeaderNew from 'components/layout/HeaderNew';
import PageContent from 'components/layout/PageContent';
import PoSCheckoutHeader from './PoSCheckoutHeader';
import { updateBusinessInvoice } from 'utility/rehive';
import Input from 'components/inputs';
import { validateEmail } from 'utility/validation';
import ErrorOutput from 'components/outputs/ErrorOutput';

export default function PoSCheckoutEmail(props) {
  const {
    setState,
    items,
    invoiceId,
    context: { currency, business },
  } = props;
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function updateInvoice() {
    setLoading(true);

    if (email) {
      let data = {
        payer_email: email,
      };

      const resp = await updateBusinessInvoice(business?.id, invoiceId, data);

      if (resp?.status === 'success') {
        setState('scan');
      } else {
        setLoading(false);
        setError(resp?.message);
      }
    } else setState('scan');
  }

  const invalidEmail = email && validateEmail(email);

  let buttons = [
    {
      label: 'Continue',
      disabled: !items?.length || invalidEmail,
      loading,
      onPress: updateInvoice,
    },
    { label: 'Cancel', type: 'text', onPress: () => setState('checkout') },
  ];

  return (
    <View w="100%" screen f={1} jC="space-between">
      <View>
        <HeaderNew handleBack={() => setState('checkout')} />
        <PoSCheckoutHeader {...props} />
        <PageContent>
          <Input
            config={{ label: 'Email (optional)' }}
            value={email}
            onChangeText={setEmail}
          />
        </PageContent>
        <ErrorOutput>{error}</ErrorOutput>
      </View>
      <ButtonList items={buttons} ph={1.5} />
    </View>
  );
}
