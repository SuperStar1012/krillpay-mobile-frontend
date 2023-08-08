import { currentCompanyServicesSelector } from 'screens/auth/redux/selectors';
import { PERSIST_REHYDRATE } from 'redux-persist/es/constants';
import { createSelector } from 'reselect';
import { safe, arrayToObject, arrayToObjectNested } from 'utility/general';
import { get, orderBy } from 'lodash';
import { cryptoSelector } from '@redux/crypto/reducer';
import {
  FETCH_ACCOUNTS_ASYNC,
  SET_HOME_CURRENCY,
  SET_DISPLAY_CURRENCY,
  FETCH_RATES_ASYNC,
  FETCH_PAIRS_ASYNC,
} from './actions';
import {
  APP_LOAD,
  LOGOUT_USER,
  SET_TEMP_COMPANY,
} from 'screens/auth/redux/actions';
import { calculateRate } from '../util/rates';
import {
  configAccountsSelector,
  userTierSelector,
} from '@redux/rehive/selectors';
import { checkIfCrypto } from '../util/crypto';

const INITIAL_STATE = {
  accounts: [],
  rates: [],
  loading: true,
  error: '',
  homeIndex: 0,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PERSIST_REHYDRATE:
      return action.payload.auth || INITIAL_STATE;

    case APP_LOAD.success:
      return {
        ...state,
        homeIndex: 0,
      };

    case FETCH_ACCOUNTS_ASYNC.pending:
      return {
        ...state,
        loading: true,
        error: '',
      };
    case FETCH_ACCOUNTS_ASYNC.success:
      return {
        ...state,
        accounts: action.payload,
        loading: false,
        error: '',
      };
    case FETCH_ACCOUNTS_ASYNC.error:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case SET_HOME_CURRENCY:
      return {
        ...state,
        homeIndex: action.payload,
      };

    case SET_DISPLAY_CURRENCY:
      return {
        ...state,
        displayCurrency: action.payload,
      };

    case FETCH_RATES_ASYNC.pending:
      return {
        ...state,
        ratesLoading: true,
        ratesError: '',
      };
    case FETCH_RATES_ASYNC.success:
      return {
        ...state,
        rates: action.payload,
        ratesLoading: false,
      };
    case FETCH_RATES_ASYNC.error:
      return {
        ...state,
        rates: [],
        ratesLoading: false,
        ratesError: action.payload,
      };

    case FETCH_PAIRS_ASYNC.pending:
      return {
        ...state,
        pairsLoading: true,
        pairsError: '',
      };
    case FETCH_PAIRS_ASYNC.success:
      return {
        ...state,
        pairs: action.payload,
        pairsLoading: false,
      };
    case FETCH_PAIRS_ASYNC.error:
      return {
        ...state,
        pairs: [],
        pairsLoading: false,
        ratesError: action.payload,
      };

    case LOGOUT_USER:
    case SET_TEMP_COMPANY:
      return INITIAL_STATE;

    default:
      return state;
  }
};

export const accountsStateSelector = state => state.accounts;

export const ratesStateSelector = createSelector(
  accountsStateSelector,
  accountsState => {
    return accountsState.rates ? accountsState.rates : [];
  },
);

export const primaryCurrenciesSelector = createSelector(
  [accountsStateSelector, configAccountsSelector],
  (accountsState, accountsConfig) => {
    const accIndex = accountsState.accounts.findIndex(acc => acc.primary);
    const primaryAccounts = get(
      accountsState,
      ['accounts', accIndex, 'currencies'],
      [],
    );

    const primaryCurrency = primaryAccounts.find(acc => acc.active);

    return {
      items: primaryAccounts && primaryAccounts.length ? primaryAccounts : [],
      primary: primaryCurrency
        ? primaryCurrency
        : primaryAccounts.find(
            x => x.currency.code === accountsConfig?.defaultPrimaryCurrency,
          ) ?? primaryAccounts[0],
    };
  },
);

