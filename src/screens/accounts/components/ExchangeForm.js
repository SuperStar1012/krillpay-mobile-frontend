import React, { Component } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';

import { updateConversion } from 'utility/rehive';
import {
  calculateRate,
  formatDecimals,
  renderRate,
  formatAmountString,
  getCurrencyCode,
} from '../util/rates';
import ConversionRate from './ConversionRate';
import { exchange } from 'config/inputs';

import ExchangeConfirm from './ExchangeConfirm';
import ResultPage from 'components/layout/ResultPage';

import CurrencySelectorCard from './CurrencySelectorCard';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { displayFormatDivisibility } from 'utility/general';
import { View, Text, Button, EmptyListMessage } from 'components';
import FormikInput from 'components/inputs/FormikInput';
import { useFee } from '../util/fees';
import { useTranslation } from 'react-i18next';
import { getUserCountryFromMSISDN } from 'utility/general';
class ExchangeForm extends Component {
  state = {
    index: 0,
    formState: '',
    result: null,
  };
  constructor(props) {
    super(props);
    this.handleButtonPress = this.handleButtonPress.bind(this);
  }

  async handleFormSubmit(props) {
    const { values, setSubmitting } = props; // FormikProps
    const { id } = values;
    const { fetchAccounts, setFormState, setData } = this.props;

    setSubmitting(true);
    let response = null;

    try {
      response = await updateConversion(id, 'complete');
      fetchAccounts();
      setData(null);
      await this.setState({ result: response, values });
      setFormState('result');
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
      await this.setState({ result, values });
      setFormState('result');
    }
    setFormState('result');
    setSubmitting(false);
  }

