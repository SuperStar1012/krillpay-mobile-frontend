import React from 'react';

import PayCurrency from './PayCurrencyNew';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { Button, View } from 'components';
import { Pressable, Keyboard } from 'react-native';
import Numpad from 'components/inputs/Numpad';

import { formatDivisibility } from 'utility/general';
import { calculateRate } from 'screens/accounts/util/rates';

export default function PayStaticForm(props) {
  const {
    handleButtonPress,
    hooks,
    data,
    error,
    requiresQuote,
    values,
    context,
    errors,
  } = props;
  const { wallet, rates } = context;
  const { currency } = wallet;

  const { currencyCode, isSubmitting } = hooks;
  const { amount } = values;

  const available = wallet?.available_balance;
  const amountValue = parseFloat(amount) * 10 ** currency?.divisibility;

  const insufficientBalance =
    (currencyCode === data.currencyCode || !requiresQuote) &&
    amountValue > available;

  const disabled = !amount || !!insufficientBalance;

  const convRate = calculateRate(
    rates?.displayCurrency?.code,
    currency?.code,
    rates?.rates,
  );

  let maxFloat = formatDivisibility(
    available * convRate,
    currency?.divisibility,
  );

  return (
    <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
      <View f={1}>
        <View f={1} pt={1}>
          <Numpad
            {...props}
            max={maxFloat}
            error={insufficientBalance ? 'Insufficent balance' : ''}
          />
        </View>

        <>
          <PayCurrency {...props} />
          <ErrorOutput>{error ? error : errors?.amount}</ErrorOutput>
          <View pv={1}>
            <Button
              color={'primary'}
              wide
              onPress={handleButtonPress}
              label={'NEXT'}
              size="big"
              disabled={disabled}
              loading={isSubmitting}
            />
          </View>
        </>
      </View>
    </Pressable>
  );
}
