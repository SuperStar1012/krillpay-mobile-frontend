import { calculateRate } from './rates';
import { getCurrencyCode, formatAmountString } from 'utility/rates';
import { toDivisibility } from 'utility/general';
import { createConversion } from 'utility/rehive';
import Big from 'big.js';

export const calculateAccountTotal = (account, rates) => {
  const { keys, currencies } = account;
  const { displayCurrency, hasConversion } = rates;

  let totalBalance = 0.0;
  if (hasConversion) {
    try {
      keys.map(key => {
        const { currency, available_balance } = currencies[key];
        const fromCode = currency.code;
        const toCode = displayCurrency.code;
        const rate = calculateRate(fromCode, toCode, rates.rates);

        totalBalance =
          totalBalance +
          (available_balance / 10 ** currency.divisibility) * rate;
      });

      const diff =
        totalBalance.toString().length -
        Math.floor(totalBalance).toString().length;
      if (diff < 3) {
        totalBalance = totalBalance.toFixed(2);
      } else if (diff > displayCurrency.divisibility) {
        totalBalance = totalBalance.toFixed(displayCurrency.divisibility);
      }
    } catch (e) {
      console.log('totalBalance error', e);
    }
  }

  return totalBalance;
};

export function checkBlocked(props) {
  const {
    context,
    stateId,
    wallet,
    form,
    pageId,
    result,
    // screenConfig: { subtypes },
  } = props;
  const subtypes = mapSubtypes({ pageId, wallet, context });

  if (!subtypes?.length) return null;
  try {
    const {
      // currencyCode,
      amount,
      type,
      toCurrency,
      toAccount,
      fromWallet,
      toWallet = { currency: toCurrency, account: toAccount },
    } = form.watch();

    let { currency, available_balance } = wallet;
    if (toCurrency) currency = toCurrency;
    const currencyCode = currency?.code;

    const tier = context?.tier?.items?.[0];
    const limits =
      tier?.limits?.filter(item => item?.currency === currencyCode) ?? [];

    // flow blocked check
    let isTierBlocked = true;
    for (let index = 0; index < subtypes?.length; index++) {
      const subtype = subtypes?.[index];
      const subtypeLimits = limits.filter(item => item.subtype === subtype);

      if (
        subtypeLimits?.length === 0 ||
        subtypeLimits.findIndex(item => item?.value > 0) !== -1
      ) {
        isTierBlocked = false;
        index = subtypes?.length;
      }
    }
    if (isTierBlocked) return config.tierBlocked({ level: tier?.level });

    const subtype = mapSubtype({ pageId, type, wallet, toCurrency });
    let subtypeLimits = limits?.filter(item => item?.subtype === subtype) ?? [];
    const minIndex = subtypeLimits.findIndex(item => item.type === 'min');
    const minimumLimit =
      minIndex !== -1 ? subtypeLimits.splice(minIndex, 1)?.[0] : null;

    let amountValue = parseInt(amount * 10 ** currency?.divisibility);
    if (
      subtype === 'withdraw_manual' &&
      currency?.code !== wallet?.currency?.code
    ) {
      const convRate = calculateRate(
        wallet?.currency?.code,
        currency?.code,
        context?.rates?.rates,
      );
      amountValue = parseInt(
        Big(parseFloat(amount ? amount : 0)).times(convRate) *
          10 ** currency?.divisibility,
      );
    }

    // min limit check
    if (
      typeof minimumLimit?.value === 'number' &&
      amountValue > 0 &&
      amountValue < minimumLimit?.value
    )
      return config.limitBlockedMin({
        type,
        amount: formatAmountString(minimumLimit?.value, currency, true),
        pageId,
        level: tier?.level,
      });

    // max limit check
    Boolean(limits?.filter(item => !item?.value));
    subtypeLimits.sort(function (a, b) {
      return a.amount - b.amount;
    });

    const subtypeTnxLimit = subtypeLimits?.[0];
    if (
      typeof subtypeTnxLimit?.value === 'number' &&
      amountValue > subtypeTnxLimit?.value
    )
      return config.limitBlocked({
        type,
        timeframe:
          subtypeTnxLimit?.type === 'day_max'
            ? 'daily '
            : subtypeTnxLimit?.type === 'month_max'
            ? 'monthly '
            : '',
        amount: formatAmountString(subtypeTnxLimit?.value, currency, true),
        pageId,
        level: tier?.level,
      });

    const conversionCheck = context?.rates?.rates
      ? handleConversionCheck(props)
      : null;
    if (conversionCheck) return conversionCheck;

    // post submit limit check
    const { message = '' } = result ?? {};
    if (
      message?.includes('above the maximum') ||
      message?.includes('exceeds')
    ) {
      const { type } = form.getValues();

      const isDaily = message.includes('daily');
      const isMonthly = message.includes('monthly');
      const limitAmount = message?.split('amount of ')?.[1];

      return config.limitBlockedResult({
        type,
        timeframe: isDaily ? 'daily ' : isMonthly ? 'monthly ' : '',
        amount: limitAmount + ' ' + getCurrencyCode(currency),
        pageId,
        level: tier?.level,
      });
    }
  } catch (e) {}

  return null;
}