  handleButtonPress(props, type) {
    props && props.setStatus({ error: '' });

    const { currencies, currencyIndexHook, setFormState, formState } =
      this.props;

    let nextFormState = formState;
    switch (formState) {
      case 'confirm':
        if (type === 'confirm') {
          this.handleFormSubmit(props);
        } else {
          nextFormState = '';
        }
        break;
      case 'result':
        if (type === 'success') {
          const currency = currencies.data[currencyIndexHook[0]];
          this.props.navigation.navigate('Wallets', { currency });
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
  }

  renderRate(props) {
    const { rates, currency } = this.props;

    const fromCode = currency.currency.code;
    const { toCurrency } = props.values;
    const toCode = toCurrency.currency.code;

    const rate = calculateRate(fromCode, toCode, rates.rates);
    const rateString = renderRate({ fromCurrency: currency, toCurrency, rate });

    return (
      <View pv={1}>
        <ConversionRate>{rateString}</ConversionRate>
      </View>
    );
  }

  renderForm(props) {
    return (
      <View ph={0.5} f={1}>
        <View f={1} scrollView>
          {/* {this.renderSellCurrency(props)} */}
          <SellAmount {...this.props} formikProps={props} />
          {this.renderRate(props)}
          <BuyAmount {...this.props} formikProps={props} />
        </View>
        <View pv={0.5}>
          <Button
            color={'primary'}
            wide
            onPress={() => this.handleButtonPress(props)}
            id="exchange"
            size="big"
            disabled={!props.isValid}
            noMargin
          />
        </View>
      </View>
    );
  }

  renderConfirm(props) {
    const { currency, currencies } = this.props;
    const { toCurrency } = props.values;

    return (
      <ExchangeConfirm
        {...this.props}
        primaryAccount={currencies.primaryAccount}
        toCurrency={toCurrency}
        handleButtonPress={this.handleButtonPress}
        fromCurrency={currency}
        formikProps={props}
      />
    );
  }

  renderResult(props) {
    const { result, values = {} } = this.state;
    let { sell, buy, toCurrency } = values;

    const { currency } = this.props;

    const sellString =
      formatDecimals(parseFloat(sell), currency.currency.divisibility) +
      ' ' +
      getCurrencyCode(currency.currency);
    const buyString =
      formatDecimals(parseFloat(buy), toCurrency.currency.divisibility) +
      ' ' +
      getCurrencyCode(toCurrency.currency);

    return (
      <ResultPage
        id={
          result.id || result.status === 'success'
            ? 'exchange_success'
            : 'exchange_fail'
        }
        context={{ buyString, sellString }}
        // bC="white"
        // amount={amountString}
        result={result}
        handleButtonPress={this.handleButtonPress}
        formikProps={props}
      />
    );
  }

  validate(values, schema) {
    let result = {};
    try {
      result = schema.validateSync(values);
    } catch (e) {
      result = e;
      // console.log('e', e);
    }
    return result;
  }

  validation(values, initial) {
    try {
      const { currency, tier } = this.props;
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
          //     formatDivisibility(
          //       currency.available_balance,
          //       currency.currency.divisibility,
          //     ) +
          //     ' ' +
          //     currency.currency.code,
          // ) // this might need to be formatted / serialized
          .required('Sell amount is required'),
      });

      let errors = this.validate(values, schema);
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

  render() {
    const { currency, conversionPairs, currencies, formState, user } = this.props;

   const conversionPairsx  =  getUserCountryFromMSISDN(user?.mobile) == "US" ? 
   [{
      "id": "4fea572c-bea3-4e96-bcc9-c5f33399fe6d",
      "key": "USD:USD",
      "created": 1675192353700,
      "updated": 1675192353700
    }, {
      "id": "4fea572c-bea3-4e96-bcc9-c5f33399fe6d",
      "key": "USD:USD",
      "created": 1675192345406,
      "updated": 1675192345406
    }] : 
    conversionPairs.items;

    const items = conversionPairsx.filter(
      pair => pair.key.split(':')[0] === currency.currency.code,
    );

    const temp = items.find(
      item =>
        currencies.data.findIndex(
          curr => curr.currency.code === item.key.split(':')[1],
        ) !== -1,
    );
    if (!temp) {
      return <EmptyListMessage>No valid exchange pairs</EmptyListMessage>;
    }
    const toCode = temp.key.split(':')[1];

    const toCurrency = currencies.data.find(
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
          const valid = this.validation(values);
          return valid;
        }}>
        {props => (
          <View p={formState === 'result' ? 0 : 1} f={1} keyboardAvoiding>
            {formState === 'result'
              ? this.renderResult(props)
              : formState === 'confirm'
              ? this.renderConfirm(props)
              : this.renderForm(props)}
          </View>
        )}
      </Formik>
    );
  }
}

export default ExchangeForm;

