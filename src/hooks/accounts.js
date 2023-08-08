import {
  getConversionSettings,
  getConversionCurrency,
  getConversionRates,
  getAccounts,
  getConversionPairs,
} from 'utility/rehive';
import { useMemo, useEffect } from 'react';
import { uniq, orderBy } from 'lodash';
import { arrayToObjectNested, arrayToObject } from 'utility/general';
import { calculateRate } from 'utility/rates';

import { useQuery } from 'react-query';
import { addCryptoToAccount } from 'screens/accounts/util/crypto';
import { useCrypto, CRYPTO_INITIAL_STATE } from './crypto';

const INITIAL_STATE = {
  crypto: CRYPTO_INITIAL_STATE,
  loading: true,
  primaryCurrencies: {},
  rates: null,
  displayCurrency: 'USD',
  wallets: [],
  currencies: [],
  conversionRates: [],
  conversionPairs: [],
};

export function useAccounts({ init, services, config, tier, user }) {
  const hasConversion = services['Conversion Service'];
  // refetchInterval
  const enabled = init && Boolean(user?.id);
  const queryAccounts = useQuery(
    ['accounts', user?.id],
    async () => getAccounts(),
    {
      enabled,
      // refetchInterval: 5000,
      refetchIntervalInBackground: true,
    },
  );

  const crypto = useCrypto({ init, services, user });

  const accounts = queryAccounts?.data?.results ?? [];

  const queryConversionSettings = useQuery(
    ['conversionSettings', user?.id],
    () => getConversionSettings(),
    {
      enabled: enabled && hasConversion,
    },
  );
  const code = queryConversionSettings?.data?.display_currency;
  const enabledConversion =
    init &&
    Boolean(user?.id) &&
    hasConversion &&
    queryConversionSettings?.isSuccess;

  const queryConversionCurrency = useQuery(
    ['conversionCurrency', user?.id, code],
    () => getConversionCurrency(code ?? 'USD'),
    {
      enabled: enabledConversion && Boolean(code),
    },
  );
  const queryPairs = useQuery(['pairs', user?.id], () => getConversionPairs(), {
    enabled: enabledConversion,
  });

  const currenciesTemp = uniq(
    accounts.map(account =>
      account.currencies.map(currency => {
        return 'USD:' + currency.currency.code;
      }),
    ),
  );

  let ratesTemp = (code ? 'USD:' + code + ',' : '') + currenciesTemp.join();

  const queryRates = useQuery(
    ['rates', user?.id],
    () => getConversionRates(ratesTemp),
    {
      enabled: enabledConversion,
      // refetchInterval: 5000,
    },
  );
  // useEffect(() => {
  //   if (queryAccounts?.error?.status === 401) {
  //     queryAccounts.remove();
  //     queryRates.remove();
  //     queryConversionCurrency.remove();
  //     queryPairs.remove();
  //   }
  // }, [queryAccounts?.error]);

  const isLoading = Boolean(
    queryAccounts?.isLoading ||
      (hasConversion &&
        (queryRates?.isLoading ||
          queryPairs?.isLoading ||
          queryConversionCurrency?.isLoading)),
    // crypto?.loading,
  );

  const ratesState = ratesStateSelector(queryRates);

  const store = { accounts, rates: ratesState };

  const { accountsConfig } = config;
  const primaryCurrencies = useMemo(
    () => primaryCurrenciesSelector(store, accountsConfig),
    [store, accountsConfig],
  );

  const displayCurrency = hasConversion
    ? displayCurrencySelector(queryConversionCurrency)
    : null;
  const currencies = useMemo(
    () =>
      currenciesSelector(
        queryAccounts,
        crypto?.context,
        primaryCurrencies,
        accountsConfig,
        tier,
      ),
    [store, crypto?.context, primaryCurrencies, accountsConfig, tier],
  );
  const conversionPairs = conversionPairsSelector(queryPairs);
  const conversionRates = useMemo(
    () =>
      hasConversion
        ? conversionRatesSelector(
            store?.accounts,
            ratesState,
            services,
            displayCurrency,
          )
        : null,
    [store?.accounts, ratesState, services, displayCurrency],
  );
  const context = isLoading
    ? INITIAL_STATE
    : {
        ...queryAccounts,
        crypto: crypto?.context,
        loading: isLoading,
        primaryCurrencies,
        rates: conversionRates,
        displayCurrency,
        wallets: currencies,
        currencies,
        conversionRates,
        conversionPairs,
      };

  function refresh(id) {
    if (!id || (id && id === 'accounts')) queryAccounts.refetch();
    if (!id || (id && id === 'rates')) queryConversionSettings.refetch();
    if (!id || (id && id === 'rates')) queryRates.refetch();
    if (!id || (id && id === 'rates')) queryPairs.refetch();
  }

  return { context, refresh };
}

export const accountsStateSelector = state => state.accounts;

