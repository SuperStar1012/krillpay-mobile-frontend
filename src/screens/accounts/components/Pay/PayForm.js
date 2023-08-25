import React from 'react';

import PayCurrency from './PayCurrencyNew';
import PayRecipient from './PayRecipient';
import PayAmount from './PayAmount';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { Button, View } from 'components';
import { Pressable, Keyboard } from 'react-native';

export default function PayForm(props) {
  const {
    handleButtonPress,
    formikProps,
    request,
    quote,
    hooks,
    data,
    error,
    currency,
    hideCurrency,
    requiresQuote,
  } = props;

  const { currencyCode, expired = false } = hooks;
  const { values } = formikProps;
  const { editing } = values;
  const { isValid, isSubmitting, errors } = formikProps;

  const available = currency?.available_balance;
  const amount = request
    ? values?.amount
    : parseFloat(values?.amount) * 10 ** currency?.currency?.divisibility;

  const isBlankRequest = [0, null, 'None'].includes(request?.request_amount);
  const insufficientBalance =
    (currencyCode === data.currencyCode || !requiresQuote) &&
    amount > available;

  const disabled = Boolean(
    (!requiresQuote ||
      currencyCode === (data?.currencyCode ?? data?.currency) ||
      isBlankRequest) &&
      (!isValid ||
        Object.keys(isValid).length ||
        isSubmitting ||
        insufficientBalance),
  );

  return (
    <Pressable onPress={() => Keyboard.dismiss()}>
      <React.Fragment>
        <PayRecipient {...props} />
        <PayAmount {...{ ...props, isBlankRequest }} />
        {!hideCurrency && (
          <>
            <PayCurrency
              {...{ ...props, quote, isBlankRequest, formikProps }}
            />
            <ErrorOutput>
              {error
                ? error?.message ?? error
                : insufficientBalance
                ? 'Insufficient balance'
                : errors?.amount ?? ''}
            </ErrorOutput>
            <View pv={1}>
              <Button
                color={'primary'}
                wide
                onPress={() =>
                  editing
                    ? formikProps.setFieldValue('editing', false)
                    : handleButtonPress(formikProps)
                }
                label={
                  requiresQuote &&
                  currencyCode !== (data?.currencyCode ?? data?.currency)
                    ? 'CREATE' + (expired ? ' NEW' : '') + ' QUOTE'
                    : editing
                    ? 'SAVE'
                    : 'CONFIRM PAYMENT'
                }
                size="big"
                disabled={disabled}
                loading={isSubmitting}
              />
            </View>
          </>
        )}
      </React.Fragment>
      {/* {actions} */}
    </Pressable>
  );
}
