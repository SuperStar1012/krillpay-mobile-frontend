import React, { useState } from 'react';
import { get } from 'lodash';
import { View, Output } from 'components';

const BankAccountDetails = props => {
  const {
    name,
    type,
    number,
    bank_name,
    bank_code,
    branch_code,
    swift,
    iban,
    bic,
  } = item;

  return (
    <View p={0.25}>
      {/* <Output label="Currencies" value={this.renderCurrencies(currencies)} /> */}
      {name ? <Output label="Name" value={name} copy /> : null}
      {type ? <Output label="Type" value={type} copy /> : null}
      {number ? <Output label="Number" value={number} copy /> : null}
      {bank_name ? <Output label="Bank name" value={bank_name} copy /> : null}
      {bank_code ? <Output label="Bank code" value={bank_code} copy /> : null}
      {branch_code ? (
        <Output label="Branch name" value={branch_code} copy />
      ) : null}
      {swift ? <Output label="Swift" value={swift} copy /> : null}
      {iban ? <Output label="IBAN" value={iban} copy /> : null}
      {bic ? <Output label="BIC" value={bic} copy /> : null}
    </View>
  );
};

export default BankAccountDetails;

// renderInput(props, item) {
//   const { colors, currencies, currencyHook } = this.props;
//   const { values, touched, errors, setFieldTouched, setFieldValue } = props;

//   const id = item === 'recipient' ? values.recipientType + 'Recipient' : item;
//   const input = Inputs.send[id];

//   const value = values[item];
//   const touch = touched[item];
//   const error = errors[item];
//   let { helper, placeholder, label } = input;

//   const currency = currencies.data[currencyHook[0]];

//   return (
//     <TextField
//       ref={input => {
//         this[item] = input;
//       }}
//       label={label}
//       placeholder={placeholder}
//       helper={helper}
//       value={this.format(id, value, currency.currency)}
//       error={touch && error}
//       type={input.type}
//       onBlur={() => setFieldTouched(item)}
//       onChangeText={value =>
//         setFieldValue(item, this.parse(item, value, currency.currency))
//       }
//       tintColor={colors.primary}
//       onSubmitEditing={() => this.onSubmitEditing(item, props)}
//       selectTextOnFocus={item !== 'amount'} //}
//       spellCheck={false}
//       name={item}
//       key={item}
//       multiline={item === 'note' ? true : false}
//     />
//   );
// }

// renderCurrency(props) {
//   const { currencyHook, currencies, rates, actionsConfig } = this.props;
//   const currency = currencies.data[currencyHook[0]];
//   const { values, setFieldValue } = props;
//   const { recipientType } = values;

//   let temp = { ...currencies };
//   if (recipientType === 'crypto') {
//     temp.data = temp.data.filter(currency => currency.crypto !== '');

//     const hideCurrencies2 = get(
//       actionsConfig,
//       ['withdraw', 'condition', 'hideCurrency'],
//       [],
//     );
//     temp.data = temp.data.filter(
//       currency =>
//         hideCurrencies2.findIndex(
//           hide => hide.toLowerCase() === currency.currency.code.toLowerCase(),
//         ) === -1,
//     );
//   }
//   const hideCurrencies = get(
//     actionsConfig,
//     ['send', 'condition', 'hideCurrency'],
//     [],
//   );
//   temp.data = temp.data.filter(
//     currency =>
//       hideCurrencies.findIndex(
//         hide => hide.toLowerCase() === currency.currency.code.toLowerCase(),
//       ) === -1,
//   );

//   return (
//     <CurrencySelectorCard
//       rates={rates}
//       modal
//       filtered={temp}
//       currency={currency}
//       returnIndex
//       currencies={temp}
//       updateCurrency={index => {
//         const currency = temp.data[index];
//         const currencyIndex = currencies.data.findIndex(
//           curr => curr == currency,
//         );
//         currencyHook[1](currencyIndex);
//         const amount = this.parse(
//           'amount',
//           this.format('amount', values.amount, currency.currency),
//           currency.currency,
//         );

//         setFieldValue('amount', amount);

//         if (
//           recipientType === 'crypto' &&
//           currency &&
//           (currency.crypto === 'XLM' || currency.crypto === 'TXLM')
//         ) {
//           this.props.headerHelp.set(true);
//         } else {
//           this.props.headerHelp.set(false);
//         }
//       }}
//     />
//   );
// }

