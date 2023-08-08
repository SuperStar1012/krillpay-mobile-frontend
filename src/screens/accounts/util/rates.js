import {
  addCommas,
  formatDivisibility,
  scientificToDecimal,
} from 'utility/general';
import { useState, useEffect } from 'react';
import { get } from 'lodash';
import { getConversionRate } from 'utility/rehive';
import moment from 'moment';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';

export const calculateRate = (fromCurrency, toCurrency, rates) => {
  let fromRate = 0;
  let toRate = 0;
  if (fromCurrency === toCurrency) return 1;
  try {
    fromRate =
      fromCurrency === 'USD'
        ? 1
        : parseFloat(rates['USD:' + fromCurrency].rate);
    toRate =
      toCurrency === 'USD' ? 1 : parseFloat(rates['USD:' + toCurrency].rate);
    return toRate / fromRate;
  } catch (e) {
    return 0;
  }
};

export const convertAmount = ({ values, currency, rates, displayCurrency }) => {
  let { amount, display } = values;
  if (!displayCurrency) {
    displayCurrency = rates.displayCurrency;
  }
  const convRate = calculateRate(
    currency.currency.code,
    displayCurrency.code,
    rates.rates,
  );

  const toCurrency = display ? displayCurrency : currency?.currency;

  amount = !amount ? 0 : amount.charAt(0) === '.' ? `0${amount}` : amount;

  const formattedAmount = Big(amount ? parseFloat(amount) : 0)
    .times(display ? Big(1).div(convRate) : convRate)
    .times(Big(10).pow(toCurrency?.divisibility ?? 2));

  const convBase = Big(formattedAmount).div(
    Big(10).pow(toCurrency?.divisibility ?? 2),
  );

  return convBase;
};

export const formatConvAmount = ({
  values,
  currency,
  rates,
  displayCurrency,
}) => {
  const { amount, display } = values;
  if (!displayCurrency) {
    displayCurrency = rates.displayCurrency;
  }
  const convRate = calculateRate(
    currency.currency.code,
    displayCurrency.code,
    rates.rates,
  );

  const toCurrency = display ? currency.currency : displayCurrency;

  const convBase =
    Math.floor(
      parseFloat(amount ? amount : 0) *
        (display ? 1 / convRate : convRate) *
        10 ** toCurrency.divisibility,
    ) /
    10 ** toCurrency.divisibility;

  let convAmount = formatDecimals(convBase, toCurrency.divisibility);

  return convAmount + ' ' + getCurrencyCode(toCurrency);
};

export const formatDecimals = (
  amount,
  toDivisibility,
  noCommas,
  formatDivisibility,
) => {
  if (!formatDivisibility) formatDivisibility = toDivisibility;
  amount = parseFloat(amount ? amount : 0);
  const amountString = scientificToDecimal(amount).toString();
  const diff = amountString.length - Math.floor(amount).toString().length;
  let convAmount = 0.0;

  if (diff < 3) {
    convAmount = amount.toFixed(2);
  } else if (diff < formatDivisibility) {
    convAmount = amount.toFixed(diff);
  } else {
    convAmount = amount.toFixed(formatDivisibility);
  }
  if (noCommas) {
    return convAmount.toString();
  }
  return addCommas(convAmount);
};

export const renderRate = ({ fromCurrency, toCurrency, rate }) => {
  if (!rate) {
    return '';
  }
  const flip = rate > 1;

  if (toCurrency.currency) {
    toCurrency = toCurrency.currency;
  }
  if (fromCurrency.currency) {
    fromCurrency = fromCurrency.currency;
  }

  const fromCode = getCurrencyCode(fromCurrency);
  const toCode = getCurrencyCode(toCurrency);

  const fromString =
    formatDecimals(
      flip ? 1 : 1 / rate,
      flip
        ? fromCurrency.divisibility
        : fromCurrency.divisibility > 4
        ? fromCurrency.divisibility
        : 4,
      false,
    ) +
    ' ' +
    fromCode;

  const toString =
    formatDecimals(
      flip ? rate : 1,
      flip
        ? toCurrency.divisibility > 4
          ? toCurrency.divisibility
          : 4
        : toCurrency.divisibility,
      false,
    ) +
    ' ' +
    toCode;

  // const { t } = useTranslation();
  const forString = '='; //t('for');

  return flip
    ? fromString + ' ' + forString + ' ' + toString
    : toString + ' ' + forString + ' ' + fromString;
};