export const primaryCurrenciesSelector = (accountsState, accountsConfig) => {
  const accIndex = accountsState.accounts.findIndex(acc => acc.primary);
  const primaryAccounts =
    accountsState?.accounts?.[accIndex !== -1 ? accIndex : 0]?.currencies ?? [];

  const primaryCurrency = primaryAccounts.find(acc => acc.active);

  return {
    items: primaryAccounts?.length ? primaryAccounts : [],
    primary:
      primaryCurrency ??
      primaryAccounts.find(
        x => x.currency.code === accountsConfig?.defaultPrimaryCurrency,
      ) ??
      primaryAccounts?.[0] ??
      null,
  };
};

export const displayCurrencySelector = query => {
  return query?.data?.results?.[0] ?? { code: 'USD', divisibility: 2 };
};

export const currenciesSelector = (
  queryAccounts,
  crypto,
  primarySelector,
  accountsConfig,
  tier,
) => {
  const accounts = queryAccounts?.data?.results ?? [];
  let activeCurrency = '';
  let primaryAccount = '';

  let currencies = [];
  let tempCurrencies = [];
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    if (!primaryAccount && account.primary) {
      primaryAccount = account.reference;
    }
    tempCurrencies = account.currencies.map(currency => {
      currency.account = account.reference;
      currency.account_name = account.name;

      currency = addCryptoToAccount({ currency, crypto, account });

      if (currency.active) {
        activeCurrency = currency.currency.code;
      }
      currency.primary = account.primary;
      return currency;
    });

    currencies = currencies.concat(tempCurrencies);
  }

  let hiddenCurrencies = Array.isArray(tier?.items)
    ? accountsConfig?.hideCurrencies?.find(x =>
        tier?.items?.map(y => y.level)?.includes(x.tier),
      )
    : [];

  hiddenCurrencies = hiddenCurrencies?.currencies ?? [];

  currencies = currencies.filter(
    x => !hiddenCurrencies.includes(x.currency.code),
  );

  const activeIndex = currencies.findIndex(
    item =>
      item.account === primaryAccount && item.currency.code === activeCurrency,
  );

  if (currencies.length > 0 && activeIndex !== -1) {
    const activeItem = currencies[activeIndex];
    currencies[activeIndex] = currencies[0];
    currencies[0] = activeItem;
  }

  const accountsObj = arrayToObject(accounts, 'reference');
  let accountsDictionary = {};

  Object.keys(accountsObj).map(function (key, index) {
    accountsDictionary[accountsObj[key].name] = key.toString();
  });

  Object.keys(accountsObj).forEach(function (key) {
    const temp = arrayToObjectNested(
      accountsObj[key].currencies,
      'currency',
      'code',
    );
    accountsObj[key] = {
      ...accountsObj[key],
      currencies: temp,
      keys: Object.keys(temp),
    };
  });

  currencies = orderBy(
    currencies,
    x => x.currency.code === primarySelector?.primary?.currency?.code,
    ['desc'],
  );

  return {
    data: currencies,
    accounts: accountsObj,
    accountsDictionary,
    multipleAccounts: (accounts?.length ?? 0) > 1,
    primaryAccount,
    loading: Boolean(queryAccounts.isRefreshing || queryAccounts.isLoading),
    error: queryAccounts.error,
  };
};

export const conversionRatesSelector = (
  accounts,
  ratesState,
  services,
  displayCurrency,
) => {
  if (ratesState.rates) {
    try {
      let totalBalance = 0.0;
      const hasConversion = Boolean(services['Conversion Service']);
      if (hasConversion) {
        try {
          accounts.map(account =>
            account.currencies.map(currencyObj => {
              const { currency, available_balance } = currencyObj;

              const fromCode = currency.code;
              const toCode = displayCurrency.code;
              const rate = calculateRate(fromCode, toCode, ratesState.rates);
              totalBalance =
                totalBalance +
                (available_balance / 10 ** currency.divisibility) * rate;
            }),
          );

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
      return {
        ...ratesState,
        displayCurrency,
        totalBalance,
        hasConversion,
        empty: false,
      };
    } catch (e) {
      console.log(e);
    }
  }
  return {
    rates: null,
    displayCurrency: {},
    totalBalance: 0,
    hasConversion: false,
  };
};

export const conversionPairsSelector = queryPairs => {
  const { data, isLoading, error = '' } = queryPairs;
  let fromCurrencies = [];
  const pairs = data?.results;

  if (pairs && pairs.length && pairs.length > 0) {
    fromCurrencies = pairs.map(item => item.key.split(':')[0]);
  }
  return {
    fromCurrencies,

    items: pairs ? pairs : [],
    loading: isLoading ?? false,
    error,
  };
};

export const ratesStateSelector = queryRates => {
  const { data, isLoading, error = '' } = queryRates;

  return {
    ...data,
    loading: isLoading ?? false,
    error,
  };
};
