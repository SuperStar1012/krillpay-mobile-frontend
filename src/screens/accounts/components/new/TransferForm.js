import React, { Component } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';
import Big from 'big.js';
import _ from 'lodash';

import { View, Button, Text, LocalAuthentication } from 'components';
import FormikInput from 'components/inputs/FormikInput';
import { send } from 'config/inputs';
import { displayFormatDivisibility } from 'utility/general';
import { createTransfer } from 'utility/rehive';
import ResultPage from 'components/layout/ResultPage';
import {
  getCurrencyCode,
  formatDecimals,
  formatConvAmount,
} from '../../util/rates';
import CompanyStatusBanner from 'components/auth/CompanyStatusBanner';
import context from 'components/context';
import CurrencySelectorCard from '../CurrencySelectorCard';
import { FontAwesome5 } from '@expo/vector-icons';
import CurrencyBadge from 'components/outputs/CurrencyBadge';
import { CustomIcon } from 'components/outputs/CustomIcon';
import TransferCurrencySelector from '../TransferCurrencySelector';
import NumpadOnly from 'components/inputs/NumpadOnly';
import TransferConfirmHeader from '../TransferConfirmHeader';
import TransferConfirmDetails from '../TransferConfirmDetails';

class _ExchangeForm extends Component {
  state = {
    index: 0,
    formState: '',
    result: null,
  };

  async handleFormSubmit(props) {
    const { values, setSubmitting } = props; // FormikProps
    const { amount, fromAccount, toAccount, currency } = values;
    const { currencies, fetchAccounts } = this.props;
    const { divisibility } = currencies.data.find(
      curr =>
        curr.account === values.fromAccount &&
        curr.currency.code === values.currency,
    ).currency;
    setSubmitting(true);
    let response = null;

    try {
      let data = {
        amount: new Big(amount) * 10 ** divisibility,
        debit_account: fromAccount,
        credit_account: toAccount,
        credit_metadata: {
          rehive_context: {
            debit_account: fromAccount,
          },
        },
        debit_metadata: {
          rehive_context: {
            credit_account: toAccount,
          },
        },
        currency: currency,
        credit_subtype: 'receive_transfer',
        debit_subtype: 'send_transfer',
      };
      response = await createTransfer(data);
      fetchAccounts();
      this.setState({ formState: 'result', result: response });
    } catch (error) {
      console.log(error);
      this.setState({ formState: 'result', result: error.message });
    }
    setSubmitting(false);
  }

  componentDidUpdate(prevProps, prevStates) {
    if (
      prevStates.formState !== this.state.formState &&
      this.props.setBackgroundColor
    ) {
      if (['confirm', 'result'].includes(this.state.formState)) {
        this.props.setBackgroundColor('#f8f8f8');
      } else {
        this.props.setBackgroundColor('#ffffff');
      }
    }
  }

  handleButtonPress = (props, type) => {
    props && props.setStatus({ error: '' });
    const { values } = props;
    const { formState } = this.state;
    const { localAuth, pinConfig, currencies, navigation } = this.props;

    let nextFormState = formState;
    switch (formState) {
      case 'confirm':
        if (type === 'confirm') {
          if (pinConfig.transfer && (localAuth.pin || localAuth.biometrics)) {
            this.setState({ pinVisible: true });
          } else {
            this.handleFormSubmit(props);
          }
        } else {
          nextFormState = '';
        }
        break;
      case 'result':
        if (type === 'success') {
          const currency = currencies.data.find(
            curr =>
              curr.account === values.fromAccount &&
              curr.currency.code === values.currency,
          );
          navigation.navigate('Wallets', { currency });
        } else {
          nextFormState = '';
        }
        break;
      default:
        if (type === 'add') {
          nextFormState = 'add';
        } else {
          nextFormState = 'confirm';
        }
        break;
    }
    this.setState({ formState: nextFormState });
  };

