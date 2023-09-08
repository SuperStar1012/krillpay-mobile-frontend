import {
  FETCH_ACCOUNTS_ASYNC,
  SET_HOME_CURRENCY,
  SET_DISPLAY_CURRENCY,
  FETCH_RATES_ASYNC,
  FETCH_PAIRS_ASYNC,
} from './actions';
import { APP_LOAD, LOGOUT_USER, SET_TEMP_COMPANY } from 'utility/auth/actions';
import { CLEAR } from 'utility/data/actions';

export const INITIAL_STATE = {
  accounts: [],
  rates: [],
  loading: true,
  error: '',
  homeIndex: 0,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
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

    case CLEAR:
    case LOGOUT_USER:
    case SET_TEMP_COMPANY:
      return INITIAL_STATE;

    default:
      return state;
  }
};
