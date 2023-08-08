import { formatVariantsString } from './index';
import { formatAmountString } from 'utility/rates';
import { formatDivisibility } from 'utility/general';

export function formatPriceString(item, currency, fallback) {
  const { prices = [], variants = [] } = item;

  const matchPrice = price => price.currency.code === currency?.code;
  const price = prices?.find(matchPrice) ?? (fallback ? prices?.[0] : null);
  const filteredVariants = variants?.filter(
    item => item?.prices.findIndex(matchPrice) !== -1,
  );
  const variantOptions = filteredVariants
    .map(item => {
      const { label, prices, options } = item;
      const { amount } =
        prices.find(item => item?.currency?.code === currency?.code) ??
        prices?.[0] ??
        {};
      return {
        label:
          (label ? label : formatVariantsString(options)) +
          (amount ? ' @ ' + formatAmountString(amount, currency, true) : ''),
        amount,
        value: item.id,
      };
    })
    .sort(function (a, b) {
      return a.amount - b.amount;
    });

  const priceMax = Math.max.apply(
    Math,
    variantOptions.map(function (o) {
      return o.amount;
    }),
  );
  const priceMin = Math.min.apply(
    Math,
    variantOptions.map(function (o) {
      return o.amount;
    }),
  );

  const priceString =
    filteredVariants?.length > 0 && (priceMin || priceMax)
      ? currency?.symbol +
        (priceMin !== priceMax
          ? formatDivisibility(priceMin, currency?.divisibility) +
            ' - ' +
            formatDivisibility(priceMax, currency?.divisibility, true)
          : formatDivisibility(
              priceMin ? priceMin : priceMax,
              currency?.divisibility,
              true,
            ))
      : price
      ? (price?.currency && price?.currency?.symbol) +
        (price?.amount
          ? formatDivisibility(price?.amount, price?.currency?.divisibility)
          : 'N/A'
        ).toString()
      : '';

  return priceString;
}

export function mapItemNameString(item) {
  const { quantity, name } = item;
  return (quantity > 1 ? 'x' + quantity + ' ' : '') + name;
}
