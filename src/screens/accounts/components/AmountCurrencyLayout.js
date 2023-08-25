import React from 'react';
import { addCommas, standardizeString } from 'utility/general';

import { getCurrencyCode } from '../util/rates';
import { View, Text } from 'components';
import { useConversion, formatAmountString } from 'utility/rates';
import CurrencyBadge from 'components/outputs/CurrencyBadge';

export default function AmountCurrencyLayout(props) {
  const { wallet, amount, context } = props;

  if (!wallet || !context) {
    return null;
  }
  const { currency, account_name, available_balance } = wallet;
  const {
    wallets: { multipleAccounts },
    services,
    accountsConfig = {},
  } = context;
  const { amountDisplayCurrency = false } = accountsConfig;

  const amountString = formatAmountString(
    amount ? amount : available_balance,
    currency,
    true,
  );

  const { hasConversion, convAmount } = useConversion(
    amount ? amount : available_balance,
    services,
    currency,
    true,
  );

  return (
    <View fD={'row'} f={1} pt={0.5}>
      <View jC={'center'} style={{ marginRight: 16 }}>
        <CurrencyBadge text={currency.code} currency={currency} radius={24} />
      </View>
      <View jC={'space-between'} aI={'center'} fD={'row'} f={1}>
        <View fD={'column'} f={1} pr={2}>
          <Text
            s={14}
            fW={'500'}
            numberOfLines={1}
            ellipsizeMode="clip"
            c="white"
            id={currency.description}></Text>
          <Text
            s={12}
            fW={'400'}
            c="white"
            lH={18}
            id={multipleAccounts ? account_name : getCurrencyCode(currency)}
            options={{ standardize: !!multipleAccounts }}></Text>
        </View>
        <View fD={'column'} aI={'flex-end'}>
          <Text s={14} fW={'500'} c="white">
            {amountDisplayCurrency && hasConversion && convAmount
              ? convAmount
              : amountString}
          </Text>
          <Text s={12} fW={'400'} c="white" lH={18}>
            {amountDisplayCurrency && hasConversion
              ? amountString
              : hasConversion && convAmount}
          </Text>
        </View>
      </View>
    </View>
  );
}
