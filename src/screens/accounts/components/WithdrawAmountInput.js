import React from 'react';

import {
  formatConvAmount,
  getCurrencyCode,
  calculateRate,
} from '../util/rates';
import { View, TextField, Button, Text } from 'components';
import { send } from 'config/inputs';
import { useTheme } from 'components/context';
import { checkIfCrypto } from '../util/crypto';
import { useFeeWithConversion } from '../util/fees';

export default function WithdrawAmountInput(props) {
  const {
    services,
    rates,
    formikProps,
    currency,
    onSubmitEditing,
    withdrawCurrency,
    tier,
    crypto,
  } = props;
  const { values, setFieldValue, setFieldTouched, touched, errors } =
    formikProps;

  const field = { ...send.amount };
  const { colors } = useTheme();
  const isCrypto = checkIfCrypto({ currency: withdrawCurrency, crypto });

  const hasConversion =
    services?.conversion_service &&
    rates &&
    rates.rates &&
    rates.displayCurrency &&
    withdrawCurrency.code !== currency.currency.code;

  if (hasConversion) {
    let string = formatConvAmount({
      currency,
      values,
      rates,
      displayCurrency: withdrawCurrency,
    });
    field.helper = string;
    field.label =
      field.label +
      ' in ' +
      (values.display
        ? getCurrencyCode(withdrawCurrency)
        : getCurrencyCode(currency.currency));
  }

  field.placeholder = '0.00';

  const { feeString, feeConvString } = useFeeWithConversion(
    values.amount,
    tier,
    currency.currency,
    isCrypto ? 'withdraw_crypto' : 'withdraw_manual',
    calculateRate(
      currency?.currency?.code,
      rates.displayCurrency.code,
      rates.rates,
    ),
    rates.displayCurrency,
    true,
  );

  const value = values.amount;
  const touch = touched.amount;
  const error = errors.amount;
  let { helper, placeholder, label, type } = field;

  return (
    <View mb={1}>
      <View f={1} fD={'row'} w={'100%'} aI={'center'}>
        <View f={1}>
          <TextField
            currency={withdrawCurrency}
            helper={helper}
            placeholder={placeholder}
            label={label}
            value={value}
            error={touch && error}
            type={type}
            onBlur={() => setFieldTouched('amount')}
            onChangeText={value => setFieldValue('amount', value)}
            tintColor={colors.primary}
            onSubmitEditing={() => onSubmitEditing('amount', props)}
          />
        </View>
        {hasConversion ? (
          <Button
            type={'text'}
            icon={'swap-vert'}
            iconSet={'MaterialIcons'}
            color={'primary'}
            size={'large'}
            containerStyle={{ margin: 0 }}
            onPress={() => setFieldValue('display', !values.display)}
          />
        ) : null}
      </View>
      {Boolean(feeString) && (
        <View pl={1}>
          <Text s={13}>
            <Text s={13} fW={'500'}>
              Fee:
            </Text>{' '}
            {feeString}
            <Text s={13}>
              {feeConvString ? ' (' + feeConvString + ')' : ''}
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
}
