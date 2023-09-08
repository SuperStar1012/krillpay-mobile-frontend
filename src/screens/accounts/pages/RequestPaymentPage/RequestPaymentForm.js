import React, { useState } from 'react';
import { Image } from 'react-native';
import { View, Button, Text, PopUpGeneral } from 'components';
import { createPaymentRequest } from 'utility/rehive';
import { Formik } from 'formik';
import * as yup from 'yup';
import { TextField } from 'components/inputs/TextField';
import { formatAmountString, calculateRate } from '../../util/rates';
import { IsEmail, isMobile } from 'utility/validation';
import CurrencySelectorCard from '../../components/CurrencySelectorCard';
import AmountInput from '../../components/AmountInput';
import RecipientInput from '../../components/RecipientInput';
import ContactList from '../../components/ContactList';
import { cleanMobile } from 'utility/general';
import { useTheme } from 'contexts/ThemeContext';

export default function RequestPaymentForm(props) {
  const {
    selectedCurrency,
    setSelectedCurrency,
    navigation,
    getRequests,
    services,
    currencies,
    rates,
    setRequestResult,
    contactMatch,
    blankRequestsEnabled,
  } = props;

  const { colors } = useTheme();

  const [state, setState] = useState();

  async function handleSubmit({ values, setSubmitting }) {
    let { amount, recipient, reason, display } = values;

    setSubmitting(true);
    setState('submitting');

    if (
      services?.conversion_service &&
      rates.rates &&
      rates.displayCurrency.code &&
      display
    ) {
      const convRate = calculateRate(
        selectedCurrency?.currency?.code,
        rates.displayCurrency.code,
        rates.rates,
      );
      amount = amount / convRate;
    }

    amount = parseInt(amount * 10 ** selectedCurrency.currency.divisibility);

    let request = {
      account: selectedCurrency.account,
      request_currency: selectedCurrency?.currency?.code,
      request_amount: Math.floor(amount),
    };

    if (IsEmail(recipient)) request.payer_email = recipient;
    else request.payer_mobile_number = cleanMobile(recipient);

    if (reason) request.description = reason;

    const response = await createPaymentRequest(request);

    setRequestResult({
      ...response,
      data: {
        ...response.data,
        amount: response.data.request_amount,
        user: {
          // ...response.data.payer_user,
          email: IsEmail(recipient) ? recipient : null,
          mobile: !IsEmail(recipient) ? recipient : null,
        },
        currency: selectedCurrency.currency,
        account: selectedCurrency.account,
      },
    });
    setSubmitting(false);
    setState('result');

    getRequests({ getReceived: false });
  }

  function renderForm() {
    const validationSchema = {
      recipient: yup
        .string()
        .required('Please enter a recipient')
        .test(
          'validate-type',
          'Please enter a valid email or mobile number (incl. country code)',
          value => {
            return IsEmail(value) || isMobile(value);
          },
        )
        .typeError(
          'Please enter a valid email or mobile number (incl. country code)',
        ),
    };

    if (!blankRequestsEnabled)
      validationSchema.amount = yup
        .number()
        .typeError('Please enter a valid number')
        .moreThan(0, 'Amount must be more than 0')
        .required('Amount is required');

    const formSchema = yup.object().shape(validationSchema);

    return (
      <View
        scrollView
        keyboardAvoiding
        keyboardAvoidingProps={{ keyboardVerticalOffset: 152 }}
        p={1}>
        <CurrencySelectorCard
          cardType={'wallet'}
          rates={rates}
          modal
          filtered={currencies}
          currency={
            currencies?.data?.find(
              x => x.currency?.code === selectedCurrency?.currency?.code,
            ) ?? currencies?.data?.[0]
          }
          returnIndex
          currencies={currencies}
          updateCurrency={index => {
            setSelectedCurrency(currencies?.data?.[index]);
          }}
        />
        <Formik
          initialValues={{ amount: null, recipient: null, reason: null }}
          validationSchema={formSchema}>
          {formikProps => (
            <View>
              {state === 'selectRecipient' ? (
                <ContactList
                  onSelect={({ contact }) => {
                    formikProps.setFieldValue('recipient', contact);
                    setState('');
                  }}
                />
              ) : (
                <View mt={1}>
                  <AmountInput
                    {...{
                      services,
                      rates,
                      formikProps,
                      currency: selectedCurrency,
                      helper: blankRequestsEnabled
                        ? 'If this field is empty, recipients can send any amount'
                        : null,
                    }}
                  />
                  <RecipientInput
                    {...{
                      formikProps,
                      currency: selectedCurrency,
                      onButtonPress: () =>
                        navigation.navigate('ContactListPage', {
                          pageTitle: 'Request payment',
                          onSelect: ({ contact }) => {
                            formikProps.setFieldValue('recipient', contact);
                            formikProps.setFieldTouched('recipient');
                          },
                        }),
                    }}
                  />
                  <TextField
                    label={'Note'}
                    value={formikProps.values.reason}
                    onBlur={() => formikProps.setFieldTouched('reason')}
                    onChangeText={value =>
                      formikProps.setFieldValue('reason', value)
                    }
                    tintColor={colors.primary}
                  />
                  <Button
                    color={'primary'}
                    wide
                    label="REQUEST"
                    size="big"
                    containerStyle={{ paddingTop: 18 }}
                    disabled={!formikProps.isValid || formikProps.isSubmitting}
                    loading={formikProps.isSubmitting}
                    onPress={() => setState('confirm')}
                  />
                  {renderConfirm(formikProps)}
                </View>
              )}
            </View>
          )}
        </Formik>
      </View>
    );
  }

  function renderConfirm(formikProps) {
    const { values } = formikProps;

    let conversionRate = 1;

    const hasConversion =
      services?.conversion_service &&
      rates.rates &&
      rates.displayCurrency.code &&
      rates.displayCurrency.code !== selectedCurrency?.currency?.code;

    if (hasConversion) {
      conversionRate = calculateRate(
        selectedCurrency?.currency?.code,
        rates.displayCurrency.code,
        rates.rates,
      );
    }

    let amountValue = 0.0;
    if (values.display) {
      amountValue = values.amount / conversionRate;
    } else {
      amountValue = values.amount;
    }

    const existing = contactMatch({
      email: values.recipient,
      mobile: values.recipient,
    });

    const contact = existing?.name || values.recipient;

    return (
      <PopUpGeneral
        visible={state === 'confirm'}
        buttonActions={[
          { text: 'Cancel', type: 'text', onPress: () => setState('') },
          { text: 'CONFIRM', onPress: () => handleSubmit(formikProps) },
        ]}
        onDismiss={() => {}}
        title={'Confirm request'}>
        <View mb={1} aI={'center'}>
          {existing?.image ? (
            <Image
              style={{ height: 72, width: 72, borderRadius: 100 }}
              source={{
                uri: existing.image,
              }}
              resizeMode={'contain'}
            />
          ) : (
            <View
              w={72}
              h={72}
              bC={'#DDD'}
              bR={100}
              jC={'center'}
              aI={'center'}>
              <Text c={'#9A9A9A'} fW={'700'} s={40}>
                {contact?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View mb={0.5}>
          <Text tA={'center'} lH={23}>
            You are about to request
            <Text c="primary" fW={'bold'}>
              {!values.amount || values.amount === 0 ? (
                ' any amount '
              ) : (
                <>
                  {' '}
                  {formatAmountString(
                    amountValue,
                    selectedCurrency.currency,
                  )}{' '}
                  {hasConversion &&
                    `(~${formatAmountString(
                      amountValue * conversionRate,
                      rates.displayCurrency,
                    )}) `}
                </>
              )}
            </Text>
            from{' '}
            <Text c="primary" fW={'bold'}>
              {values.recipient}
            </Text>
            {values.reason && <Text> for {values.reason}</Text>}
          </Text>
        </View>
      </PopUpGeneral>
    );
  }

  return renderForm();
}