// renderConfirm(props) {
//   const { values } = props;

//   const { amount, recipient, memo, note, display, recipientType } = values;
//   const { currencyHook, currencies, services, rates, tier } = this.props;
//   const currency = currencies.data[currencyHook[0]];

//   try {
//     // Calculate conversion rate
//     let convRate = 1;
//     const hasConversion =
//       services['Conversion Service'] &&
//       rates.rates &&
//       rates.displayCurrency.code &&
//       rates.displayCurrency.code !== currency.currency.code;
//     if (hasConversion) {
//       convRate = calculateRate(
//         currency.currency.code,
//         rates.displayCurrency.code,
//         rates.rates,
//       );
//     }

//     // Amount
//     let amountValue = 0.0;
//     let amountString = '';
//     let amountConvString = '';
//     let sentenceString = '';
//     if (display) {
//       amountValue = amount / convRate;
//     } else {
//       amountValue = amount;
//     }
//     amountString = formatAmountString(amountValue, currency.currency);
//     if (hasConversion) {
//       amountConvString =
//         '~' +
//         formatAmountString(amountValue * convRate, rates.displayCurrency);
//     }
//     sentenceString =
//       amountString + (amountConvString ? ' (' + amountConvString + ')' : '');
//     const items = [
//       {
//         id: 'amount',
//         label: 'Amount',
//         value: amountString,
//         value2: amountConvString,
//         horizontal: true,
//       },
//     ];

//     const {
//       totalString,
//       feeString,
//       fee,
//       feeConvString,
//       totalConvString,
//     } = useFeeWithConversion(
//       amountValue,
//       tier,
//       currency.currency,
//       'send',
//       convRate,
//       rates.displayCurrency,
//     );
//     if (fee) {
//       items.push({
//         id: 'fee',
//         label: 'Service fee',
//         value: feeString,
//         value2: feeConvString,
//         horizontal: true,
//       });
//       items.push({
//         id: 'total_amount',
//         label: 'Total amount',
//         value: totalString,
//         value2: totalConvString,
//         horizontal: true,
//         bold: true,
//       });
//     }

//     const itemsExtra = [
//       {
//         id: 'recipient',
//         label: standardizeString(
//           'Recipient (' +
//             (recipientType === 'crypto'
//               ? cryptoName(currency.crypto) + ' address'
//               : recipientType) +
//             ')',
//         ),
//         value: recipient,
//         labelBold: true,
//       },
//       memo
//         ? {
//             id: 'memo',
//             label: 'Memo',
//             value: memo,
//             labelBold: true,
//           }
//         : null,
//       note
//         ? {
//             id: 'note',
//             label: 'Note',
//             value: note,
//             labelBold: true,
//           }
//         : null,
//     ];
//     if (hasConversion) {
//       const rate = rates.rates['USD:' + currency.currency.code];
//       if (rate) {
//         itemsExtra.push({
//           label: 'Rate',
//           value: renderRate({
//             fromCurrency: currency.currency,
//             toCurrency: rates.displayCurrency,
//             rate: convRate,
//           }),
//           labelBold: true,
//           value2: 'Last updated ' + moment(rate.created).fromNow(),
//         });
//       }
//     }
//     return (
//       <ConfirmPage
//         action={'send'}
//         text={'You are about to send\n'}
//         amount={sentenceString}
//         recipient={recipient}
//         items={items}
//         itemsExtra={itemsExtra}
//         handleButtonPress={this.handleButtonPress}
//         formikProps={props}
//       />
//     );
//   } catch (e) {
//     console.log('TCL: renderConfirm -> e', e);
//   }
// }

// renderResult(props) {
//   const { result } = this.state;
//   let { amount, recipient, display } = props.values;
//   const { currencyHook, currencies, services, rates } = this.props;
//   const currency = currencies.data[currencyHook[0]];
//   const { divisibility } = currency.currency;

//   recipient = get(
//     result,
//     ['destination_transaction', 'user', 'email'],
//     recipient,
//   );

//   let sentenceString = '';
//   let amountString = '';
//   let amountConvString = '';

//   if (
//     services['Conversion Service'] &&
//     rates.rates &&
//     rates.displayCurrency.code
//   ) {
//     const convRate = calculateRate(
//       currency.currency.code,
//       rates.displayCurrency.code,
//       rates.rates,
//     );