function BuyAmount(props) {
  const { rates, currency, formikProps } = props;
  const { values, setFieldValue } = formikProps;

  const { toCurrency } = values;

  const rate = calculateRate(
    currency.currency.code,
    toCurrency.currency.code,
    rates.rates,
  );

  const { t } = useTranslation('common');

  function renderBuyCurrency(props) {
    const { currencies, conversionPairs } = props;

    const { toCurrency, sell } = values;

    let temp = { ...currencies };

    const toCodes = conversionPairs.items
      .filter(
        pair =>
          pair.key.split(':')[0] === currency.currency.code &&
          currencies.data.findIndex(
            curr => curr.currency.code === pair.key.split(':')[1],
          ) !== -1,
      )
      .map(item => item.key.split(':')[1]);

    temp.data = currencies.data.filter(
      item => toCodes.findIndex(code => item.currency.code === code) !== -1,
    );

    const title = t('select_buy_account');
    return (
      <CurrencySelectorCard
        cardType={'wallet'}
        title={title}
        rates={rates}
        filtered={temp}
        currency={toCurrency}
        currencies={temp}
        updateCurrency={index => {
          const toCurrency = temp.data[index];

          setFieldValue('toCurrency', toCurrency);

          const rate = calculateRate(
            currency.currency.code,
            toCurrency.currency.code,
            rates.rates,
          );

          setFieldValue(
            'buy',
            sell
              ? formatDecimals(
                  parseFloat(sell) * rate,
                  toCurrency.currency.divisibility,
                ).toString()
              : '',
          );
        }}>
        <View w={'100%'} aI={'center'} fD={'row'} jC={'flex-end'}>
          <Text
            tA={'right'}
            s={20}
            style={{
              paddingRight: 8,
            }}>
            {getCurrencyCode(toCurrency.currency)}
          </Text>

          <Icon
            name="chevron-down"
            size={20}
            color={'black'}
            style={{ opacity: 0.8 }}
          />
        </View>
      </CurrencySelectorCard>
    );
  }

  if (!toCurrency) {
    return null;
  }
  return (
    <React.Fragment>
      <View fD={'row'}>
        <View f={5}>
          <FormikInput
            field={{
              ...exchange.buy,
              // helper:
              //   'Available balance: ' +
              //   formatDivisibility(
              //     toCurrency.available_balance,
              //     toCurrency.currency.divisibility
              //   ) +
              //   ' ' +
              //   toCurrency.currency.code,
            }}
            formikProps={formikProps}
            currency={toCurrency.currency}
            // onSubmitEditing={() => this.handleButtonPress(props)} TODO:
            onChange={value => {
              try {
                const amount = value;
                setFieldValue('buy', amount);
                setFieldValue(
                  'sell',
                  amount
                    ? formatDecimals(
                        parseFloat(amount) / rate,
                        currency.currency.divisibility,
                        true,
                      ).toString()
                    : '',
                );
                props.setFieldTouched('sell', amount ? true : false);
              } catch (e) {
                console.log('TCL: renderSell -> e', e);
                props.setFieldValue('sell', '0');
              }
            }}
          />
        </View>
        <View style={{ paddingTop: 24 }} f={2}>
          {renderBuyCurrency(props)}
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

function SellAmount(props) {
  const { rates, currency, formikProps } = props;
  const { values, setFieldValue } = formikProps;
  const { toCurrency } = values;
  const rate = calculateRate(
    currency.currency.code,
    toCurrency.currency.code,
    rates.rates,
  );

  const { t } = useTranslation('common');

  if (!toCurrency) {
    return null;
  }

  function renderSellCurrency() {
    const { currencies, conversionPairs, currencyIndexHook } = props;

    const { sell } = values;

    let temp = { ...currencies };

    temp.data = currencies.data.filter(
      item =>
        conversionPairs.fromCurrencies.findIndex(
          code => item.currency.code === code,
        ) !== -1,
    );

    const title = t('select_sell_account');
        
    return (
      <CurrencySelectorCard
        cardType={'wallet'}
        title={title}
        rates={rates}
        filtered={temp}
        currency={currency}
        currencies={temp}
        updateCurrency={index => {
          const tempCurrency = temp.data[index];

          try {
            const tempCode = tempCurrency.currency.code;
            const tempIndex = currencies.data.findIndex(
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
        <View w={'100%'} aI={'center'} fD={'row'} jC={'flex-end'}>
          <Text
            tA={'right'}
            s={20}
            style={{
              paddingRight: 8,
            }}>
            {getCurrencyCode(currency.currency)}
          </Text>
            
          <Icon
            name="chevron-down"
            size={20}
            color={'black'}
            style={{ opacity: 0.8 }}
          />
        </View>
      </CurrencySelectorCard>
    );
  }
  return (
    <React.Fragment>
      <View fD={'row'}>
        <View f={5}>
          <FormikInput
            formikProps={formikProps}
            currency={currency.currency}
            onChange={value => {
              const amount = value;
              setFieldValue('sell', amount);
              setFieldValue(
                'buy',
                amount
                  ? formatDecimals(
                      parseFloat(amount) * rate,
                      toCurrency.currency.divisibility,
                    ).toString()
                  : '',
              );
            }}
            field={{
              ...exchange.sell,
              helper:
                t('available_balance_prefix') +
                displayFormatDivisibility(
                  currency.available_balance,
                  currency.currency.divisibility,
                ) +
                ' ' +
                getCurrencyCode(currency.currency),
            }}
          />
        </View>
        <View style={{ paddingTop: 24 }} f={2}>
          {renderSellCurrency(formikProps)}
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
