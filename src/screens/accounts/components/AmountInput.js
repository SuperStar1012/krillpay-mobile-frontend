import React from 'react';
import moment from 'moment';
import {
  formatConvAmount,
  convertAmount,
  calculateRate,
  getCurrencyCode,
  formatDecimals,
} from '../util/rates';
import { View, TextField, Button } from 'components';
import { send } from 'config/inputs';
import { useTheme } from 'components/context';
import { useTranslation } from 'react-i18next';

export default function AmountInput(props) {
  const {
    services,
    rates,
    formikProps,
    wallet,
    currency = wallet,
    onSubmitEditing,
    helper,
    hideConversion,
    fieldProps = {},
  } = props;

  const { colors } = useTheme();

  const { values, setFieldValue, setFieldTouched, touched, errors } =
    formikProps;

  const field = { ...send.amount, ...fieldProps, helper };

  const hasConversion =
    !hideConversion &&
    services['Conversion Service'] &&
    rates &&
    rates.rates &&
    rates.displayCurrency &&
    rates.displayCurrency.code != currency.currency.code;

  let convRate = 0;
  const { t } = useTranslation(['common']);
  let context = {};

  if (rates && hasConversion) {
    convRate = rates
      ? calculateRate(
          currency.currency.code,
          rates.displayCurrency.code,
          rates.rates,
        )
      : 0;

    if (convRate) {
      let string =
        '~' +
        formatConvAmount({ currency, values, rates }) +
        (convRate
          ? ' ' + t('as_of') + ' ' + moment(convRate.created).fromNow()
          : '');
      field.helper = values?.amount > 0 || !helper ? string : field.helper;
      field.label = 'amount_in';
      context = {
        currencyCode: values.display
          ? getCurrencyCode(rates.displayCurrency)
          : getCurrencyCode(currency.currency),
      };
    }
    field.placeholder = '0.00';
  }

  const value = values.amount;
  const touch = touched.amount;
  const error = errors.amount;
  let { id, placeholder, label = id, type } = field;
  label = t(label, context);

  const onAmountChange = value => {
    const newAmount = formatDecimals(
      convertAmount({
        currency,
        values: value ? { ...values, amount: value } : values,
        rates,
      }),
      values.display
        ? currency.currency.divisibility
        : rates.displayCurrency.divisibility,
      true,
    );

    setFieldValue(
      'displayAmount',
      values?.display ? value ?? values?.amount : newAmount,
    );
    setFieldValue(
      'baseAmount',
      !values?.display ? value ?? values?.amount : newAmount,
    );

    setFieldValue('amount', value ?? newAmount);
  };

  return (
    <View fD={'row'} aI={'center'}>
      <View f={1}>
        <TextField
          helper={field.helper}
          placeholder={placeholder}
          label={label}
          value={value}
          multiline={false}
          error={touch && error}
          type={type}
          currency={currency.currency}
          onBlur={() => setFieldTouched('amount')}
          onChangeText={value => onAmountChange(value)}
          tintColor={colors.primary}
          onSubmitEditing={() => onSubmitEditing('amount', props)}
        />
      </View>
      {hasConversion && convRate ? (
        <Button
          type={'text'}
          icon={'swap-vert'}
          iconSet={'MaterialIcons'}
          color={'primary'}
          size={'large'}
          containerStyle={{ margin: 0 }}
          buttonStyle={{ paddingHorizontal: 0, paddingLeft: 10, minWidth: 30 }}
          onPress={() => {
            if (!values.amount) return;

            onAmountChange();
            setFieldValue('display', !values.display);
          }}
        />
      ) : null}
    </View>
  );
}