//     if (display) {
//       amountString =
//         formatDecimals(amount / convRate, divisibility) +
//         ' ' +
//         currency.currency.code;
//       sentenceString = amountString;

//       amountConvString =
//         formatDecimals(amount, rates.displayCurrency.divisibility) +
//         ' ' +
//         rates.displayCurrency.code;
//     } else {
//       amountString =
//         formatDecimals(amount, divisibility) + ' ' + currency.currency.code;
//       sentenceString = amountString;

//       amountConvString =
//         formatDecimals(
//           amount * convRate,
//           rates.displayCurrency.divisibility,
//         ) +
//         ' ' +
//         rates.displayCurrency.code;
//     }
//     amountConvString = '~' + amountConvString;
//     sentenceString = amountString + ' (' + amountConvString + ')';
//   } else {
//     amountString =
//       formatDecimals(amount, divisibility) + ' ' + currency.currency.code;
//     sentenceString = amountString;
//   }

//   let text =
//     result.id || result.status === 'success'
//       ? 'You sent '
//       : 'You failed sending ';

//   return (
//     <ResultPage
//       text={text}
//       amount={sentenceString}
//       recipient={recipient}
//       result={result}
//       handleButtonPress={this.handleButtonPress}
//       formikProps={props}
//     />
//   );
// }

// async function handleFormSubmit(props) {
//   const {
//     onSendSuccess,
//     currencyHook,
//     currencies,
//     rates,
//     services,
//   } = this.props;
//   const currency = currencies.data[currencyHook[0]];
//   const { values, setSubmitting } = props; // FormikProps
//   let { amount, recipient, note, memo, recipientType, display } = values;
//   setSubmitting(true);
//   let response = null;
//   amount = new Big(amount);
//   if (
//     services['Conversion Service'] &&
//     rates.rates &&
//     rates.displayCurrency.code &&
//     display
//   ) {
//     const convRate = calculateRate(
//       currency.currency.code,
//       rates.displayCurrency.code,
//       rates.rates,
//     );
//     amount = amount / convRate;
//   }
//   amount = amount * 10 ** currency.currency.divisibility;
//   amount = parseInt(amount);

//   if (recipientType === 'mobile') {
//     if (recipient.indexOf('+') === -1) {
//       recipient = '+' + recipient;
//     }
//   }
//   try {
//     let data = {
//       amount,
//       to_reference: recipient,
//       currency: currency.currency.code,
//       crypto: currency.crypto,
//       note,
//       debit_subtype: 'send_' + recipientType,
//       credit_subtype: 'receive_' + recipientType,
//     };
//     switch (currency.crypto) {
//       case 'XLM':
//       case 'TXLM':
//         data['memo'] = memo;
//       case 'ETH':
//       case 'XBT':
//       case 'TETH':
//       case 'TXBT':
//         if (recipientType === 'crypto') {
//           response = await createCryptoTransfer(data);
//           break;
//         }
//       default:
//         data['debit_account'] = currency?.account;
//         data['recipient'] = recipient;
//         delete data.to_reference;
//         response = await createTransfer(data);
//         break;
//     }
//     onSendSuccess(currency);
//     this.setState({ formState: 'result', result: response });
//   } catch (error) {
//     console.log(error);

//     let { data, message } = error;
//     if (data && (data.credit_subtype || data.debit_subtype)) {
//       message = 'This transaction flow is not supported by this company';
//     }
//     this.setState({ formState: 'result', result: { ...error, message } });
//   }
//   setSubmitting(false);
// }

// function handleButtonPress(props, type) {
//   props && props.setStatus({ error: '' });

//   const { formState } = this.state;
//   const { localAuth, pinConfig, currencyHook, currencies } = this.props;

//   let nextFormState = formState;
//   switch (formState) {
//     case 'send':
//       nextFormState = 'confirm';
//       break;
//     case 'confirm':
//       if (type === 'confirm') {
//         if (pinConfig.send && (localAuth.pin || localAuth.biometrics)) {
//           this.setState({ pinVisible: true });
//         } else {
//           this.handleFormSubmit(props);
//         }
//       } else {
//         nextFormState = 'send';
//       }
//       break;
//     case 'result':
//       if (type === 'success') {
//         const currency = currencies.data[currencyHook[0]];
//         this.props.navigation.navigate('Wallets', { currency });
//       } else {
//         nextFormState = 'send';
//       }
//       break;
//   }
//   this.setState({ formState: nextFormState });
// }
