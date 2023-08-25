import React, { useState, useEffect, Fragment } from 'react';
import { get } from 'lodash';
import { createConversion } from 'utility/rehive';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { Spinner, Button, View, Text } from 'components';
import ExchangeConfirmHeader from './ExchangeConfirmHeader';
import ExchangeConfirmDetails from './ExchangeConfirmDetails';
import { useConversionTimer } from '../hooks/conversion';

function pad(num) {
  return ('0' + num).slice(-2);
}
function formatTime(secs) {
  var minutes = Math.floor(secs / 60);
  secs = secs % 60;
  minutes = minutes % 60;
  return pad(minutes) + ':' + pad(secs);
}

export default function ExchangeConfirm(props) {
  const {
    fromCurrency,
    formikProps,
    handleButtonPress,
    toCurrency,
    data,
    setData,
  } = props;

  const { values, setFieldValue } = formikProps;
  const { buy, sell, display } = values;

  const [loading, setLoading] = useState(true);
  const toCode = toCurrency.currency.code;

  const { expired } = useConversionTimer(data);

  useEffect(() => {
    async function fetchData() {
      const key = fromCurrency.currency.code + ':' + toCode;
      let postData = null;
      if (display) {
        postData = {
          to_amount: parseInt(
            parseFloat(buy) * 10 ** toCurrency.currency.divisibility,
          ),
        };
      } else {
        postData = {
          from_amount: parseInt(
            parseFloat(sell) * 10 ** fromCurrency.currency.divisibility,
          ),
        };
      }

      const resp = await createConversion({
        ...postData,
        debit_account: fromCurrency.account,
        credit_account: toCurrency.account,
        key,
      });
      if (resp.status === 'success') {
        setData(resp?.data);
        setFieldValue('id', get(resp, ['data', 'id']));
      } else {
        setData(resp);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

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
            onPress={() => handleButtonPress(formikProps)}
            id="back"
          />
        </View>
      </React.Fragment>
    );
  }
  return (
    <View f={1}>
      <View f={1} scrollView>
        <ExchangeConfirmHeader {...props} conversionQuote={data} />
        <View w="100%">
          <View
            p={1.5}
            mh={0.5}
            bC="white"
            style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
            <View fD="row" jC="space-between">
              <Text fW="700" s={16} id="details" capitalize />
            </View>
            <View mt={1}>
              <ExchangeConfirmDetails {...props} conversionQuote={data} />
            </View>
          </View>
        </View>
        {expired && (
          <ErrorOutput style={{ marginTop: 16 }} id="expired_quote_message" />
        )}
      </View>
      <View p={0.5}>
        <Button
          disabled={expired || loading}
          id="confirm"
          color="primary"
          wide
          loading={formikProps.isSubmitting}
          onPress={() => handleButtonPress(formikProps, 'confirm')}
          containerStyle={{}}
        />
      </View>
    </View>
  );
}

// useEffect(() => {
//   let timer = null;
//   async function startTimer() {
//     timer = setTimeout(() => {
//       if (data && data.created) {
//         const CurrentDate = moment();
//         const ExpiredDate = moment(data.expires);
//         const diff = ExpiredDate.diff(CurrentDate, 'seconds');
//         const formatted = formatTime(diff);
//         setRemaining(formatted);
//         if (diff <= 0) {
//           setExpired(true);
//           return () => clearTimeout(timer);
//         }
//       }
//       startTimer();
//     }, 1000);
//   }
//   startTimer();

//   if (data) {
//     let _items = [];
//     const { from_amount, to_amount, rate } = data;
//     const {
//       totalString: fromTotalString,
//       feeString: fromFeeString,
//       fee: fromFee,
//     } = useFee(from_amount, tier, fromCurrency.currency, 'sell');
//     setFromAmount(from_amount);
//     if (fromFee) {
//       _items.push({
//         id: 'from_fee',
//         value: fromFeeString,
//         horizontal: true,
//       });
//       _items.push({
//         id: 'sell_total',
//         value: fromTotalString,
//         horizontal: true,
//         bold: true,
//       });
//     }

//     const sameAccount = toCurrency.account === fromCurrency.account;
//     if (fromCurrency.account !== primaryAccount && !sameAccount) {
//       _items.push({
//         id: 'fromAcc',
//         label: 'sell_account',
//         value: fromCurrency.account_name,
//         horizontal: true,
//       });
//     }

//     const {
//       totalString: toTotalString,
//       feeString: toFeeString,
//       fee: toFee,
//     } = useFee(to_amount, tier, toCurrency.currency, 'buy');
//     setToAmount(to_amount);
//     if (toFee) {
//       _items.push({
//         id: 'to_fee',
//         value: toFeeString,
//         horizontal: true,
//       });
//       _items.push({
//         id: 'buy_total',
//         value: toTotalString,
//         horizontal: true,
//         bold: true,
//       });
//     }

//     if (toCurrency.account !== primaryAccount && sameAccount) {
//       _items.push({
//         id: 'account',
//         value: toCurrency.account_name,
//         horizontal: true,
//       });
//     }
//     if (rate) {
//       const rateString = renderRate({
//         fromCurrency,
//         toCurrency,
//         rate,
//       });
//       _items.push({
//         id: 'rate',
//         value: rateString,
//         horizontal: true,
//       });
//     }
//     setItems(_items);
//     setSuccessDetailsItems(_items);
//   }

//   return () => clearTimeout(timer);
// }, [data]);

// const newItems = items.concat({
//   id: 'expires',
//   label: 'quote_expires_in',
//   // value: remaining,
//   // loading: !Boolean(remaining),
//   horizontal: true,
//   valueColor: true,
//   valueBold: true,
//   noId: true,
// });
