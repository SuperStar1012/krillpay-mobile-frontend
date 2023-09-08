import React, { Component } from 'react';
import { get } from 'lodash';
import moment from 'moment';

import * as Inputs from 'config/inputs';
import { View, Button, LocalAuthentication, Checkbox } from 'components';
import context from 'components/context';
import { standardizeString } from 'utility/general';
import { createCryptoTransfer, createTransfer } from 'utility/rehive';
import * as yup from 'yup';
import Big from 'big.js';

import { Formik } from 'formik';

import { MaterialIcons } from '@expo/vector-icons';
import { validateMobile, validateCrypto, cryptoName } from 'utility/validation';
import QRCodeScanner from './QRCodeScanner';
import RadioSelector from 'components/inputs/RadioSelector';
import ConfirmPage from 'components/layout/ConfirmPage';
import ResultPage from 'components/layout/ResultPage';

import {
  calculateRate,
  formatDecimals,
  renderRate,
  formatAmountString,
  getCurrencyCode,
} from '../util/rates';
import AmountInput from './AmountInput';
import CurrencySelectorCard from './CurrencySelectorCard';
import { TextField } from 'components/inputs/TextField';
import { ComposedInputDropdown } from 'components/inputs/ComposedInputDropdown';
import { useFeeWithConversion, useFee } from '../util/fees';
import { useContacts } from 'contexts/ContactsContext';
import { useLocalAuth } from 'contexts/LocalAuthContext';

class SellCreditForm extends Component {
  state = {
    formState: 'send',
    result: null,
    pinVisible: false,
  };

  async handleFormSubmit(props) {
    const { onSendSuccess, currencyHook, currencies, rates, services } =
      this.props;
    const currency = currencies.data[currencyHook[0]];
    const { values, setSubmitting } = props; // FormikProps
    let { amount, recipient, note, memo, recipientType, display } = values;
    setSubmitting(true);
    let response = null;
    amount = new Big(amount);
    if (
      services?.conversion_service &&
      rates.rates &&
      rates.displayCurrency.code &&
      display
    ) {
      const convRate = calculateRate(
        currency.currency.code,
        rates.displayCurrency.code,
        rates.rates,
      );
      amount = amount / convRate;
    }
    amount = amount * 10 ** currency.currency.divisibility;
    amount = parseInt(amount);

    if (recipientType === 'mobile') {
      if (recipient.indexOf('+') === -1) {
        recipient = '+' + recipient;
      }
    }
    try {
      let data = {
        amount,
        to_reference: recipient,
        currency: currency.currency.code,
        crypto: currency.crypto,
        credit_note: note,
        debit_note: note,
        debit_subtype: 'sell_credit',
        credit_subtype: 'buy_credit',
      };
      switch (currency.crypto) {
        case 'XLM':
        case 'TXLM':
          data['memo'] = memo;
        case 'ETH':
        case 'XBT':
        case 'TETH':
        case 'TXBT':
          if (recipientType === 'crypto') {
            response = await createCryptoTransfer(data);
            break;
          }
        default:
          data['debit_account'] = currency?.account;
          data['recipient'] = recipient;
          delete data.to_reference;
          response = await createTransfer(data);
          break;
      }
      onSendSuccess(currency);
      this.setState({ formState: 'result', result: response });
    } catch (error) {
      console.log(error);

      let { data, message } = error;
      if (data && (data.credit_subtype || data.debit_subtype)) {
        message = 'This transaction flow is not supported by this company';
      }
      this.setState({ formState: 'result', result: { ...error, message } });
    }
    setSubmitting(false);
  }

  onSubmitEditing(index, props) {
    try {
      const { currencyHook, currencies } = this.props;
      const currency = currencies.data[currencyHook[0]];
      let nextIndex = '';
      switch (index) {
        case 'amount':
          nextIndex = 'recipient';
          break;
        case 'recipient':
          nextIndex = currency.crypto === 'stellar' ? 'memo' : 'note';
          break;
        case 'memo':
          nextIndex = 'note';
          break;
        case 'note':
          if (props.isValid) {
            this.handleFormSubmit(props);
          } else {
            this.validation(props.values);
          }
          break;
      }
      if (nextIndex) {
        this[nextIndex].focus();
      }
    } catch (e) {
      console.log('onSubmitEditing', e);
    }
  }

