import React from 'react';
import { Text, View } from 'components';
import AmountCurrencyLayout from 'screens/accounts/components/AmountCurrencyLayout';

export default function SellHeader(props) {
  const { form, context, result } = props;
  const { wallet } = context;

  const values = form.getValues();
  const { amount, conversionQuote, toWallet: convWallet } = values;

  const { to_total_amount = amount, from_total_amount } = conversionQuote ?? {};

  return (
    <View pt={0.5}>
      <>
        <Text
          c="white"
          fW="700"
          s={16}
          id={result ? 'you_sold' : 'you_sell'}
          capitalize
        />
        <AmountCurrencyLayout
          amount={from_total_amount}
          wallet={wallet}
          context={context}
        />
        <View pt={1}>
          <Text
            fW="bold"
            c="white"
            id={result ? 'you_received' : 'you_receive'}
            capitalize
          />
        </View>
        <AmountCurrencyLayout
          amount={to_total_amount}
          wallet={convWallet}
          context={context}
        />
      </>
    </View>
  );
}
