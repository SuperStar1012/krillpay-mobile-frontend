import React from 'react';
import { Text, View } from 'components';
import ExternalAccountDetails from 'screens/accounts/components/ExternalAccountDetails';
import { formatAmountString, useConversion } from 'utility/rates';
import AmountCurrencyLayout from 'screens/accounts/components/AmountCurrencyLayout';

export default function WithdrawHeader(props) {
  const { form, context, result } = props;

  const { note, withdrawAccount: item } = form.getValues();

  const { wallet, services, accountsConfig = {} } = context;
  const { amountDisplayCurrency = false } = accountsConfig;
  const { currency } = wallet;

  const { amount, conversionQuote, toCurrency } = form.getValues();

  let amountString = '';
  let convAmountString = '';
  const { to_total_amount, from_total_amount } = conversionQuote ?? {};
  if (conversionQuote) {
    amountString = formatAmountString(to_total_amount, toCurrency, true);
    convAmountString = formatAmountString(from_total_amount, currency, true);
  } else {
    amountString = formatAmountString(amount, toCurrency, false);
    ({ convAmount: convAmountString } = useConversion(
      amount,
      services,
      toCurrency,
      false,
    ));
    if (!convAmountString) convAmountString = amountString;
  }

  return (
    <View pt={0.5}>
      <Text
        c="white"
        fW="700"
        s={16}
        id={result ? 'withdraw_initiated' : 'withdraw'}
        capitalize
      />

      <>
        <View pv={0.25}>
          <Text c="white" fW="700" s={34}>
            {amountDisplayCurrency
              ? convAmountString //.substring(1)
              : amountString}
          </Text>
        </View>
        {Boolean(convAmountString) && (
          <Text c="white" s={14}>
            {amountDisplayCurrency ? amountString : convAmountString}
          </Text>
        )}
        <View pt={1}>
          <Text fW="bold" c="white" id="to_direction" capitalize />
        </View>
        <View fD="row" aI="center" pt={0.5} mr={3.5}>
          <ExternalAccountDetails
            noPadding
            showCode={false}
            bold
            item={item}
            currency={toCurrency}
            color="white"
          />
        </View>
        {Boolean(from_total_amount) && (
          <View pt={1}>
            <Text fW="bold" c="white" id="from" capitalize />
            <AmountCurrencyLayout
              wallet={wallet}
              // amount={from_total_amount}
              context={context}
            />
          </View>
        )}
        {Boolean(note) && (
          <View pt={1}>
            <Text fW="bold" c="white" id="note" capitalize />
            <View pt={0.5}>
              <Text c="white">{note}</Text>
            </View>
          </View>
        )}
      </>
    </View>
  );
}
