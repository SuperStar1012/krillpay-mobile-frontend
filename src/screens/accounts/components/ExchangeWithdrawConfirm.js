import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import moment from 'moment';
import { createConversion } from 'utility/rehive';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { Spinner, Button, View, Text } from 'components';
import ConfirmPage from 'components/layout/ConfirmPage';
import { formatDivisibility } from 'utility/general';
import { checkIfCrypto } from '../../accounts/util/crypto';
import { renderRate, formatAmountString } from '../util/rates';
import { useFee } from '../util/fees';

function pad(num) {
  return ('0' + num).slice(-2);
}
function formatTime(secs) {
  var minutes = Math.floor(secs / 60);
  secs = secs % 60;
  minutes = minutes % 60;
  // return `${pad(minutes)}:${pad(secs)}`;
  return pad(minutes) + ':' + pad(secs);
}

const ExchangeWithdrawConfirm = props => {
  const {
    fromCurrency,
    formikProps,
    handleButtonPress,
    toCurrency,
    services,
    accountString,
    tier,
    crypto,
    // items,
  } = props;
  const { values, setFieldValue } = formikProps;
  const { amount, display } = values;

  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [data, setData] = useState(null);
  const [remaining, setRemaining] = useState('09:59');
  const toCode = toCurrency.currency.code;

  useEffect(() => {
    async function fetchData() {
      const { code, divisibility } = fromCurrency.currency;
      const key = code + ':' + toCode;
      const hasConversion =
        services['Conversion Service'] &&
        toCurrency.currency.code !== code &&
        values.display;
      let data = {};
      if (hasConversion) {
        data = {
          to_amount: parseInt(
            parseFloat(amount) * 10 ** toCurrency.currency.divisibility,
          ),
        };
      } else {
        data = {
          from_amount: parseInt(parseFloat(amount) * 10 ** divisibility),
        };
      }

      const resp = await createConversion({
        ...data,
        debit_account: fromCurrency.account,
        credit_account: toCurrency.account,
        key,
      });
      if (resp.status === 'success') {
        setData(get(resp, ['data']));
        setFieldValue('id', get(resp, ['data', 'id']));
      } else {
        setData(resp);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    let timer = null;
    async function startTimer() {
      timer = setTimeout(() => {
        if (data && data.created) {
          const CurrentDate = moment();
          const ExpiredDate = moment(data.expires);
          const diff = ExpiredDate.diff(CurrentDate, 'seconds');
          const formatted = formatTime(diff);
          setRemaining(formatted);
          if (diff <= 0) {
            setExpired(true);
            return () => clearTimeout(timer);
          }
        }
        startTimer();
      }, 1000);
    }
    startTimer();
    return () => clearTimeout(timer);
  }, [data]);

  if (!data || loading) {
    return <Spinner containerStyle={{ paddingBottom: 24 }} />;
  }
  if (data.status && data.status === 'error') {
    return (
      <React.Fragment>
        <ErrorOutput>{data.message}</ErrorOutput>

        <View p={1}>
          <Button
            type={'text'}
            wide
            onPress={() => this.handleButtonPress(formikProps)}
            id="back"
          />
        </View>
      </React.Fragment>
    );
  }

  // const { from_amount, to_amount, rate } = data;

  // const sellString =
  //   formatDivisibility(from_amount, fromCurrency.currency.divisibility) +
  //   ' ' +
  //   fromCurrency.currency.code;
  // const buyString =
  //   formatDivisibility(to_amount, toCurrency.currency.divisibility) +
  //   ' ' +
  //   toCode;

  // const amountString = display
  //   ? buyString + ' (~' + sellString + ')'
  //   : sellString + ' (~' + buyString + ')';
  const B = props => (
    <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>
  );

  const { from_amount, to_amount, rate } = data;

  const fromAmount = from_amount / 10 ** fromCurrency.currency.divisibility;
  const toAmount = to_amount / 10 ** toCurrency.currency.divisibility;

  const fromString = formatAmountString(fromAmount, fromCurrency.currency);
  const toString = formatAmountString(toAmount, toCurrency.currency);

  const items = [
    {
      id: 'from',
      label: 'Selling',
      value: fromString,
      horizontal: true,
    },
  ];

  const {
    totalString: fromTotalString,
    totalAmount: fromTotalAmount,
    feeString: fromFeeString,
    fee: fromFee,
  } = useFee(fromAmount, tier, fromCurrency.currency, 'sell');

  if (fromFee) {
    items.push({
      id: 'from_fee',
      label: 'Sell fee',
      value: fromFeeString,
      horizontal: true,
    });

    items.push({
      id: 'sell_total',
      label: 'Total sell amount',
      value: fromTotalString,
      horizontal: true,
      bold: true,
    });
  }

  items.push({
    id: 'blank',
    label: ' ',
    value: ' ',
    horizontal: true,
  });
  items.push({
    id: 'to',
    label: 'Buying',
    value: toString,
    horizontal: true,
  });

  const {
    totalString: toTotalString,
    totalAmount: toTotalAmount,
    feeString: toFeeString,
    fee: toFee,
  } = useFee(toAmount, tier, toCurrency.currency, 'buy');

  if (toFee) {
    items.push({
      id: 'to_fee',
      label: 'Buy fee',
      value: toFeeString,
      horizontal: true,
    });

    items.push({
      id: 'buy_total',
      label: 'Total buy amount',
      value: toTotalString,
      horizontal: true,
      bold: true,
    });
  }

  // Amount
  let amountValue = toTotalAmount ? toTotalAmount : toAmount;
  let amountString = toTotalString ? toTotalString : toString;
  let amountConvString = '';
  const itemsExtra = [
    {
      id: 'amount',
      label: 'Withdrawal amount',
      value: amountString,
      value2: amountConvString,
      horizontal: true,
    },
  ];

  // Fee
  const isCrypto = checkIfCrypto({ currency: toCurrency, crypto });
  const { totalString, feeString, fee } = useFee(
    amountValue / 10 ** toCurrency.currency.divisibility,
    tier,
    toCurrency.currency,
    isCrypto ? 'withdraw_crypto' : 'withdraw_manual',
  );

  if (fee) {
    itemsExtra.push({
      id: 'fee',
      label: 'Withdrawal fee',
      value: feeString,
      // value2: feeConvString,
      horizontal: true,
    });
    itemsExtra.push({
      id: 'total_amount',
      label: 'Total transaction amount',
      value: totalString,
      // value2: totalAmountConvString,
      horizontal: true,
      bold: true,
    });
  }

  // const text = (
  //   <Text align={'center'}>
  //     {'You are about to withdraw\n'}
  //     <b>{fromString + ' (~' + totalString + ')'}</b>
  //     {' to '}
  //     <b>{accountString}</b>
  //   </Text>
  // );

  const text = (
    <Text align={'center'}>
      {'You are about to withdraw '}
      <B>{fromString + ' (~' + totalString + ')'}</B>
      {' to '}
      <B>{accountString}</B>
    </Text>
  );

  let itemsExtra2 = null;
  if (rate) {
    const rateString = renderRate({
      fromCurrency,
      toCurrency,
      rate: rate,
    });
    itemsExtra2 = [
      {
        id: 'rate',
        label: 'Rate',
        value: rateString,
        horizontal: true,
      },
      {
        id: 'expires',
        label: 'Quote expires in',
        value: remaining,
        horizontal: true,
        valueColor: true,
        valueBold: true,
      },
    ];
  }

  return (
    <ConfirmPage
      action={'withdraw'}
      handleButtonPress={handleButtonPress}
      text={text}
      disabled={expired}
      formikProps={formikProps}
      items={items}
      itemsExtra={itemsExtra}
      itemsExtra2={itemsExtra2}
      backButtonText={'CANCEL'}>
      {expired && <ErrorOutput>This quote has expired</ErrorOutput>}
    </ConfirmPage>
  );
};

export default ExchangeWithdrawConfirm;
