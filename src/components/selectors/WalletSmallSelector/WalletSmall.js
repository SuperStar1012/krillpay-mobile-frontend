import React from 'react';

import { Text } from 'components';
import { getCurrencyCode } from 'screens/accounts/util/rates';
import CurrencyBadge from 'components/outputs/CurrencyBadge';
import { FontAwesome5 } from '@expo/vector-icons';
import { View } from 'components/layout/View';

export default function WalletSmall(props) {
  const { item } = props;

  return (
    <View aI={'center'} fD={'row'}>
      <CurrencyBadge
        text={item?.currency?.code}
        currency={item?.currency}
        size={20}
      />
      <Text
        s={20}
        style={{
          paddingLeft: 8,
          paddingRight: 8,
        }}>
        {getCurrencyCode(item.currency)}
      </Text>
      <FontAwesome5
        name="caret-down"
        size={12}
        color={'black'}
        style={{ opacity: 0.8, marginTop: -4 }}
      />
    </View>
  );
}
