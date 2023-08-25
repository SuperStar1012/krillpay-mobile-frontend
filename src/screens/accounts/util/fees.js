import { get } from 'lodash';
import { formatAmountString } from './rates';

export const getFee = (tier, subtype, currency) => {
  return get(tier, ['items', 0, 'fees'], []).find(
    fee => fee.subtype === subtype && fee.currency === currency.code,
  );
};

export const getLimits = (tier, subtype, currency) => {
  return get(tier, ['items', 0, 'limits'], []).filter(
    limit => limit.subtype === subtype && limit.currency === currency.code,
  );
};

// export const calculateFee = (amount, fee) => {
//   console.log('TCL: calculateFee -> amount', amount);
//   return fee.value + parseFloat(amount) * fee.percentage / 100;
// };

export const calculateFee = (amount, fee, divisibility = 0.1) => {
  return (
    fee.value + (parseFloat(amount) * 10 ** divisibility * fee.percentage) / 100
  );
};

export function useFee(amount, tier, currency, type, valueOnly) {
  let feeAmount = 0.0;
  let totalAmount = parseFloat(amount) * 10 ** currency.divisibility;
  let feeString = '';
  let totalString = '';
  const fee = getFee(tier, type, currency);
  if (fee) {
    feeAmount =
      calculateFee(
        valueOnly && fee.value && !fee.percentage ? 1 : amount,
        fee,
        currency.divisibility,
      ) * (type.match(/buy/) ? -1 : 1);
    feeString = formatAmountString(feeAmount, currency, true);
    totalAmount = totalAmount + feeAmount;
    totalString = formatAmountString(totalAmount, currency, true);
  }
  return { feeAmount, feeString, totalAmount, totalString, fee };
}

export function useFeeWithConversion(
  amount,
  tier,
  currency,
  subtype,
  rate,
  displayCurrency,
  valueOnly = false,
) {
  const { totalAmount, totalString, feeAmount, feeString, fee } = useFee(
    amount,
    tier,
    currency,
    subtype,
    valueOnly,
  );
  let feeConvString = '';
  let totalConvString = '';
  if (rate) {
    feeConvString =
      '~' +
      formatAmountString(
        (feeAmount / 10 ** currency.divisibility) * rate,
        displayCurrency,
      );
    totalConvString =
      '~' +
      formatAmountString(
        (totalAmount / 10 ** currency.divisibility) * rate,
        displayCurrency,
      );
  }
  return {
    feeAmount,
    feeString,
    totalAmount,
    totalString,
    fee,
    feeConvString,
    totalConvString,
  };
}

export function useLimitValidation(amount, tier, currency, type, toCurrency) {
  if (!toCurrency) {
    toCurrency = currency;
  }
  const limits = getLimits(tier, type, toCurrency);
  if (limits.length > 0) {
    let minimum = null;
    let maximum = null;
    const subtypeLimitMinimum = limits.find(limit => limit.type === 'Minimum');
    const subtypeLimitMaximum = limits.find(limit => limit.type === 'Maximum');
    if (subtypeLimitMinimum) {
      minimum = parseFloat(
        subtypeLimitMinimum.value / 10 ** currency.divisibility,
      );
    }
    if (subtypeLimitMaximum) {
      maximum = parseFloat(
        subtypeLimitMaximum.value / 10 ** currency.divisibility,
      );
    }

    if (maximum && amount > maximum) {
      return {
        amount:
          'Maximum sell limit exceeded: ' +
          formatAmountString(maximum, toCurrency),
      };
    } else if (amount < minimum) {
      return {
        amount:
          'Minimum sell limit not met: ' +
          formatAmountString(minimum, toCurrency),
      };
    }
  }

  return null;
}