export function handleConversionCheck(props) {
  const { context, wallet, form } = props;
  const { rates } = context;

  const {
    amount,
    toCurrency,
    toAccount,
    fromWallet,
    toWallet = { currency: toCurrency, account: toAccount },
  } = form.watch();
  const amountValue = parseFloat(amount ? amount : 0);

  const tier = context?.tier?.items?.[0];

  const isBuy = !!fromWallet;

  let buyCurrency = isBuy ? wallet?.currency : toWallet?.currency;
  let sellCurrency = isBuy ? fromWallet?.currency : wallet?.currency;
  if (!buyCurrency || !sellCurrency) return null;

  const buyLimit = tier?.limits?.find(
    item =>
      item?.currency === buyCurrency?.code &&
      item?.subtype === 'buy' &&
      item?.type === 'max',
  );
  const sellLimit = tier?.limits?.find(
    item =>
      item?.currency === sellCurrency?.code &&
      item?.subtype === 'sell' &&
      item?.type === 'max',
  );

  const convRate = calculateRate(
    buyCurrency?.code,
    sellCurrency?.code,
    rates?.rates,
  );

  const buyAmount = toDivisibility(
    isBuy
      ? amountValue
      : Big(amountValue)
          .div(convRate ? convRate : 1)
          .toFixed(buyCurrency?.divisibility),
    buyCurrency,
  );

  const sellAmount = toDivisibility(
    isBuy
      ? Big(amountValue).times(convRate).toFixed(sellCurrency?.divisibility)
      : amountValue,
    sellCurrency,
  );

  if (sellLimit && sellLimit?.value < sellAmount)
    return config.limitBlocked({
      type: '',
      amount: formatAmountString(sellLimit?.value, sellCurrency, true),
      pageId: 'sell',
      level: tier?.level,
    });
  if (buyLimit && buyLimit?.value < buyAmount)
    return config.limitBlocked({
      type: '',
      amount: formatAmountString(buyLimit?.value, buyCurrency, true),
      pageId: 'buy',
      level: tier?.level,
    });

  return null;
}
export function mapSubtype({ pageId, type, wallet, toCurrency }) {
  switch (pageId) {
    case 'send':
      if (!type) {
        return '';
      }
      return pageId + '_' + (type ?? 'email');

    case 'withdraw':
      if (wallet?.crypto && wallet?.currency?.code === toCurrency?.code)
        return 'withdraw_crypto';
      return 'withdraw_manual';

    case 'buy':
    case 'sell':
    default:
      return pageId;
  }
}