  handleButtonPress = (props, type) => {
    props && props.setStatus({ error: '' });

    const { formState } = this.state;
    const { localAuth, pinConfig, currencyHook, currencies } = this.props;

    let nextFormState = formState;
    switch (formState) {
      case 'send':
        nextFormState = 'confirm';
        break;
      case 'confirm':
        if (type === 'confirm') {
          if (pinConfig.send && (localAuth.pin || localAuth.biometrics)) {
            this.setState({ pinVisible: true });
          } else {
            this.handleFormSubmit(props);
          }
        } else {
          nextFormState = 'send';
        }
        break;
      case 'result':
        if (type === 'success') {
          const currency = currencies.data[currencyHook[0]];
          this.props.navigation.navigate('Wallets', { currency });
        } else {
          nextFormState = 'send';
        }
        break;
    }
    this.setState({ formState: nextFormState });
  };

  renderInput(props, item) {
    const { colors, currencies, currencyHook } = this.props;
    const { values, touched, errors, setFieldTouched, setFieldValue } = props;

    const id = item === 'recipient' ? values.recipientType + 'Recipient' : item;
    const input = Inputs.send[id];

    const value = values[item];
    const touch = touched[item];
    const error = errors[item];
    let { helper, placeholder, label } = input;

    const currency = currencies.data[currencyHook[0]];

    switch (item) {
      case 'recipient':
        helper =
          values.recipientType === 'crypto' && currency.crypto
            ? currency.crypto.match(/TXLM|XLM/) &&
              values.stellarTransactionType === 'federation'
              ? 'Please enter a valid ' +
                cryptoName(currency.crypto) +
                ' federation address'
              : 'Please enter a valid ' +
                cryptoName(currency.crypto) +
                ' address'
            : input.helper;
        placeholder =
          values.recipientType === 'crypto' && currency.crypto
            ? currency.crypto.match(/TXLM|XLM/) &&
              values.stellarTransactionType === 'federation'
              ? 'e.g. username*domain.com'
              : currency.crypto.match(/TXBT|XBT/)
              ? 'e.g. 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
              : input.placeholder
            : input.placeholder;
        return (
          <View ph={0.5}>
            <ComposedInputDropdown
              reference={input => {
                this[item] = input;
              }}
              label={
                values.recipientType === 'crypto' && currency.crypto
                  ? 'Please enter crypto address'
                  : input.label
              }
              placeholder={placeholder}
              helper={
                values.recipientType === 'email'
                  ? 'Search contacts for email or number'
                  : input.helper
                  ? input.helper
                  : ''
              } // TODO: format
              // min={min}
              // max={max}
              value={this.format(item, value, currency.currency)}
              // value={this.format(value)}
              error={touch && error}
              type={input.type}
              onBlur={() => setFieldTouched(item)}
              // onChangeText={value => setFieldValue(item, this.parse(value))}
              onChangeText={value =>
                setFieldValue(item, this.parse(item, value, currency.currency))
              }
              // containerBackgroundColor={colors.grey1}
              tintColor={colors.primary}
              onSubmitEditing={() => this.onSubmitEditing(item, props)}
              // returnKeyType={this.returnKeyType(index)}
              selectTextOnFocus={values.recipientType !== 'mobile'}
              spellCheck={false}
              autoCapitalize={'none'}
              name={item}
              key={item}
              multiline={
                currency.crypto || currency.currency.divisibility > 10
                  ? true
                  : false
              }
              sections={this.sections(props)}
            />
          </View>
        );
    }
    return (
      <TextField
        ref={input => {
          this[item] = input;
        }}
        label={label}
        placeholder={placeholder}
        helper={helper}
        // min={min}
        // max={max}
        value={this.format(id, value, currency.currency)}
        error={touch && error}
        type={input.type}
        onBlur={() => setFieldTouched(item)}
        onChangeText={value =>
          setFieldValue(item, this.parse(item, value, currency.currency))
        }
        tintColor={colors.primary}
        onSubmitEditing={() => this.onSubmitEditing(item, props)}
        selectTextOnFocus={item !== 'amount'} //}
        spellCheck={false}
        name={item}
        key={item}
        multiline={item === 'note' ? true : false}
      />
    );
  }

  format(type, value = '') {
    switch (type) {
      // case 'amount':
      //   return (
      //     // currency.symbol +
      //     // ' ' +
      //     formatDivisibility(value, currency.divisibility)
      //   );
      // case 'mobileRecipient':
      //   return (value = value.length === 0 ? '+' : value);
      default:
        return value.toString();
    }
  }

