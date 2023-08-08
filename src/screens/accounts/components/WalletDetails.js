import React from 'react';
import { addCommas, displayFormatDivisibility } from 'utility/general';

import { getCurrencyCode } from '../util/rates';
import { View, Text } from 'components';
import { useConversion } from 'utility/rates';
import CurrencyBadge from 'components/outputs/CurrencyBadge';

export default function WalletDetails(props) {
  const { item, rates, amount, services } = props;

  if (!item) {
    return null;
  }
  const { currency, account_name, available_balance } = item;

  const amountString = displayFormatDivisibility(
    amount ? amount : available_balance,
    currency.divisibility,
  );

  const { hasConversion, convAmount } = useConversion(
    amount,
    services,
    currency,
    true,
  );

  const newDesign = false;
  return (
    <View fD={'row'} f={1} pt={0.5}>
      <View jC={'center'} style={{ marginRight: 16 }}>
        <CurrencyBadge text={currency.code} currency={currency} radius={24} />
      </View>
      <View jC={'space-between'} aI={'center'} fD={'row'} f={1}>
        <View fD={'column'} f={1} pr={2}>
          <Text
            s={16}
            fW={'500'}
            numberOfLines={1}
            ellipsizeMode="clip"
            c="white">
            {newDesign ? currency.description : getCurrencyCode(currency)}
          </Text>
          <Text s={13} fW={'400'} c="white">
            {newDesign ? getCurrencyCode(currency) : account_name}
          </Text>
        </View>
        <View fD={'column'} aI={'flex-end'}>
          <Text s={16} fW={'500'} c="white">
            {addCommas(amountString)}
          </Text>
          {hasConversion && (
            <Text s={13} fW={'400'} c="white">
              {convAmount}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
