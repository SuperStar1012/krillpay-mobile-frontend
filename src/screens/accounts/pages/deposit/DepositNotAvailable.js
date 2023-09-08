import React from 'react';
import { Text, View } from 'components';

export default function DepositNotAvailable(props) {
  return (
    <View pv={0.5} f={1}>
      <Text s={18} paragraph tA={'center'} id="deposit_not_available" />
    </View>
  );
}
