import { createAsyncTypes } from 'utility/redux';

export const FETCH_ACCOUNTS_ASYNC = createAsyncTypes('fetch_accounts');
export const fetchAccounts = () => {
  return { type: FETCH_ACCOUNTS_ASYNC.pending };
};

export const SET_HOME_CURRENCY = 'set_home_currency';
export const setHomeCurrency = index => {
  return {
    type: SET_HOME_CURRENCY,
    payload: index,
  };
};

export const FETCH_RATES_ASYNC = createAsyncTypes('fetch_rates');
export const fetchRates = code => {
  return { type: FETCH_RATES_ASYNC.pending, payload: { code } };
};

export const FETCH_PAIRS_ASYNC = createAsyncTypes('fetch_pairs');
export const fetchPairs = () => {
  return { type: FETCH_PAIRS_ASYNC.pending };
};

export const SET_DISPLAY_CURRENCY = 'set_display_currency';
export const setDisplayCurrency = currency => {
  return {
    type: SET_DISPLAY_CURRENCY,
    payload: currency,
  };
};