  renderCurrencyInput(props) {
    const { currencies } = this.props;
    const { values, setFieldValue } = props;

    const grouped = _.groupBy(currencies.data, curr => curr.currency.code);
    const keys = Object.keys(grouped);

    const items = keys
      .filter(key => grouped[key].length > 1)
      .map(key => {
        return {
          label: key,
          value: grouped[key][0],
          key,
        };
      });

    const currency = currencies.data.find(
      curr =>
        curr.account === values.fromAccount &&
        curr.currency.code === values.currency,
    );

    const selectedAccount = currencies.data.find(
      item =>
        item.account === values.fromAccount &&
        item.currency.code === values.currency,
    );

    return (
      <CurrencySelectorCard
        currency={selectedAccount}
        currencies={currencies.data}
        filteredItems={items}
        updateCurrencyByCode
        updateCurrency={value => {
          setFieldValue('toAccount', '');
          setFieldValue(
            'fromAccount',
            currencies.data.find(curr => curr.currency.code === value).account,
          );
          setFieldValue('currency', value);
        }}>
        <View w={'100%'} aI={'center'} fD={'row'} mt={1}>
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

  renderFromAccount(props) {
    const { currencies } = this.props;
    const { values, setFieldValue } = props;
    const formatValue = item =>
      item.account +
      (currencies.multipleAccounts ? ' (' + item.account_name + '): ' : ': ') +
      displayFormatDivisibility(
        item.available_balance,
        item.currency.divisibility,
      ) +
      ' ' +
      getCurrencyCode(item.currency);

    const items = currencies.data.filter(
      curr => curr.currency.code === values.currency,
    );

    const selectedAccount = currencies.data.find(
      item =>
        item.account === values.fromAccount &&
        item.currency.code === values.currency,
    );

    return (
      <TransferCurrencySelector
        items={items}
        value={values.fromAccount}
        label={'From'}
        formatValue={formatValue}
        onValueChange={value => {
          setFieldValue('toAccount', '');
          setFieldValue('fromAccount', value);
        }}>
        {this.accountSelectorField(selectedAccount, 'From account')}
      </TransferCurrencySelector>
    );
  }

  renderToAccount(props) {
    const { currencies } = this.props;
    const { values, setFieldValue } = props;

    const items = currencies.data.filter(
      curr =>
        curr.currency.code === values.currency &&
        curr.account !== values.fromAccount,
    );

    const selectedAccount = currencies.data.find(
      item =>
        item.account === values.toAccount &&
        item.currency.code === values.currency,
    );

    return (
      <TransferCurrencySelector
        items={items}
        value={values.toAccount}
        onValueChange={value => setFieldValue('toAccount', value)}>
        {this.accountSelectorField(selectedAccount, 'To account')}
      </TransferCurrencySelector>
    );
  }

  accountSelectorField(selectedAccount, title = 'Account') {
    return (
      <View mt={1}>
        <Text fW="500">{title}</Text>
        {selectedAccount ? (
          <View fD="row" aI="center" jC="space-between" mt={0.5}>
            <View w="50%">
              <CustomIcon
                contained={true}
                name={selectedAccount.account_name}
                size={30}
              />
            </View>
            <View>
              <Text
                tA="right"
                c="#868686"
                s={12}
                fW="500"
                style={{ textTransform: 'uppercase' }}>
                {selectedAccount.account_name}
              </Text>
              <Text tA="right" c="primary" fW="500">
                {`${displayFormatDivisibility(
                  selectedAccount.available_balance,
                  selectedAccount.currency.divisibility,
                )} ${selectedAccount.currency.display_code}`}
              </Text>
            </View>
          </View>
        ) : (
          <View mt={0.5} mb={0.75}>
            <Text c="#868686">Select an account</Text>
          </View>
        )}
      </View>
    );
  }

  renderTransfer(props) {
    const { currencies, colors } = this.props;
    const { values, setFieldValue, setFieldTouched } = props;
    const currency = currencies.data.find(
      curr =>
        curr.account === values.fromAccount &&
        curr.currency.code === values.currency,
    );
    const currencyCode = getCurrencyCode(currency.currency);

    return (
      <View w={'100%'} p={1}>
        <View fD={'row'}>
          <View w="40%">{this.renderCurrencyInput(props)}</View>
          <View f={1} mt={-0.75}>
            <FormikInput
              editable={false}
              label=""
              activeInputPlaceholder
              placeholder={`0.00 ${currencyCode}`}
              field={{
                ...send.amount,
                helper:
                  'Balance: ' +
                  displayFormatDivisibility(
                    currency.available_balance,
                    currency.currency.divisibility,
                  ) +
                  ' ' +
                  currencyCode,
                helperTextStyle: { color: colors.primary, fontSize: 12 },
                helperWrapperStyle: { alignItems: 'flex-end' },
              }}
              value={values.amount}
              formikProps={props}
              onSubmitEditing={() => this.handleButtonPress(props)}
              style={{ textAlign: 'right' }}
            />
          </View>
        </View>

        {this.renderFromAccount(props)}
        {this.renderToAccount(props)}
        <View mt={2}>
          <NumpadOnly
            currency={currency}
            inputValue={values.amount}
            setValue={value => {
              setFieldTouched('amount');
              setFieldValue('amount', value);
            }}
          />
        </View>

        <View pv={1.5} w={'100%'}>
          <Button
            color={'primary'}
            onPress={() => this.handleButtonPress(props)}
            label="TRANSFER"
            wide
            disabled={!props.isValid}
          />
        </View>
      </View>
    );
  }

  renderConfirm(props) {
    const { values } = props;
    const { currencies, colors, rates } = this.props;

    const { amount } = values;
    const currency = currencies.data.find(
      curr =>
        curr.account === values.fromAccount &&
        curr.currency.code === values.currency,
    );
    const toCurrency = currencies.data.find(
      curr =>
        curr.account === values.toAccount &&
        curr.currency.code === values.currency,
    );
    let items = [
      {
        id: 'amount',
        label: 'Transfer Amount',
        value:
          formatDecimals(amount, currency?.currency?.divisibility) +
          ' ' +
          getCurrencyCode(currency.currency),
        value2: `~ ${formatConvAmount({
          values: { amount },
          currency,
          rates,
        })}`,
        horizontal: true,
      },
    ];

    return (
      <View p={0.75}>
        <View>
          <TransferConfirmHeader
            amount={amount}
            fromAccount={currency}
            toAccount={toCurrency}
            rates={rates}
            colors={colors}
          />
          <View w="100%">
            <View
              p={1}
              bC="white"
              style={{
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
              }}>
              <View fD="row" jC="space-between">
                <Text fW="700" s={16}>
                  {'DETAILS'}
                </Text>
              </View>
              <View mt={1}>
                <TransferConfirmDetails items={items} />
              </View>
            </View>
          </View>
        </View>
        <View mt={1.25}>
          <Button
            disabled={false}
            label="Transfer"
            color="primary"
            wide
            loading={props.isSubmitting}
            onPress={() => this.handleButtonPress(props, 'confirm')}
          />
        </View>
      </View>
    );
  }

  renderResult(props) {
    const { values } = props;
    let result = this.state.result;
    const { currencies, colors, rates } = this.props;

    const { amount } = values;
    const currency = currencies.data.find(
      curr =>
        curr.account === values.fromAccount &&
        curr.currency.code === values.currency,
    );
    const toCurrency = currencies.data.find(
      curr =>
        curr.account === values.toAccount &&
        curr.currency.code === values.currency,
    );
    let items = [
      {
        id: 'amount',
        label: 'Transfer Amount',
        value:
          formatDecimals(amount, currency?.currency?.divisibility) +
          ' ' +
          getCurrencyCode(currency.currency),
        value2: `~ ${formatConvAmount({
          values: { amount },
          currency,
          rates,
        })}`,
        horizontal: true,
      },
    ];

    let header,
      detail,
      closeBtnTitle = 'CLOSE';
    if (['success', 'Complete'].includes(result?.status)) {
      header = (
        <TransferConfirmHeader
          amount={amount}
          fromAccount={currency}
          toAccount={toCurrency}
          rates={rates}
          colors={colors}
          bC="success"
        />
      );
      detail = <TransferConfirmDetails items={items} />;
      closeBtnTitle = 'Done';
      if (result?.status !== 'success') {
        // result does not have same structure that it should be
        result = { data: { ...result }, status: 'success' };
      }
    }

    return (
      <ResultPage
        result={result}
        onNext={() => this.handleButtonPress(props, result?.status)}
        formikProps={props}
        header={header}
        standAloneHeader
        detail={detail}
        closeBtnTitle={closeBtnTitle}
      />
    );
  }

  handleAccountSave = type => {
    this.props.fetchData(!type ? 'bankAccounts' : 'cryptoAccounts');
    this.setState({ formState: '' });
  };

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
  hidePin() {
    this.setState({ pinVisible: false });
  }

  validation(values, initial) {
    const { currencies } = this.props;
    const currency = currencies.data.find(
      curr =>
        curr.account === values.fromAccount &&
        curr.currency.code === values.currency,
    );
    let schema = yup.object().shape({
      currency: yup.string().required(),
      toAccount: yup.string().required(),
      fromAccount: yup.string().required(),
      amount: yup
        .number()
        .typeError('Please enter a valid number')
        .moreThan(0, 'Amount must be more than 0')
        .max(
          currency.available_balance / 10 ** currency.currency.divisibility,
          'Available balance exceeded: ' +
            displayFormatDivisibility(
              currency.available_balance,
              currency.currency.divisibility,
            ) +
            ' ' +
            getCurrencyCode(currency.currency),
        ) // this might need to be formatted / serialized
        .required('Amount is required'),
    });

    let errors = this.validate(values, schema);
    if (errors.path) {
      return {
        [errors.path]: errors.message,
      };
    }
    if (initial) {
      return true;
    }
    return {};
  }

  render() {
    const { localAuth, initialCurrency, currencies } = this.props;
    const { formState, pinVisible } = this.state;

    let items = currencies.data.filter(
      curr =>
        curr.currency.code === initialCurrency.currency.code &&
        curr.account !== initialCurrency.account,
    );

    const formInitialValues = {
      amount: '',

      fromAccount: initialCurrency.account,
      toAccount: _.get(items, [0, 'account']),
      currency: initialCurrency.currency.code,
    };

    return (
      <View w={'100%'} scrollView>
        <Formik
          initialValues={formInitialValues}
          enableReinitialize
          validate={values => {
            const valid = this.validation(values);
            return valid;
          }}>
          {props => (
            <React.Fragment>
              <CompanyStatusBanner />
              <View ph={0.5}>
                {formState === 'result'
                  ? this.renderResult(props)
                  : formState === 'confirm'
                  ? this.renderConfirm(props)
                  : this.renderTransfer(props)}
              </View>
              {pinVisible ? (
                <LocalAuthentication
                  modal // TODO:
                  localAuth={localAuth}
                  modalVisible={pinVisible}
                  onSuccess={() => {
                    this.hidePin();
                    this.handleFormSubmit(props);
                  }}
                  onDismiss={() => this.hidePin()}
                />
              ) : null}
            </React.Fragment>
          )}
        </Formik>
      </View>
    );
  }
}

const TransferForm = context(_ExchangeForm);

export default TransferForm;
