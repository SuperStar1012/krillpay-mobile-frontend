import React from 'react';
import moment from 'moment';

import ConfirmPage from 'components/layout/ConfirmPage';
import {
  calculateRate,
  formatAmountString,
  renderRate,
} from '../../util/rates';
import { useFeeWithConversion } from '../../util/fees';
import { standardizeString } from 'utility/general';
import ErrorOutput from 'components/outputs/ErrorOutput';

export default function PayConfirm(props) {
  const {
    formikProps,
    handleButtonPress,
    currency,
    services,
    rates,
    tier,
    data,
  } = props;
  const { values } = formikProps;

  const { amount, note, display } = values;
  const { name } = data;

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
        '~' + formatAmountString(amountValue * convRate, rates.displayCurrency);
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
        valueBold: true,
      },
    ];

    // Fee

    const { totalString, feeString, fee, feeConvString, totalConvString } =
      useFeeWithConversion(
        amountValue,
        tier,
        currency.currency,
        'send',
        convRate,
        rates.displayCurrency,
      );
    // let feeAmount = 0.0;
    // let feeString = '';
    // let feeConvString = '';
    // const fee = getFee(tier, 'pay', currency.currency);
    if (fee) {
      // feeAmount = calculateFee(amountValue, fee, currency);
      // feeString = formatAmountString(feeAmount, currency.currency);
      // if (hasConversion) {
      //   feeConvString =
      //     '~' +
      //     formatAmountString(feeAmount * convRate, rates.displayCurrency);
      // }
      items.push({
        id: 'fee',
        label: 'Service fee',
        value: feeString,
        value2: feeConvString,
        horizontal: true,
      });
      // Total amount
      // let totalAmount = 0.0;
      // let totalAmountString = '';
      // let totalAmountConvString = '';
      // totalAmount = parseFloat(amountValue) + feeAmount;
      // totalAmountString = formatAmountString(totalAmount, currency.currency);
      // if (hasConversion) {
      //   totalAmountConvString =
      //     '~' +
      //     formatAmountString(totalAmount * convRate, rates.displayCurrency);
      // }
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
        label: standardizeString('Recipient'),
        value: name,
        labelBold: true,
      },
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
        action={'pay'}
        text={'You are about to pay\n'}
        amount={sentenceString}
        recipient={name}
        items={items}
        itemsExtra={itemsExtra}
        handleButtonPress={handleButtonPress}
        formikProps={formikProps}
      />
    );
  } catch (e) {
    console.log('PayConfirm -> e', e);
    return <ErrorOutput>{e}</ErrorOutput>;
    // console.log('TCL: renderConfirm -> e', e);
  }
}
