import React, { useState, useEffect } from 'react';
import { View } from 'components';
import moment from 'moment';
import { formatAmountString, renderRate } from 'utility/rates';
import { useFeeWithConversion } from 'screens/accounts/util/fees';
import { useConversion } from 'screens/accounts/util/rates';
import DetailList from 'components/outputs/DetailList';
import Info from 'components/layout/Info';

export default function WyreDetails(props) {
  const { form, wallet, context } = props;
  const { amount } = form.getValues();
  // const [items, setItems] = useState([]);
  const { currency } = wallet;
  const { rates, tier } = context;

  const { convAvailable, hasConversion, convRate } = useConversion(
    parseFloat(amount),
    rates,
    currency,
  );

  // Amount
  const showConversion =
    hasConversion && currency?.code !== rates.displayCurrency?.code;

  const amountString = formatAmountString(amount, currency);

  const { totalString, feeString, fee, feeConvString, totalConvString } =
    useFeeWithConversion(
      amount,
      tier,
      currency,
      'deposit_wyre',
      convRate,
      rates.displayCurrency,
    );

  let items = [];

  if (fee) {
    items = [
      {
        id: 'deposit_amount',
        value: wallet?.account_name,
        horizontal: true,
      },
      {
        id: 'amount',
        label: 'sending_amount',
        value: amountString,
        value2: showConversion && convAvailable,
        horizontal: true,
      },
    ];

    items.push({
      id: 'fee',
      label: 'service',
      value: feeString,
      value2: feeConvString,
      horizontal: true,
    });
    items.push({
      id: 'total_amount',
      value: totalString,
      value2: totalConvString,
      horizontal: true,
      bold: true,
    });
  }
  if (showConversion) {
    const rate = rates.rates['USD:' + currency?.code];
    if (rate) {
      items.push({
        label: 'rate',
        value: renderRate({
          fromCurrency: currency,
          toCurrency: rates.displayCurrency,
          rate,
        }),
        // labelBold: true,
        horizontal: true,
        value2: 'Last updated ' + moment(rate.created).fromNow(),
      });
    }
  }

  // if (items?.length === 0) return null;

  return (
    <>
      <Info m={0} mb={0.5} id="wyre_deposit_confirm_message"></Info>
      {items?.length > 0 && (
        <View pv={0.5} w="100%">
          <DetailList items={items} />
        </View>
      )}
    </>
  );
}
