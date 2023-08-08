import React, { Component, useState } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';

import { get, isEmpty } from 'lodash';
import { updateConversion } from 'utility/rehive';
import {
  calculateRate,
  formatDecimals,
  renderRate,
  formatAmountString,
  getCurrencyCode,
} from '../../util/rates';
import ConversionRate from '../ConversionRate';
import { exchange } from 'config/inputs';

import ExchangeConfirm from '../ExchangeConfirm';
import ResultPage from 'components/layout/ResultPageNew';

import CurrencySelectorCard from '../CurrencySelectorCard';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { displayFormatDivisibility } from 'utility/general';
import { View, Text, Button, EmptyListMessage } from 'components';
import FormikInput from 'components/inputs/FormikInput';
import { useFee } from '../../util/fees';
import CompanyStatusBanner from 'components/auth/CompanyStatusBanner';
import CurrencyBadge from 'components/outputs/CurrencyBadge';
import ExchangeConfirmHeader from '../ExchangeConfirmHeader';
import ExchangeConfirmDetails from '../ExchangeConfirmDetails';
import NumpadOnly from 'components/inputs/NumpadOnly';
import { useTheme } from 'contexts/ThemeContext';

export default function ExchangeForm(props) {
  // state = {
  //   index: 0,
  //   formState: '',
  //   result: null,
  //   successDetailsItems: [],
  //   focusedField: 'sell',
  // };
  // constructor(props) {
  //   super(props);
  //   this.handleButtonPress = this.handleButtonPress.bind(this);
  // }

  // componentDidUpdate(prevProps, prevStates) {
  //   if (
  //     prevStates.formState !== this.state.formState &&
  //     this.props.setBackgroundColor
  //   ) {
  //     if (['confirm', 'result'].includes(this.state.formState)) {
  //       this.props.setBackgroundColor('#f8f8f8');
  //     } else {
  //       this.props.setBackgroundColor('#ffffff');
  //     }
  //   }
  // }
  const {
    currency,
    tier,
    currencies,
    currencyIndexHook,
    navigation,
    conversionPairs,
    rates,
    onSuccess,
  } = props;

  const { colors } = useTheme();

  const [formState, setFormState] = useState('');
  const [result, setResult] = useState(null);
  const [focusedField, setFocusedField] = useState('sell');
  const [successDetailsItems, setSuccessDetailsItems] = useState([]);

  async function handleFormSubmit(formikProps) {
    const { values, setSubmitting } = formikProps;
    const { id } = values;

    setSubmitting(true);
    let response = null;

    try {
      response = await updateConversion(id, 'complete');
      onSuccess();
      setFormState('result');
      setResult(response);
      // this.setState({ formState: 'result', result: response, values });
    } catch (error) {
      console.log(error);
      let result = '';
      if (
        error.message.includes('transaction') &&
        error.message.includes('amount')
      ) {
        if (error.message.includes(' 0.0')) {
          result = `You're unable to complete this exchange, required tier not met.`;
        } else {
          result = `You've reached your buy limit, required tier not met.`;
        }
      } else {
        result =
          'Unable to complete exchange' +
          (error.message ? ': ' + error.message : '');
      }
      setFormState('result');
      setResult(result);
      // this.setState({ formState: 'result', result });
    }
    setSubmitting(false);
  }

  function handleButtonPress(formikProps, type) {
    formikProps && formikProps.setStatus({ error: '' });

    let nextFormState = formState;
    switch (formState) {
      case 'confirm':
        if (type === 'confirm') {
          handleFormSubmit(formikProps);
        } else {
          nextFormState = '';
        }
        break;
      case 'result':
        if (type === 'success') {
          const currency = currencies.data[currencyIndexHook[0]];
          navigation.navigate('Wallets', { currency });
        }
        nextFormState = '';
        break;
      default:
        if (type === 'add') {
          nextFormState = 'add';
        } else {
          nextFormState = 'confirm';
        }
        break;
    }
    setFormState(nextFormState);
    // this.setState({ formState: nextFormState });
  }

  function renderSellCurrency(formikProps) {
    const { values, setFieldValue } = formikProps;
    const { sell } = values;

    let temp = { ...currencies };

    temp.data = currencies.items.filter(
      item =>
        conversionPairs.fromCurrencies.findIndex(
          code => item.currency.code === code,
        ) !== -1,
    );

    return (
      <CurrencySelectorCard
        cardType={'wallet'}
        title={'Spending'}
        titleTextAlign="left"
        titleIconContent={
          <MaterialIcons
            name="account-balance-wallet"
            size={12}
            color="#ffffff"
            style={{
              backgroundColor: colors.primary,
              padding: 4,
              borderRadius: 12,
            }}
          />
        }
        rates={rates}
        filtered={temp}
        currency={currency}
        currencies={temp}
        updateCurrency={index => {
          const tempCurrency = temp.data[index];

          try {
            const tempCode = tempCurrency.currency.code;
            const tempIndex = currencies.items.findIndex(
              curr =>
                curr.account === tempCurrency.account &&
                curr.currency.code === tempCode,
            );
            currencyIndexHook[1](tempIndex);

            const items = conversionPairs.items.filter(
              pair => pair.key.split(':')[0] === tempCode,
            );
            const tempKey = items[0].key.split(':')[1];

            setFieldValue('toCode', tempKey);
            const rate = calculateRate(tempCode, tempKey, rates.rates);
            setFieldValue(
              'buy',
              sell
                ? formatDecimals(
                    parseFloat(sell) * rate,
                    currencies?.items?.[index]?.currency?.divisibility,
                  ).toString()
                : '',
            );
          } catch (e) {
            console.log('TCL: ExchangeForm -> renderSellCurrency -> e', e);
          }
        }}>
        <Text s={14} fW="500" style={{ marginBottom: 6 }}>
          From
        </Text>
        <View w={'100%'} aI={'center'} fD={'row'}>
          <CurrencyBadge
            text={currency?.currency?.code}
            currency={currency?.currency}
            size={20}
          />
          <Text
            s={20}
            style={{
              paddingLeft: 8,
              paddingRight: 8,
            }}>
            {getCurrencyCode(currency.currency)}
          </Text>
          <FontAwesome5
            name="caret-down"
            size={12}
            color={'black'}
            style={{ opacity: 0.8, marginTop: -4 }}
          />
        </View>
      </CurrencySelectorCard>
    );
  }

  function renderSell(formikProps) {
    const { values = {} } = formikProps;
    const { toCurrency } = values;
    const rate = calculateRate(
      currency?.currency?.code,
      toCurrency?.currency?.code,
      rates.rates,
    );

    if (!toCurrency) {
      return null;
    }
    return (
      <React.Fragment>
        <View fD={'row'}>
          <View style={{ paddingTop: 6 }} w="40%">
            {renderSellCurrency(formikProps)}
          </View>
          <View f={5} jC="flex-end" style={{ marginTop: -12 }}>
            <FormikInput
              editable={false}
              label=""
              // label={getCurrencyCode(currency.currency)}
              activeInputPlaceholder
              placeholder={`0.00 ${getCurrencyCode(currency.currency)}`}
              formikProps={formikProps}
              currency={currency.currency}
              // onSubmitEditing={() => this.handleButtonPress(formikProps)} TODO:
              labelTextStyle={{ fontSize: 10, fontWeight: 'bold' }}
              onChange={value => {
                const amount = value;
                formikProps.setFieldValue('sell', amount);
                formikProps.setFieldValue(
                  'buy',
                  amount
                    ? formatDecimals(
                        parseFloat(amount) * rate,
                        toCurrency?.currency?.divisibility,
                      ).toString()
                    : '',
                );
              }}
              field={{
                ...exchange.sell,
                helper:
                  'Balance: ' +
                  displayFormatDivisibility(
                    currency.available_balance,
                    currency.currency.divisibility,
                  ) +
                  ' ' +
                  getCurrencyCode(currency.currency),
                helperTextStyle: { color: colors.primary, fontSize: 12 },
                helperWrapperStyle: { alignItems: 'flex-end' },
              }}
              // onFocus={() => this.setState({ focusedField: 'sell' })}
              style={{ textAlign: 'right' }}
            />
          </View>
        </View>
        {/* <LimitsList
          tier={get(tier, ['items', 0], null)}
          subtype={'sell'}
          currency={currency}
        /> */}
      </React.Fragment>
    );
  }

  function renderRate(formikProps) {
    const fromCode = currency.currency.code;
    const { toCurrency } = formikProps?.values ?? {};
    const toCode = toCurrency?.currency?.code;

    const rate = calculateRate(fromCode, toCode, rates.rates);
    const rateString = renderRate({ fromCurrency: currency, toCurrency, rate });

    return (
      <View pv={1} style={{ marginTop: 16 }}>
        <ConversionRate textStyle={{ fontSize: 14 }}>
          {rateString}
        </ConversionRate>
      </View>
    );
  }

  function renderBuyCurrency(formikProps) {
    const { values = {}, setFieldValue } = formikProps;
    const { toCurrency, sell } = values ?? {};

    let temp = { ...currencies };

    const toCodes = conversionPairs.items
      .filter(
        pair =>
          pair.key.split(':')[0] === currency.currency.code &&
          currencies.items.findIndex(
            curr => curr.currency.code === pair.key.split(':')[1],
          ) !== -1,
      )
      .map(item => item.key.split(':')[1]);

    temp.data = currencies.items.filter(
      item => toCodes.findIndex(code => item.currency.code === code) !== -1,
    );

    return (
      <CurrencySelectorCard
        cardType={'wallet'}
        title={'Buying'}
        titleTextAlign="left"
        titleIconContent={
          <MaterialIcons
            name="account-balance-wallet"
            size={12}
            color="#ffffff"
            style={{
              backgroundColor: colors.primary,
              padding: 4,
              borderRadius: 12,
            }}
          />
        }
        rates={rates}
        filtered={temp}
        currency={toCurrency}
        currencies={temp}
        updateCurrency={index => {
          const toCurrency = temp?.data?.[index] ?? {};

          setFieldValue('toCurrency', toCurrency);

          const rate = calculateRate(
            currency?.currency?.code,
            toCurrency?.currency?.code,
            rates.rates,
          );

          setFieldValue(
            'buy',
            sell
              ? formatDecimals(
                  parseFloat(sell) * rate,
                  toCurrency?.currency?.divisibility,
                ).toString()
              : '',
          );
        }}>
        <Text s={14} fW="500" style={{ marginBottom: 6 }}>
          To
        </Text>
        <View w={'100%'} aI={'center'} fD={'row'}>
          <CurrencyBadge
            text={toCurrency?.currency?.code}
            currency={toCurrency?.currency}
            size={20}
          />
          <Text
            s={20}
            style={{
              paddingLeft: 8,
              paddingRight: 8,
            }}>
            {getCurrencyCode(toCurrency.currency)}
          </Text>
          <FontAwesome5
            name="caret-down"
            size={12}
            color={'black'}
            style={{ opacity: 0.8, marginTop: -4 }}
          />
        </View>
      </CurrencySelectorCard>
    );
  }

  function renderBuy(formikProps) {
    const { values } = formikProps;

    const { toCurrency } = values;

    const rate = calculateRate(
      currency.currency.code,
      toCurrency.currency.code,
      rates.rates,
    );

    if (!toCurrency) {
      return null;
    }
    return (
      <React.Fragment>
        <View fD={'row'}>
          <View style={{ paddingTop: 12 }} w="40%">
            {renderBuyCurrency(formikProps)}
          </View>
          <View f={5} jC="flex-end" style={{ marginTop: 6 }}>
            <FormikInput
              editable={false}
              label=""
              labelTextStyle={{ fontSize: 10, fontWeight: 'bold' }}
              activeInputPlaceholder
              placeholder={`0.00 ${getCurrencyCode(toCurrency.currency)}`}
              field={{
                ...exchange.buy,
                // helper:
                //   'Available balance: ' +
                //   displayFormatDivisibility(
                //     toCurrency.available_balance,
                //     toCurrency.currency.divisibility
                //   ) +
                //   ' ' +
                //   toCurrency.currency.code,
                helperWrapperStyle: { alignItems: 'flex-end' },
              }}
              formikProps={formikProps}
              currency={toCurrency.currency}
              // onSubmitEditing={() => this.handleButtonPress(formikProps)} TODO:
              onChange={value => {
                try {
                  const amount = value;
                  formikProps.setFieldValue('buy', amount);
                  formikProps.setFieldValue(
                    'sell',
                    amount
                      ? formatDecimals(
                          parseFloat(amount) / rate,
                          currency.currency.divisibility,
                          true,
                        ).toString()
                      : '',
                  );
                  formikProps.setFieldTouched('sell', amount ? true : false);
                } catch (e) {
                  console.log('TCL: renderSell -> e', e);
                  formikProps.setFieldValue('sell', '0');
                }
              }}
              // onFocus={() => this.setState({ focusedField: 'buy' })}
              style={{ textAlign: 'right' }}
              inputContainerStyle={{ borderBottomWidth: 0 }}
            />
          </View>
        </View>
        {/* <View ph={0.75}>
          <LimitsList
            tier={get(tier, ['items', 0], null)}
            subtype={'buy'}
            currency={toCurrency}
          />
        </View> */}
      </React.Fragment>
    );
  }

  function setNumPadValue(value, formikProps, focusedField) {
    const { values } = formikProps;
    formikProps.setFieldTouched(focusedField);

    const { toCurrency } = values;

    const rate = calculateRate(
      currency.currency.code,
      toCurrency.currency.code,
      rates.rates,
    );

    if (focusedField === 'sell') {
      formikProps.setFieldValue('sell', value);
      formikProps.setFieldValue(
        'buy',
        value
          ? formatDecimals(
              parseFloat(value) * rate,
              toCurrency.currency.divisibility,
            ).toString()
          : '',
      );
    } else {
      formikProps.setFieldValue('buy', value);
      formikProps.setFieldValue(
        'sell',
        value
          ? formatDecimals(
              parseFloat(value) / rate,
              currency.currency.divisibility,
              true,
            ).toString()
          : '',
      );
      formikProps.setFieldTouched('sell', value ? true : false);
    }
  }

  function renderForm(formikProps) {
    const { values } = formikProps;
    // const { focusedField } = this.state;
    if (isEmpty(formikProps)) {
      return null;
    }
    return (
      <React.Fragment>
        {/* {this.renderSellCurrency(formikProps)} */}
        {renderSell(formikProps)}
        {renderBuy(formikProps)}
        {renderRate(formikProps)}
        <View mt={2} mh={1.5}>
          <NumpadOnly
            currency={currency}
            inputValue={values[focusedField]}
            setValue={value => setNumPadValue(value, formikProps, focusedField)}
          />
        </View>

        <View
          pv={1.5}
          style={{
            position: 'absolute',
            backgroundColor: 'transparent',
            bottom: 0,
            left: 0,
            width: '100%',
          }}>
          <Button
            color={'primary'}
            wide
            onPress={() => handleButtonPress(formikProps)}
            label="EXCHANGE"
            size="big"
            disabled={!formikProps.isValid}
            noMargin
          />
        </View>
      </React.Fragment>
    );
  }

  function renderConfirm(formikProps) {
    const { toCurrency } = formikProps?.values ?? {};

    return (
      <ExchangeConfirm
        primaryAccount={currencies.primaryAccount}
        toCurrency={toCurrency}
        handleButtonPress={handleButtonPress}
        fromCurrency={currency}
        formikProps={formikProps}
        tier={tier}
        currencies={currencies}
        setSuccessDetailsItems={setSuccessDetailsItems}
      />
    );
  }

  function renderResult(formikProps) {
    let { toCurrency } = formikProps?.values ?? {};

    let header,
      detail,
      closeBtnTitle = 'CLOSE';
    if (result?.status === 'success') {
      header = (
        <ExchangeConfirmHeader
          primaryAccount={currencies.primaryAccount}
          toCurrency={toCurrency}
          fromCurrency={currency}
          tier={tier}
          currencies={currencies}
          fromAmount={result?.data?.from_amount}
          toAmount={result?.data?.to_amount}
          bC="success"
        />
      );
      detail = <ExchangeConfirmDetails items={successDetailsItems} />;
      closeBtnTitle = 'DONE';
    }

    return (
      <ResultPage
        result={result}
        onNext={() => handleButtonPress(formikProps, result?.status)}
        formikProps={formikProps}
        header={header}
        standAloneHeader
        detail={detail}
        closeBtnTitle={closeBtnTitle}
      />
    );
  }

  function validate(values, schema) {
    let result = {};
    try {
      result = schema.validateSync(values);
    } catch (e) {
      result = e;
      // console.log('e', e);
    }
    return result;
  }

  function validation(values, initial) {
    try {
      const { sell } = values;
      let schema = yup.object().shape({
        toCurrency: yup.object().required(),
        sell: yup
          .number()
          .typeError('Please enter a valid number')
          .moreThan(0, 'Sell amount must be more than 0')
          // .max(
          //   currency.available_balance / 10 ** currency.currency.divisibility,
          //   'Available balance exceeded: ' +
          //     displayFormatDivisibility(
          //       currency.available_balance,
          //       currency.currency.divisibility,
          //     ) +
          //     ' ' +
          //     currency.currency.code,
          // ) // this might need to be formatted / serialized
          .required('Sell amount is required'),
      });

      let errors = validate(values, schema);
      if (errors.path) {
        return {
          [errors.path]: errors.message,
        };
      }

      const { totalAmount, feeAmount } = useFee(
        sell,
        tier,
        currency.currency,
        'sell',
      );
      const availableAmount = currency.available_balance;

      if (totalAmount > availableAmount) {
        return {
          sell:
            'Available balance exceeded: ' +
            formatAmountString(totalAmount, currency.currency, true) +
            (feeAmount
              ? ' (fee: ' +
                formatAmountString(feeAmount, currency.currency, true) +
                ')'
              : ''),
        };
      }

      if (initial) {
        return true;
      }
      return {};
    } catch (e) {
      console.log('TCL: TransferForm -> validation -> e', e);
    }
  }

  const items = conversionPairs.items.filter(
    pair => pair.key.split(':')[0] === currency.currency.code,
  );

  const temp = items.find(
    item =>
      currencies.items.findIndex(
        curr => curr.currency.code === item.key.split(':')[1],
      ) !== -1,
  );
  if (!temp) {
    return <EmptyListMessage>No valid exchange pairs</EmptyListMessage>;
  }
  const toCode = temp.key.split(':')[1];

  const toCurrency = currencies.items.find(
    curr => curr.currency.code === toCode,
  );

  const formInitialValues = {
    buy: '',
    sell: '',
    toCurrency,
    id: '',
    currency,
    expired: false,
  };

  return (
    <Formik
      initialValues={formInitialValues}
      enableReinitialize
      validate={values => {
        const valid = validation(values);
        return valid;
      }}>
      {formikProps => (
        <View f={1} h="100%">
          <CompanyStatusBanner />
          <View ph={1.5} pv={1} f={1}>
            {formState === 'result'
              ? renderResult(formikProps)
              : formState === 'confirm'
              ? renderConfirm(formikProps)
              : renderForm(formikProps)}
          </View>
        </View>
      )}
    </Formik>
  );
}
