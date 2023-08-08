import React, { Component } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';
import Big from 'big.js';
import _ from 'lodash';

import { View, Button, LocalAuthentication } from 'components';
import FormikInput from 'components/inputs/FormikInput';
import { send } from 'config/inputs';
import { displayFormatDivisibility } from 'utility/general';
import { createTransfer } from 'utility/rehive';
import Selector from 'components/inputs/Selector';
import ResultPage from 'components/layout/ResultPage';
import ConfirmPage from 'components/layout/ConfirmPageNew';
import { getCurrencyCode } from '../util/rates';
import CompanyStatusBanner from 'components/auth/CompanyStatusBanner';
import { recipient } from 'config/inputs/inputs';

class TransferForm extends Component {
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
    const formatValue = item => item.code;

    const grouped = _.groupBy(currencies.data, curr => curr.currency.code);
    const keys = Object.keys(grouped);

    const items = keys
      .filter(key => grouped[key].length > 1)
      .map(key => {
        return {
          label: key,
          value: key,
          key,
        };
      });

    return (
      <Selector
        modal
        items={items}
        value={values.currency}
        label={'currency'}
        formatValue={formatValue}
        onValueChange={value => {
          setFieldValue('toAccount', '');
          setFieldValue(
            'fromAccount',
            currencies.data.find(curr => curr.currency.code === value).account,
          );
          setFieldValue('currency', value);
        }}
      />
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

    const items = currencies.data
      .filter(curr => curr.currency.code === values.currency)
      .map(item => {
        return {
          label: formatValue(item),
          value: item.account,
          key: item.account,
        };
      });

    return (
      <Selector
        modal
        items={items}
        value={values.fromAccount}
        label={'from'}
        formatValue={formatValue}
        onValueChange={value => {
          setFieldValue('toAccount', '');
          setFieldValue('fromAccount', value);
        }}
      />
    );
  }

  renderToAccount(props) {
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

    let items = currencies.data
      .filter(
        curr =>
          curr.currency.code === values.currency &&
          curr.account !== values.fromAccount,
      )
      .map(item => {
        return {
          label: formatValue(item),
          value: item.account,
          key: item.account,
        };
      });

    return (
      <Selector
        modal
        items={items}
        value={values.toAccount}
        label={'to_direction'}
        formatValue={formatValue}
        placeholder={'please_select_account'}
        onValueChange={value => setFieldValue('toAccount', value)}
      />
    );
  }

  renderTransfer(props) {
    const { values } = props;

    return (
      <View w={'100%'} p={1} f={1}>
        <View scrollView f={1}>
          <View fD={'row'}>
            <View f={1} pr={0.5}>
              {this.renderCurrencyInput(props)}
            </View>
            <View f={2} pt={0.2}>
              <FormikInput
                field={send.amount}
                value={values.amount}
                formikProps={props}
                onSubmitEditing={() => this.handleButtonPress(props)}
              />
            </View>
          </View>

          {this.renderFromAccount(props)}
          {this.renderToAccount(props)}
        </View>
        <View pt={1} w={'100%'}>
          <Button
            color={'primary'}
            onPress={() => this.handleButtonPress(props)}
            id="transfer"
            wide
            disabled={!props.isValid}
          />
        </View>
      </View>
    );
  }

  renderConfirm(props) {
    const { values } = props;
    const { currencies } = this.props;

    const { amount } = values;
    const currency = currencies.data.find(
      curr =>
        curr.account === values.fromAccount &&
        curr.currency.code === values.currency,
    );

    const amountString = amount + ' ' + getCurrencyCode(currency.currency);

    return (
      <View p={1}>
        <ConfirmPage
          action={'transfer'}
          id="transfer_confirm"
          context={{
            amount: amountString,
            fromAccount: values.fromAccount,
            toAccount: values.toAccount,
          }}
          handleButtonPress={this.handleButtonPress}
          formikProps={props}
        />
      </View>
    );
  }

  renderResult(props) {
    const { result } = this.state;

    return (
      <ResultPage
        text={'transfer'}
        result={result}
        handleButtonPress={this.handleButtonPress}
        formikProps={props}
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
      <View w={'100%'} f={1} keyboardAvoiding>
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
              {formState === 'result'
                ? this.renderResult(props)
                : formState === 'confirm'
                ? this.renderConfirm(props)
                : this.renderTransfer(props)}
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

export default TransferForm;