export const formatAmountString = (
  amount,
  currency,
  withDivisibility,
  overrideDivisibility,
) => {
  if (currency?.currency) {
    currency = currency?.currency;
  }
  let { divisibility } = currency;

  if (overrideDivisibility) divisibility = overrideDivisibility;

  amount = Math.abs(amount);
  if (withDivisibility && divisibility > 0) {
    amount = amount / 10 ** divisibility;
  }
  return formatDecimals(amount, divisibility) + ' ' + getCurrencyCode(currency);
};

export function getCurrencyCode(currency = {}) {
  // if (currency?.currency) currency = currency?.currency;
  return currency?.display_code ?? currency?.code ?? '';
}

export function useConversion(available, rates, currency, isRTL = false) {
  const { hasConversion, displayCurrency } = rates;

  let convAvailable = '';
  if (hasConversion && available) {
    const convRate = calculateRate(
      currency.code,
      displayCurrency.code,
      rates.rates,
    );

    if (convRate) {
      convAvailable =
        Math.floor(
          available * convRate * 10 ** rates.displayCurrency.divisibility,
        ) /
        10 ** rates.displayCurrency.divisibility;

      const diff =
        convAvailable.toString().length -
        Math.floor(convAvailable).toString().length;
      if (diff < 3) {
        convAvailable = convAvailable.toFixed(2);
      } else if (diff > displayCurrency.divisibility) {
        convAvailable = convAvailable.toFixed(displayCurrency.divisibility);
      }
      convAvailable = isRTL
        ? `${getCurrencyCode(displayCurrency)} ${convAvailable} ~` 
        : `~ ${convAvailable} ${getCurrencyCode(displayCurrency)}`;
    } else convAvailable = 'N/A ' + getCurrencyCode(displayCurrency);
  }
  return { hasConversion, convAvailable };
}

export function useConversionTransactionList(services, rates, currency, item) {
  const { amount, created } = item;
  const [loading, setLoading] = useState(false);
  const [tempRates, setTempRates] = useState(rates.rates);

  // custom hook useConversion(services, rates, currency)
  const { hasConversion } = useConversion(services, rates, currency);
  const currencyCode = get(currency, ['code']);

  let tempConvRate = 0;
  let convAmountString = '';

  // this can be a moved to a custom hook
  useEffect(() => {
    if (hasConversion) {
      setLoading(true);
      async function fetchData() {
        let key__in = '';
        if (currencyCode !== 'USD') {
          key__in = 'USD:' + currencyCode;
        }
        if (rates.displayCurrency.code !== 'USD') {
          key__in = key__in ? key__in + ',' : '';
          key__in = key__in + 'USD:' + rates.displayCurrency.code;
        }

        const resp = await getConversionRate(key__in, created);
        if (resp && resp.status === 'success') {
          setTempRates(get(resp, ['data', 'rates'], {}));
        }
        setLoading(false);
      }
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasConversion]);
  if (hasConversion) {
    tempConvRate = calculateRate(
      currencyCode,
      rates.displayCurrency.code,
      tempRates,
    );
    convAmountString =
      '~' +
      formatAmountString(
        formatDivisibility(amount, currency.divisibility).replace('-', '') *
          tempConvRate,
        rates.displayCurrency,
      );
  }
  return { loading, convAmountString, tempConvRate };
}

function handleConversionServicesCheck(services, rates, currency) {
  return Boolean(
    services['Conversion Service'] &&
      rates &&
      rates.rates &&
      rates.displayCurrency &&
      rates.displayCurrency.code !== currency.code,
  );
}

export function handleConversion(services, rates, currency) {
  const hasConversion = handleConversionServicesCheck(
    services,
    rates,
    currency,
  );
  let convRate = 1;
  let rateOutput = null;
  if (hasConversion) {
    convRate = calculateRate(
      currency.code,
      rates.displayCurrency.code,
      rates.rates,
    );
    const rate = rates.rates['USD:' + currency.code];
    if (rate) {
      rateOutput = {
        label: 'Rate',
        value: renderRate({
          fromCurrency: currency,
          toCurrency: rates.displayCurrency,
          rate: convRate,
        }),
        value2: 'Last updated ' + moment(rate.created).fromNow(),
      };
    }
  }
  return { hasConversion, convRate, rateOutput };
}
