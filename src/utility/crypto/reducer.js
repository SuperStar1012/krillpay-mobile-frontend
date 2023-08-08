import { LOGOUT_USER, CLEAR } from 'utility/data/actions';
import { FETCH_CRYPTO_ASYNC } from './actions';

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
          user: action.payload.user,
          assets: action.payload.assets,
          company: action.payload.company,
          error: '',
        },
      };
    case FETCH_CRYPTO_ASYNC.error:
      return {
        ...state,
        loading: false,
        [action.payload.type]: null,
      };

    case CLEAR:
    case LOGOUT_USER:
      return INITIAL_STATE;

    default:
      return state;
  }
};