export const displayCurrencySelector = createSelector(
  [accountsStateSelector],
  accountsState => {
    return accountsState.displayCurrency
      ? accountsState.displayCurrency
      : { code: 'USD', divisibility: 2 };
  },
);

export const accountsSelector = createSelector(
  [accountsStateSelector],
  accountsState => {
    return safe(accountsState, 'accounts', []);
  },
);

const cryptoCodes = ['TXLM', 'XLM', 'XBT', 'TXBT'];

export const currenciesSelector = createSelector(
  [
    accountsStateSelector,
    cryptoSelector,
    primaryCurrenciesSelector,
    configAccountsSelector,
    userTierSelector,
  ],
  (accountsState, cryptoState, primarySelector, accountsConfig, tier) => {
    const { accounts } = accountsState;

    let activeCurrency = '';
    let primaryAccount = '';
    let currencyCode = '';

    let currencies = [];
    let tempCurrencies = [];
    for (let i = 0; i < accounts.length; i++) {
      const tempAccount = accounts[i];
      if (!primaryAccount && tempAccount.primary) {
        primaryAccount = tempAccount.reference;
      }
      tempCurrencies = tempAccount.currencies.map(currency => {
        currency.account = tempAccount.reference;
        currency.account_name = tempAccount.name;
        // currencyCode = currency.currency.code;
        currency.crypto = checkIfCrypto({ currency, crypto: cryptoState });
        // if (cryptoState?.XLM?.assets?.indexOf(currencyCode) !== -1) {
        //   currency.crypto = 'XLM';
        // } else if (cryptoState?.TXLM?.assets?.indexOf(currencyCode) !== -1) {
        //   currency.crypto = 'TXLM';
        // } else if (cryptoCodes?.includes(currencyCode)) {
        //   currency.crypto = currencyCode;
        // } else {
        //   currency.crypto = '';
        // }

        if (currency.active) {
          activeCurrency = currency.currency.code;
        }
        currency.primary = tempAccount.primary;
        return currency;
      });

      currencies = currencies.concat(tempCurrencies);
    }

    let hiddenCurrencies = Array.isArray(tier?.items)
      ? accountsConfig?.hideCurrencies?.find(x =>
          tier?.items?.map(y => y?.level)?.includes(x.tier),
        )
      : [];

    hiddenCurrencies = get(hiddenCurrencies, ['currencies'], []);

    currencies = currencies.filter(
      x => !hiddenCurrencies.includes(x.currency.code),
    );

    const activeIndex = currencies.findIndex(
      item =>
        item.account === primaryAccount &&
        item.currency.code === activeCurrency,
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
      multipleAccounts: safe(accounts, 'length', []) > 1,
      primaryAccount,
      loading: accountsState.loading,
      error: accountsState.error,
    };
  },
);

export const allTransactionsSelector = createSelector(
  [accountsStateSelector],
  accountsState => {
    return accountsState.transactions ? accountsState.transactions : [];
  },
);

export const conversionRatesSelector = createSelector(
  [
    accountsSelector,
    accountsStateSelector,
    ratesStateSelector,
    currentCompanyServicesSelector,
    displayCurrencySelector,
  ],
  (accounts, accountsState, ratesState, services, displayCurrency) => {
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
          loading: accountsState.ratesLoading,
          error: accountsState.ratesError,
          hasConversion,
          empty: false,
        };
      } catch (e) {
        console.log(e);
      }
    }
    return {
      items: [],
      displayCurrency: {},
      totalBalance: 0,
      hasConversion: false,
      loading: true,
    };
  },
);

export const conversionPairsSelector = createSelector(
  [accountsStateSelector],
  accountsState => {
    const { pairs, pairsLoading, pairsError } = accountsState;
    let fromCurrencies = [];

    if (pairs && pairs.length && pairs.length > 0) {
      fromCurrencies = pairs.map(item => item.key.split(':')[0]);
    }
    return {
      fromCurrencies,

      items: pairs ? pairs : [],
      loading: pairsLoading ? pairsLoading : false,
      error: pairsError ? pairsError : '',
    };
  },
);