export function mapSubtypes({ pageId, wallet, context }) {
  switch (pageId) {
    case 'send':
      return ['send_crypto', 'send_email', 'send_mobile'];

    case 'withdraw':
      let subtypes = ['withdraw_' + (wallet?.crypto ? 'crypto' : 'manual')];
      if (wallet?.crypto) {
        const { pairs: withdrawPairs = [] } = context?.actionConfig?.config;
        const filteredPairs = withdrawPairs.filter(
          pair => pair.split(':')[0] === wallet?.currency?.code,
        );
        if (filteredPairs?.length > 0) subtypes.push('withdraw_manual');
      }
      return subtypes;

    case 'buy':
    case 'sell':
    default:
      return [pageId];
  }
}

const config = {
  tierBlocked: ({ level }) => ({
    title: 'Tier level restricted',
    description: `You are unable to do this action ${
      level === 3
        ? ''
        : 'at your current tier level, your current tier is too low'
    }`,
    back: true,
  }),
  limitBlocked: ({ type, amount, pageId, level }) => ({
    title: 'Tier limit reached',
    description: `You have reached your ${
      pageId + (type ? ' to ' + type : '')
    } limit. Your ${pageId} limit at this tier is ${amount}${
      level === 3 ? '' : ', level up to increase or remove limits'
    }`,
  }),
  limitBlockedMin: ({ type, amount, pageId, level }) => ({
    title: 'Minimum limit not reached',
    description: `You have to ${pageId} a minimum of ${amount}`,
  }),
  limitBlockedResult: ({ type, amount, pageId, timeframe, level }) => ({
    title: 'Tier limit reached',
    description: `You have reached your ${
      pageId + (type ? ' to ' + type : '')
    } limit. Your ${timeframe}limit at this tier is ${amount}${
      level === 3 ? '' : ', level up to increase or remove limits'
    }`,
  }),
  feeBlocked: ({ type, fee, pageId }) => ({
    title: 'Tier limit reached',
    description: `You are attempting to ${
      (type === 'crypto' ? 'crypto ' : '') + pageId
    } your max amount. Additional fees of ${fee} will increase this amount to a value greater than your current balance. Please adjust the amount or deposit more funds and try again`,
  }),
};

export async function handleConversionQuoteCreate(props) {
  const { form, context } = props;
  const { wallet, wallets, services } = context;
  const { currency } = wallet;

  const {
    toCurrency,
    toAccount,
    toWallet = { currency: toCurrency, account: toAccount },
    fromWallet,
    amount,
  } = form.watch();
  const isTo = !Boolean(fromWallet?.currency);
  const convWallet = isTo ? toWallet : fromWallet;
  const { currency: convCurrency } = convWallet;
  const key = isTo
    ? currency?.code + ':' + convCurrency?.code
    : convCurrency?.code + ':' + currency?.code;
  const hasConversion =
    services['Conversion Service'] && convCurrency?.code !== currency?.code;

  const amountValue = parseInt(
    parseFloat(amount) * 10 ** currency?.divisibility,
  );

  let data = {};
  if (hasConversion) {
    if (isTo) {
      data = {
        from_amount: amountValue,
      };
    } else {
      data = {
        to_amount: amountValue,
      };
    }
    let convAccount = convWallet?.account;
    if (!convAccount) {
      convAccount =
        wallets?.accounts?.[wallets?.primaryAccount]?.currencies?.[
          convCurrency?.code
        ]?.account ??
        wallets?.data?.find(item => item?.currency?.code === convCurrency?.code)
          ?.account ??
        '';
    }
    data = {
      ...data,
      debit_account: isTo ? wallet?.account : convAccount,
      credit_account: isTo ? convAccount : wallet?.account,
      key,
    };

    const resp = await createConversion(data);
    if (resp.status === 'success') {
      form.setValue('conversionQuote', resp?.data);
      form.setValue('id', resp?.data?.id);
    } else {
      // setData(resp);//TODO:
    }
  }
}