  parse(type, value = '') {
    let newCharacter = value.slice(-1);
    value = value.slice(0, -1);
    // value = value + newCharacter;
    if (newCharacter === ',') {
      newCharacter = '.';
    }
    switch (type) {
      // case 'amount':
      //   return parseDivisibility(value, currency.divisibility, newCharacter);
      default:
        return value + newCharacter;
    }
  }

  // renderScanAction(props) {
  //   return (
  //     <View style={{ paddingRight: 16 }}>
  //       <MaterialIcons
  //         name={'camera'}
  //         size={24}
  //         // color={focused ? colors.focus : 'rgba(0,0,0,0.6)'}
  //         onPress={() =>
  //           this.props.navigation.navigate('InputScanner', {
  //             prop: 'recipient',
  //             onSuccess: (id, value) =>
  //               props.setFieldValue(id, get(value, 'recipient')),
  //           })
  //         }
  //       />
  //     </View>
  //   );
  // }

  renderCurrency(props) {
    const { currencyHook, currencies, rates, actionsConfig } = this.props;
    const currency = currencies.data[currencyHook[0]];
    const { values, setFieldValue } = props;
    const { recipientType } = values;

    let temp = { ...currencies };
    if (recipientType === 'crypto') {
      temp.data = temp.data.filter(currency => currency.crypto !== '');

      const hideCurrencies2 = get(
        actionsConfig,
        ['withdraw', 'condition', 'hideCurrency'],
        [],
      );
      temp.data = temp.data.filter(
        currency =>
          hideCurrencies2.findIndex(
            hide => hide.toLowerCase() === currency.currency.code.toLowerCase(),
          ) === -1,
      );
    }
    const hideCurrencies = get(
      actionsConfig,
      ['send', 'condition', 'hideCurrency'],
      [],
    );
    temp.data = temp.data.filter(
      currency =>
        hideCurrencies.findIndex(
          hide => hide.toLowerCase() === currency.currency.code.toLowerCase(),
        ) === -1,
    );

    return (
      <CurrencySelectorCard
        rates={rates}
        modal
        filtered={temp}
        currency={currency}
        returnIndex
        currencies={temp}
        updateCurrency={index => {
          const currency = temp.data[index];
          const currencyIndex = currencies.data.findIndex(
            curr => curr == currency,
          );
          currencyHook[1](currencyIndex);
          const amount = this.parse(
            'amount',
            this.format('amount', values.amount, currency.currency),
            currency.currency,
          );

          setFieldValue('amount', amount);

          if (
            recipientType === 'crypto' &&
            currency &&
            (currency.crypto === 'XLM' || currency.crypto === 'TXLM')
          ) {
            this.props.headerHelp.set(true);
          } else {
            this.props.headerHelp.set(false);
          }
        }}
      />
    );
  }

  renderSend(props) {
    const { values } = props;
    const { currencyHook, currencies, services, rates, tier } = this.props;
    const currency = currencies.data[currencyHook[0]];
    const { stellarTransactionType, recipientType, memoSkip } = values;

    const isStellar =
      recipientType === 'crypto' &&
      currency &&
      (currency.crypto === 'XLM' || currency.crypto === 'TXLM');

    const amountInputProps = {
      services,
      rates,
      formikProps: props,
      currency,
      onSubmitEditing: this.onSubmitEditing,
    };

    return (
      <React.Fragment>
        {this.renderCurrency(props)}
        <AmountInput {...amountInputProps} />
        {this.renderRecipientButtons(props)}
        {isStellar && (
          <RadioSelector
            title="Address type"
            items={[
              { value: 'public', label: 'Public address & memo' },
              { value: 'federation', label: 'Federation address' },
            ]}
            handleChange={value =>
              props.setFieldValue('stellarTransactionType', value)
            }
            value={stellarTransactionType}
          />
        )}

        <View fD={'row'} aI={'center'}>
          <View f={1}>{this.renderInput(props, 'recipient')}</View>
        </View>

        {isStellar && stellarTransactionType === 'public' ? (
          <View>
            {this.renderInput(props, 'memo')}
            <Checkbox
              containerStyle={{ paddingBottom: 0, marginVertical: 0 }}
              description={'No memo required for this transaction.'}
              toggleValue={() => props.setFieldValue('memoSkip', !memoSkip)}
              value={memoSkip}
              // error={touch && error}
              key={'memoSkip'}
            />
          </View>
        ) : null}

        {this.renderInput(props, 'note')}
        <View p={1}>
          <Button
            color={'primary'}
            wide
            onPress={() => this.handleButtonPress(props)}
            label="SELL CREDIT"
            size="big"
            disabled={!props.isValid}
          />
        </View>
      </React.Fragment>
    );
  }

