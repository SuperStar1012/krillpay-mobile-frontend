import {
  FETCH_DATA_ASYNC,
  LOGOUT_USER,
  SET_TEMP_COMPANY,
} from 'utility/data/actions';

import { createDefaultAsyncStore } from 'utility/redux';
import _ from 'lodash';

const dataTypes = [
  'profile',
  'publicCompanies',
  'address',
  'bank_account',
  'cryptoAccounts',
  'document',
  'email',
  'mobile',
  'account',
  'product',
  'order',
  'conversionRates',
];

const INITIAL_STATE = Object.assign(
  {},
  ..._.map(dataTypes, type => createDefaultAsyncStore(type)),
);
export { INITIAL_STATE };

export default (state = INITIAL_STATE, action) => {
 
  switch (action.type) {
    case FETCH_DATA_ASYNC.pending:
      return {
        ...state,
        [action.payload + 'Loading']: true,
        showDetail: false,
        modalVisible: false,
        modalType: '',
      };
    case FETCH_DATA_ASYNC.success:
      return {
        ...state,
        [action.payload.prop]: action.payload.data,
        [action.payload.prop + 'Loading']: false,
        [action.payload.prop + 'Error']: '',
        updateError: '',
      };
    case FETCH_DATA_ASYNC.error:
      return {
        ...state,
        [action.payload.prop + 'Loading']: false,
        fetchError: action.payload.message,
      };

    // case CARD_DISMISS:
    //   return {
    //     ...state,
    //     dismissedCards: state.dismissedCards
    //       ? [...state.dismissedCards, action.payload]
    //       : [action.payload],
    //   };
    // case CARD_RESTORE_ALL:
    //   return {
    //     ...state,
    //     dismissedCards: [],
    //   };

    case LOGOUT_USER:
    case SET_TEMP_COMPANY:
      return INITIAL_STATE;
    default:
      return state;
  }
};
