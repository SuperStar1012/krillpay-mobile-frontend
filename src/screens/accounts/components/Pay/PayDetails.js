import React from 'react';
import { View, Text } from 'components';
import { formatAmountString } from 'utility/rates';
import { mapItemNameString } from 'screens/products/util/products';

export default function PayDetails(props) {
  const { request = {} } = props;
  // const { amount, type } = form.getValues();

  const { request_amount: amount = 0, request_currency: currency } = request;

  const items = request?.metadata?.service_business?.items ?? [];

  // const { rates, tier, actionConfig } = context;
  // const { confirmMessage = '' } = actionConfig?.config ?? {};

  // const { convAvailable, hasConversion, convRate } = useConversion(
  //   parseFloat(amount),
  //   rates,
  //   currency,
  // );

  // Amount
  // const showConversion =
  //   hasConversion && currency?.code !== rates.displayCurrency?.code;

  const amountString = formatAmountString(amount, currency, true);
  // const items = [
  //   {
  //     id: 'account',
  //     label: 'FROM ACCOUNT',
  //     value: wallet?.account_name,
  //     horizontal: true,
  //   },
  //   {
  //     id: 'amount',
  //     label: 'SENDING AMOUNT',
  //     value: amountString,
  //     value2: showConversion && convAvailable,
  //     horizontal: true,
  //   },
  // ];

  // const {
  //   totalString,
  //   feeString,
  //   fee,
  //   feeConvString,
  //   totalConvString,
  // } = useFeeWithConversion(
  //   amount,
  //   tier,
  //   currency,
  //   'send_' + type,
  //   convRate,
  //   rates.displayCurrency,
  // );

  // if (fee) {
  //   items.push({
  //     id: 'fee',
  //     label: 'SERVICE',
  //     value: feeString,
  //     value2: feeConvString,
  //     horizontal: true,
  //   });
  //   items.push({
  //     id: 'total_amount',
  //     label: 'TOTAL AMOUNT',
  //     value: totalString,
  //     value2: totalConvString,
  //     horizontal: true,
  //     bold: true,
  //   });
  // }
  // if (showConversion) {
  //   const rate = rates.rates['USD:' + currency?.code];
  //   if (rate) {
  //     items.push({
  //       label: 'RATE',
  //       value: renderRate({
  //         fromCurrency: currency,
  //         toCurrency: rates.displayCurrency,
  //         rate,
  //       }),
  //       // labelBold: true,
  //       horizontal: true,
  //       value2: 'Last updated ' + moment(rate.created).fromNow(),
  //     });
  //   }
  // }

  return (
    <>
      {/* {!!confirmMessage && (
        <Info m={0} mb={0.5}>
          {confirmMessage}
        </Info>
      )} */}
      <View fD="column" w="100%" mb={1}>
        <View fD="row" jC="space-between">
          <Text fW="bold">Summary</Text>
          {/* {!simpleLayout && typeof setShowItems === 'function' && (
            <Button onPress={() => setShowItems(true)}>
              <Text c="primary" fW="bold">
                View items
              </Text>
            </Button>
          )} */}
        </View>

        <View fD="column" pt={0.5}>
          {items.map(item => (
            <View key={item?.id} fD="row" jC="space-between" pb={0.5}>
              <Text style={{ flex: 1 }}>{mapItemNameString(item)}</Text>
              <Text>{formatAmountString(item?.price, currency)}</Text>
            </View>
          ))}
        </View>

        <View fD="row" w="100%">
          <Text fW="bold">Total: </Text>
          <Text fW="bold" f={1} tA="right">
            {amountString}
          </Text>
        </View>
      </View>
      {/* {items && (
        <View pv={0.5} w="100%">
          <DetailList items={items} />
        </View>
      )} */}
    </>
  );
}
