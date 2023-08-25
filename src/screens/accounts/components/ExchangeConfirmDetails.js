import React from 'react';
import DetailList from 'components/outputs/DetailList';
import { renderRate, formatAmountString } from '../util/rates';
import { formatTime } from 'utility/general';
import { useRehiveContext } from 'contexts';

export default function ExchangeConfirmDetails(props) {
  const { conversionQuote, toCurrency, fromCurrency } = props;

  const {
    context: { user },
  } = useRehiveContext();
  const {
    updated,
    to_total_amount,
    from_amount,
    from_total_amount,
    rate,
    from_fee,
    to_fee,
  } = conversionQuote ?? {};

  let items = [
    { label: 'date', value: formatTime(updated, 'DD-MM-YYYY', user) },
    {
      label: 'rate',
      value: renderRate({ toCurrency, fromCurrency, rate }),
      sentenceCase: true,
    },
    {
      label: 'you_buy',
      value: formatAmountString(to_total_amount, toCurrency, true),
    },
  ];
  if (to_fee)
    items.push({
      label: 'buy_service_fee',
      value: formatAmountString(to_fee, toCurrency, true),
    });
  if (from_fee) {
    items.push({
      label: 'base_cost',
      value: formatAmountString(from_amount, fromCurrency, true),
    });
    items.push({
      label: 'sell_service_fee',
      value: formatAmountString(from_fee, fromCurrency, true),
    });
  }
  items.push({
    label: 'total_cost',
    value: formatAmountString(from_total_amount, fromCurrency, true),
  });

  return <DetailList items={items} />;
}