  renderRecipientButtons(props) {
    const { values } = props;
    const { recipientType } = values;

    const { currencyHook, currencies, actionsConfig } = this.props;
    const currency = currencies.data[currencyHook[0]];
    let showCrypto = false;
    let showMobile = true;
    let showEmail = true;

    if (currency && currency.crypto) {
      const hideCurrencies = get(
        actionsConfig,
        ['withdraw', 'condition', 'hideCurrency'],
        [],
      );

      showCrypto =
        hideCurrencies.findIndex(
          hide => hide.toLowerCase() === currency.currency.code.toLowerCase(),
        ) === -1;
    }

    const recipientConfig = get(actionsConfig, [
      'sell_credit',
      'config',
      'recipient',
    ]);
    if (
      recipientConfig &&
      recipientConfig.length &&
      recipientConfig.length > 0
    ) {
      if (recipientConfig.findIndex(item => item === 'email') === -1) {
        showEmail = false;
      }
      if (recipientConfig.findIndex(item => item === 'mobile') === -1) {
        showMobile = false;
      }
      if (recipientConfig.findIndex(item => item === 'crypto') === -1) {
        showCrypto = false;
      }
    }

    if (
      (showEmail && !(showMobile || showCrypto)) ||
      (showMobile && !(showEmail || showCrypto)) ||
      (showCrypto && !(showMobile || showEmail))
    ) {
      return null;
    }

    return (
      <View style={{ flexDirection: 'row' }}>
        {showEmail && (
          <View style={{ flex: 1 }}>
            <Button
              color={recipientType === 'email' ? 'primary' : 'secondary'}
              onPress={() => this.handleRecipientButtonPress('email', props)}
              label="EMAIL"
              size="small"
              // round
              wide
            />
          </View>
        )}
        {showMobile && (
          <View style={{ flex: 1 }}>
            <Button
              color={recipientType === 'mobile' ? 'primary' : 'secondary'}
              onPress={() => this.handleRecipientButtonPress('mobile', props)}
              label="MOBILE"
              size="small"
              // round
              wide
              containerStyle={{ marginBottom: 4 }}
            />
          </View>
        )}
        {showCrypto ? (
          <View style={{ flex: 1 }}>
            <Button
              color={recipientType === 'crypto' ? 'primary' : 'secondary'}
              onPress={() => this.handleRecipientButtonPress('crypto', props)}
              label="CRYPTO"
              size="small"
              // round
              wide
              containerStyle={{ marginBottom: 4 }}
            />
          </View>
        ) : null}
      </View>
    );
  }

  handleRecipientButtonPress(type, props) {
    const { currencyHook, currencies } = this.props;
    const currency = currencies.data[currencyHook[0]];
    const { values } = props;
    const { recipient } = values;
    let value = recipient ? recipient : '';
    if (
      type === 'crypto' &&
      currency &&
      (currency.crypto === 'XLM' || currency.crypto === 'TXLM')
    ) {
      this.props.headerHelp.set(true);
    } else {
      this.props.headerHelp.set(false);
    }
    props.setFieldValue('recipient', value);
    props.setFieldValue('recipientType', type);
  }

  handleContactSelection = (item, props, device) => {
    const { currencyHook, currencies } = this.props;
    const currency = currencies.data[currencyHook[0]];

    const type = props.values.recipientType
      ? props.values.recipientType
      : 'email';

    let value = '';
    let recipientType = 'email';
    if (device) {
      value = item.contact;
      if (item.type === 'mobile') {
        recipientType = 'mobile';
      }
    } else {
      if (type === 'mobile' && item.mobile) {
        value = item.mobile;
        recipientType = 'mobile';
      } else if (item.email) {
        value = item.email;
      } else if (item.mobile) {
        value = item.mobile;
        recipientType = 'mobile';
      }
    }
    currency.crypto === 'stellar' ? this.memo.focus() : this.note.focus();
  };

