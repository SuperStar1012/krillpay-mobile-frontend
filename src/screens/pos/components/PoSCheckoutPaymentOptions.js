import React from 'react';
import { View, ButtonList } from 'components';
import HeaderNew from 'components/layout/HeaderNew';
import PoSCheckoutHeader from './PoSCheckoutHeader';
import Selector from 'components/inputs/SelectorIcon';
import PageContent from 'components/layout/PageContent';
import RadioSelector from 'components/inputs/RadioSelector';

export default function PoSCheckoutPaymentOptions(props) {
  const { setState, items } = props;
  let buttons = [
    {
      label: 'CONTINUE',
      disabled: !items?.length,
      onPress: () => setState('email'),
    },
    { label: 'Cancel', type: 'text', onPress: () => setState('checkout') },
  ];

  const paymentMethods = [
    { value: 'wallet', label: 'Pay with wallet', icon: 'wallet' },
  ];
  const walletMethods = [{ value: 'scan', label: 'Scan to pay' }];

  return (
    <View w="100%" screen f={1}>
      <HeaderNew handleBack={() => setState('checkout')} />
      <View f={1}>
        <PageContent>
          <PoSCheckoutHeader {...props} />
        </PageContent>
        <PageContent>
          <Selector label="Payment" value="wallet" items={paymentMethods} />
        </PageContent>
        <PageContent>
          <RadioSelector value="scan" items={walletMethods} size="small" />
        </PageContent>
      </View>

      <ButtonList items={buttons} ph={1.5} />
    </View>
  );
}
