import { PERSIST_REHYDRATE } from 'redux-persist/es/constants';
import { FETCH_CRYPTO_ASYNC, LOGOUT_USER } from '@redux/actions';
import { createSelector } from 'reselect';

const INITIAL_STATE = {
  XBT: null,
  TXBT: null,
  ETH: null,
  TETH: null,
  XBT: null,
  TXBT: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PERSIST_REHYDRATE:
      return action.payload.auth || INITIAL_STATE;

    case FETCH_CRYPTO_ASYNC.pending:
      return {
        ...state,
        loading: true,
      };
    case FETCH_CRYPTO_ASYNC.success:
      return {
        ...state,
        loading: false,
        [action.payload.type]: {
          ...action.payload,
          error: '',
        },
      };
    case FETCH_CRYPTO_ASYNC.error:
      return {
        ...state,
        loading: false,
        [action.payload.type]: null,
      };

    case LOGOUT_USER:
      return INITIAL_STATE;

    default:
      return state;
  }
};
export const cryptoStateSelector = state => state.crypto;

export const cryptoSelector = createSelector(
  cryptoStateSelector,
  cryptoState => cryptoState,
);