  // To refactor
  sections(props) {
    const { contacts } = this.props;
    let sections = [];

    const search = props.values.recipient
      ? props.values.recipient.toLowerCase()
      : '';
    const type = props.values.recipientType
      ? props.values.recipientType
      : 'email';
    let dataPhone = [];
    if (search && contacts.phone) {
      dataPhone = contacts.phone.filter(item =>
        item
          ? item.type === type &&
            ((item.contact
              ? item.contact.toLowerCase().includes(search)
              : false) ||
              (item.name ? item.name.toLowerCase().includes(search) : false))
          : false,
      );
    }
    // let dataRecent = [];
    // if (search && contacts.recent) {
    //   dataRecent = contacts.recent.filter(
    //     item =>
    //       item
    //         ? (item.first_name
    //             ? item.first_name.toLowerCase().includes(search)
    //             : false) ||
    //           (item.last_name
    //             ? item.last_name.toLowerCase().includes(search)
    //             : false) ||
    //           (item.email
    //             ? item.email.toLowerCase().includes(search)
    //             : false) ||
    //           (item.mobile ? item.mobile.toLowerCase().includes(search) : false)
    //         : false
    //   );
    // }

    // if (dataRecent.length > 0) {
    //   sections.push({
    //     title: 'Recent',
    //     data: dataRecent,
    //     listItemTitle: item =>
    //       item
    //         ? (item.first_name ? item.first_name + ' ' : '') +
    //           (item.last_name ? item.last_name : '')
    //         : '',
    //     listItemSubtitle: item =>
    //       item
    //         ? (item.email ? item.email + (item.mobile ? '\n' : '') : '') +
    //           (item.mobile ? item.mobile : '')
    //         : '',
    //     listItemIcon: item => (item ? item.profile : ''),
    //     listItemOnPress: item =>
    //       this.handleContactSelection(item, props, false),
    //   });
    // }
    if (dataPhone.length > 0) {
      sections.push({
        title: 'Device',
        data: dataPhone,
        listItemTitle: item => (item && item.name ? item.name : ''),
        listItemSubtitle: item => (item && item.contact ? item.contact : ''),
        listItemIcon: item => (item && item.image ? item.image : ''),
        listItemOnPress: item => this.handleContactSelection(item, props, true),
      });
    }
    return sections;
    //     <View> // TODO:
    //         multiline={contacts.type === 'crypto' ? true : false}
    //   );
  }

  renderConfirm(props) {
    const { values } = props;

    const { amount, recipient, memo, note, display, recipientType } = values;
    const { currencyHook, currencies, services, rates, tier } = this.props;
    const currency = currencies.data[currencyHook[0]];

    try {
      // Calculate conversion rate
      let convRate = 1;
      const hasConversion =
        services?.conversion_service &&
        rates.rates &&
        rates.displayCurrency.code &&
        rates.displayCurrency.code !== currency.currency.code;
      if (hasConversion) {
        convRate = calculateRate(
          currency.currency.code,
          rates.displayCurrency.code,
          rates.rates,
        );
      }

      // Amount
      let amountValue = 0.0;
      let amountString = '';
      let amountConvString = '';
      let sentenceString = '';
      if (display) {
        amountValue = amount / convRate;
      } else {
        amountValue = amount;
      }
      amountString = formatAmountString(amountValue, currency.currency);
      if (hasConversion) {
        amountConvString =
          '~' +
          formatAmountString(amountValue * convRate, rates.displayCurrency);
      }
      sentenceString =
        amountString + (amountConvString ? ' (' + amountConvString + ')' : '');
      const items = [
        {
          id: 'amount',
          label: 'Amount',
          value: amountString,
          value2: amountConvString,
          horizontal: true,
        },
      ];

      const { totalString, feeString, fee, feeConvString, totalConvString } =
        useFeeWithConversion(
          amountValue,
          tier,
          currency.currency,
          'sell_credit',
          convRate,
          rates.displayCurrency,
        );
      if (fee) {
        items.push({
          id: 'fee',
          label: 'Service fee',
          value: feeString,
          value2: feeConvString,
          horizontal: true,
        });
        items.push({
          id: 'total_amount',
          label: 'Total amount',
          value: totalString,
          value2: totalConvString,
          horizontal: true,
          bold: true,
        });
      }

      const itemsExtra = [
        {
          id: 'recipient',
          label: standardizeString(
            'Recipient (' +
              (recipientType === 'crypto'
                ? cryptoName(currency.crypto) + ' address'
                : recipientType) +
              ')',
          ),
          value: recipient,
          labelBold: true,
        },
        memo
          ? {
              id: 'memo',
              label: 'Memo',
              value: memo,
              labelBold: true,
            }
          : null,
        note
          ? {
              id: 'note',
              label: 'Note',
              value: note,
              labelBold: true,
            }
          : null,
      ];
      if (hasConversion) {
        const rate = rates.rates['USD:' + currency.currency.code];
        if (rate) {
          itemsExtra.push({
            label: 'Rate',
            value: renderRate({
              fromCurrency: currency.currency,
              toCurrency: rates.displayCurrency,
              rate: convRate,
            }),
            labelBold: true,
            value2: 'Last updated ' + moment(rate.created).fromNow(),
          });
        }
      }
      return (
        <ConfirmPage
          action={'sell_credit'}
          text={'You are about to sell credit\n'}
          amount={sentenceString}
          recipient={recipient}
          items={items}
          itemsExtra={itemsExtra}
          handleButtonPress={this.handleButtonPress}
          formikProps={props}
        />
      );
    } catch (e) {
      console.log('TCL: renderConfirm -> e', e);
    }
  }

