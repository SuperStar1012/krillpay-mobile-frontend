import React, { useState, useEffect } from 'react';
import { View } from 'components';
import moment from 'moment';
import { formatAmountString, renderRate } from 'utility/rates';
import { useFeeWithConversion } from 'screens/accounts/util/fees';
import { useConversion } from 'screens/accounts/util/rates';
import DetailList from 'components/outputs/DetailList';
import Info from 'components/layout/Info';

export default function SendDetails(props) {
  const { form, wallet, context } = props;
  const { amount, type, metadata } = form.getValues();
  const [items, setItems] = useState([]);
  const { currency } = wallet;
  const { rates, tier, actionConfig } = context;
  const { confirmMessage = '' } = actionConfig?.config ?? {};

  useEffect(() => {
    const { convAvailable, hasConversion, convRate } = useConversion(
      parseFloat(amount),
      rates,
      currency,
    );

    // Amount
    const showConversion =
      hasConversion && currency?.code !== rates.displayCurrency?.code;

    const amountString = formatAmountString(amount, currency);
    let _items = [
      {
        id: 'account',
        label: 'from_acount',
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

    const { totalString, feeString, fee, feeConvString, totalConvString } =
      useFeeWithConversion(
        amount,
        tier,
        currency,
        'send_' + type,
        convRate,
        rates.displayCurrency,
      );

    if (fee) {
      _items.push({
        id: 'fee',
        label: 'service',
        value: feeString,
        value2: feeConvString,
        horizontal: true,
      });
      _items.push({
        id: 'total_amount',
        value: totalString,
        value2: totalConvString,
        horizontal: true,
        bold: true,
      });
    }
    if (showConversion) {
      const rate = rates.rates['USD:' + currency?.code]?.rate;
      if (rate) {
        _items.push({
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

    // adding metadata fields if metadata exists
    if (metadata) {
      Object.keys(metadata).forEach(key => {
        _items.push({
          label: metadata[key]?.label,
          value: metadata[key]?.value,
        });
      });
    }

    setItems(_items);
  }, []);

  return (
    <>
      {!!confirmMessage && <Info m={0} mb={0.5} id={confirmMessage}></Info>}
      {items && (
        <View pv={0.5} w="100%">
          <DetailList items={items} />
        </View>
      )}
    </>
  );
}
