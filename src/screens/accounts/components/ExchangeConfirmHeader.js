import React from 'react';
import { View, Text } from 'components';
import { useRehiveContext } from 'contexts/RehiveContext';
import AmountCurrencyLayout from './AmountCurrencyLayout';

export default function ExchangeConfirmHeader(props) {
  const {
    conversionQuote,
    fromCurrency: wallet,
    toCurrency: convWallet,
    currencies,
    result,
  } = props;

  const {
    context: rehiveContext,
    config: { accountsConfig },
  } = useRehiveContext();

  const context = {
    ...rehiveContext,
    wallets: currencies,
    accountsConfig,
  };
  const { to_total_amount, from_total_amount } = conversionQuote ?? {};

  return (
    <View
      p={1.5}
      mh={0.5}
      bC={'primary'}
      style={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}>
      <>
        <Text
          c="white"
          fW="700"
          s={16}
          id={result ? 'you_spent' : 'you_spend'}
          capitalize
        />
        <AmountCurrencyLayout
          amount={from_total_amount}
          // wallet={convWallet}
          wallet={wallet}
          context={context}
        />
        <View pt={1}>
          <Text
            fW="bold"
            c="white"
            id={result ? 'you_bought' : 'you_buy'}
            capitalize
          />
        </View>
        <AmountCurrencyLayout
          amount={to_total_amount}
          // wallet={wallet}
          wallet={convWallet}
          context={context}
        />
      </>
    </View>
  );
}