  renderResult(props) {
    const { result } = this.state;
    let { amount, recipient, display } = props.values;
    const { currencyHook, currencies, services, rates } = this.props;
    const currency = currencies.data[currencyHook[0]];
    const { divisibility } = currency.currency;

    recipient = get(
      result,
      ['destination_transaction', 'user', 'email'],
      recipient,
    );

    let sentenceString = '';
    let amountString = '';
    let amountConvString = '';

    if (
      services?.conversion_service &&
      rates.rates &&
      rates.displayCurrency.code
    ) {
      const convRate = calculateRate(
        currency.currency.code,
        rates.displayCurrency.code,
        rates.rates,
      );

      if (display) {
        amountString =
          formatDecimals(amount / convRate, divisibility) +
          ' ' +
          getCurrencyCode(currency.currency);
        sentenceString = amountString;

        amountConvString =
          formatDecimals(amount, rates.displayCurrency.divisibility) +
          ' ' +
          getCurrencyCode(rates.displayCurrency);
      } else {
        amountString =
          formatDecimals(amount, divisibility) +
          ' ' +
          getCurrencyCode(currency.currency);
        sentenceString = amountString;

        amountConvString =
          formatDecimals(
            amount * convRate,
            rates.displayCurrency.divisibility,
          ) +
          ' ' +
          getCurrencyCode(rates.displayCurrency);
      }
      amountConvString = '~' + amountConvString;
      sentenceString = amountString + ' (' + amountConvString + ')';
    } else {
      amountString =
        formatDecimals(amount, divisibility) +
        ' ' +
        getCurrencyCode(currency.currency);
      sentenceString = amountString;
    }

    let text =
      result.id || result.status === 'success'
        ? 'You sold credit of '
        : 'You failed selling credit of ';

    return (
      <ResultPage
        text={text}
        amount={sentenceString}
        recipient={recipient}
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

  validation = (values, initial) => {
    try {
      const { currencyHook, currencies, rates, services, tier } = this.props;
      const currency = currencies.data[currencyHook[0]];
      let schema = null;
      const {
        recipientType,
        recipient,
        memo,
        memoSkip,
        stellarTransactionType,
        display,
        amount,
      } = values;

      schema = yup.object().shape({
        amount: yup
          .number()
          .typeError('Please enter a valid number')
          .moreThan(0, 'Amount must be more than 0')
          .required('Amount is required'),
      });

      let errors = this.validate(values, schema);
      if (errors.path) {
        return {
          [errors.path]: errors.message,
        };
      }

      let convRate = 1;
      const hasConversion =
        services?.conversion_service &&
        rates.rates &&
        rates.displayCurrency.code;
      if (hasConversion) {
        convRate = calculateRate(
          currency.currency.code,
          rates.displayCurrency.code,
          rates.rates,
        );
      }

      let amountValue = amount;
      if (display) {
        amountValue = amount / convRate;
      }

      const { totalAmount, feeAmount } = useFee(
        amountValue,
        tier,
        currency.currency,
        'sell_credit',
      );
      const availableAmount = currency.available_balance;
      if (totalAmount > availableAmount) {
        return {
          amount:
            'Available balance exceeded: ' +
            formatAmountString(totalAmount, currency.currency, true) +
            (feeAmount
              ? ' (fee: ' +
                formatAmountString(feeAmount, currency.currency, true) +
                ')'
              : ''),
        };
      }

      if (recipient && recipientType === 'mobile') {
        if (recipient.indexOf('+') === -1) {
          recipient = '+' + recipient;
        }
        let error = validateMobile(recipient);
        if (error) {
          return { recipient: error };
        }
      } else if (recipient && recipientType === 'crypto') {
        let error = validateCrypto(recipient, currency.crypto);
        if (error) {
          return { recipient: error };
        }
        if (currency.crypto.match(/XLM|TXLM/)) {
          if (stellarTransactionType === 'federation') {
            if (recipient.indexOf('*') === -1)
              return { recipient: 'Not a valid federated stellar address' };
          } else if (!(memo || memoSkip)) {
            return { memo: 'Please include a memo' };
          }
        }
      } else if (recipient && recipientType === 'email') {
        schema = yup.object().shape({
          recipient: yup
            .string()
            .email('Recipient not a valid email')
            .required('Recipient is required'),
        });
        let errors = this.validate(values, schema);
        if (errors.path) {
          return {
            [errors.path]: errors.message,
          };
        }
      } else {
        return {
          recipient: 'Please include recipient',
        };
      }

      if (initial) {
        return true;
      }

      return {};
    } catch (e) {
      console.log('TCL: validation -> e', e);
    }
  };

  hidePin() {
    this.setState({ pinVisible: false });
  }

  onScanSuccess = (values, props) => {
    const { currencyHook, currencies } = this.props;
    const currency = currencies.data[currencyHook[0]];
    if (values.name) {
      this.props.navigation.replace('Pay', { ...values, currency });
    }
    if (values.recipient) {
      props.setFieldValue('recipient', values.recipient);
    }
    if (values.currency) {
      const currencyIndex = currencies.data.findIndex(
        currency =>
          currency?.account === values.currency?.account &&
          currency.currency.code === values.currency.currency.code,
      );
      this.props.currencyHook[1](currencyIndex);
    }
    if (values.type) {
      props.setFieldValue(
        'recipientType',
        values.type && values.type !== 'rehive' ? 'crypto' : 'email',
      );
    } else {
      if (
        values.recipient.includes('@') === -1 &&
        values.recipient.length > 16 &&
        currency.crypto
      ) {
        props.setFieldValue('recipientType', 'crypto');
      }
    }
    if (values.memo) {
      props.setFieldValue('memo', values.memo);
    }
    if (values.note) {
      props.setFieldValue('note', values.note);
    }
    if (values.amount) {
      props.setFieldValue('amount', values.amount);
    }
    this.props.qrHook[1](false);
  };

  render() {
    const {
      currencies,
      localAuth,
      currencyHook,
      qrHook,
      initialValues,
      actionsConfig,
    } = this.props;
    const { formState, pinVisible } = this.state;
    const qr = qrHook[0];

    let recipientType = 'email';

    const recipientConfig = get(actionsConfig, [
      'sell_credit',
      'config',
      'recipient',
    ]);
    if (
      recipientConfig &&
      recipientConfig.length &&
      recipientConfig.length === 1
    ) {
      recipientType = recipientConfig[0];
    }

    const formInitialValues = {
      amount: '',
      recipient: '',
      recipientType,
      search: '',
      note: '',
      memo: '',
      memoSkip: false,
      stellarTransactionType: 'public',
      display: false,
      ...initialValues,
    };

    const validationSchema = yup.object().shape({
      amount: yup.number().required('Amount is required'),
    });

    return (
      <Formik
        ref={form => (this.sendFrom = form)}
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        validate={values => {
          const valid = this.validation(values, false);
          return valid;
        }}>
        {props =>
          qr ? (
            <QRCodeScanner
              onSuccess={values => this.onScanSuccess(values, props)}
              currencies={currencies}
              currencyHook={currencyHook}
            />
          ) : (
            <View keyboardAvoiding scrollView>
              <View p={1}>
                {formState === 'send'
                  ? this.renderSend(props)
                  : formState === 'confirm'
                  ? this.renderConfirm(props)
                  : this.renderResult(props)}
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
            </View>
          )
        }
      </Formik>
    );
  }
}

function _SellCreditForm(props) {
  const localAuth = useLocalAuth();
  const { context: contacts } = useContacts();

  return (
    <SellCreditForm {...props} localAuth={localAuth} contacts={contacts} />
  );
}

export default context(_SellCreditForm);
