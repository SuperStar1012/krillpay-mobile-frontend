import React from 'react';
import { Text, View } from 'components';
import AmountCurrencyLayout from 'screens/accounts/components/AmountCurrencyLayout';

export default function BuyHeader(props) {
  const { form, context, result } = props;
  const { wallet } = context;

  const values = form.getValues();
  const { amount, conversionQuote, fromWallet: convWallet } = values;

  const { to_total_amount = amount, from_total_amount } = conversionQuote ?? {};

  return (
    <>
      <Text
        c="white"
        fW="700"
        s={16}
        id={result ? 'you_bought' : 'you_buy'}
        capitalize
      />
      <AmountCurrencyLayout
        amount={to_total_amount}
        wallet={wallet}
        context={context}
      />
      <View pt={1}>
        <Text
          fW="bold"
          c="white"
          id={result ? 'you_spent' : 'you_spend'}
          capitalize
        />
      </View>
      <AmountCurrencyLayout
        amount={from_total_amount}
        wallet={convWallet}
        context={context}
      />
    </>
  );
}
