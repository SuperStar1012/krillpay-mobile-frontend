import React from 'react';
import { View } from 'components';
import HeaderNew from 'components/layout/HeaderNew';
import PoSCheckoutHeader from './PoSCheckoutHeader';
import PaymentPending from 'components/outputs/PaymentPending';

export default function PoSCheckoutProcessing(props) {
  const { setState } = props;

  return (
    <View w="100%" screen f={1}>
      <HeaderNew handleBack={() => setState('')} />
      <PoSCheckoutHeader {...props} />
      <PaymentPending />
    </View>
  );
}
