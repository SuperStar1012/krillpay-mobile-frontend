import {
  FETCH_DATA_ASYNC,
  CARD_DISMISS,
  CARD_RESTORE_ALL,
  LOGOUT_USER,
  SET_TEMP_COMPANY,
  UPDATE_USER,
} from '@redux/actions';

import { PERSIST_REHYDRATE } from 'redux-persist/es/constants';
import { referralCodeSelector, userSelector } from '@redux/selectors';
import { createSelector } from 'reselect';
import { createDefaultAsyncStore } from 'utility/redux';
import _ from 'lodash';
import { EMPTY_PROFILE } from 'config/empty_objects';

const dataTypes = [
  'profile',
  'tiers',
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
  'tier',
];

const INITIAL_STATE = Object.assign(
  {},
  ..._.map(dataTypes, type => createDefaultAsyncStore(type)),
);

export default (state = INITIAL_STATE, action) => {
  // console.log(action);
  switch (action.type) {
    case PERSIST_REHYDRATE:
      return action.payload.auth || INITIAL_STATE;
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

    case CARD_DISMISS:
      return {
        ...state,
        dismissedCards: state.dismissedCards
          ? [...state.dismissedCards, action.payload]
          : [action.payload],
      };
    case CARD_RESTORE_ALL:
      return {
        ...state,
        dismissedCards: [],
      };

    case UPDATE_USER:
      if (!action.payload) return state;
      return {
        ...state,
        profile: [action.payload],
      };

    case LOGOUT_USER:
    case SET_TEMP_COMPANY:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export const userAddressesSelector = createSelector(userSelector, user => {
  return {
    data: user.address ? user.address : [],
    loading: user.addressLoading ? user.addressLoading : false,
    error: user.addressError ? user.addressError : false,
  };
});

export const userEmailsSelector = createSelector(userSelector, user => {
  return {
    data: user.email ? user.email : [],
    loading: user.emailLoading ? user.emailLoading : false,
    error: user.emailError ? user.emailError : false,
  };
});

export const userMobilesSelector = createSelector(userSelector, user => {
  return {
    data: user?.mobile ? user?.mobile : [],
    loading: user.mobileLoading ? user.mobileLoading : false,
    error: user.mobileError ? user.mobileError : false,
  };
});

export const userBankAccountsSelector = createSelector(userSelector, user => {
  return {
    data: user.bank_account ? user.bank_account : [],
    loading: user.bank_accountLoading ? user.bank_accountLoading : false,
    error: user.bank_accountError ? user.bank_accountError : false,
  };
});

export const userCryptoAccountsSelector = createSelector(userSelector, user => {
  return {
    data: user.crypto_account ? user.crypto_account : [],
    loading: user.crypto_accountLoading ? user.crypto_accountLoading : false,
    error: user.crypto_accountError ? user.crypto_accountError : false,
  };
});

export const userProfileSelector = createSelector(userSelector, user => {
  return {
    data: user.profile ? user.profile : [],
    loading: user.profileLoading ? user.profileLoading : false,
    error: user.profileError ? user.profileError : false,
  };
});

export const userReferralCodeSelector = createSelector(userSelector, user => {
  return {
    data: user?.referralCodes ?? [],
    loading: user?.referralCodesLoading ?? false,
    error: user?.referralCodesError ?? false,
  };
});

export const userDocumentsSelector = createSelector(userSelector, user => {
  return {
    data: user.document ? user.document : [],
    loading: user.documentLoading ? user.documentLoading : false,
    error: user.documentError ? user.documentError : false,
  };
});

export const profileSelector = createSelector([userSelector], user => {
  return user && user.profile && user.profile.length > 0
    ? user.profile[0]
    : { ...EMPTY_PROFILE, profile: '' };
});

export const companyBankAccountsSelector = createSelector(
  userSelector,
  user => {
    return {
      items: user.companyBankAccounts ? user.companyBankAccounts : [],
      loading: user.companyBankAccountsLoading
        ? user.companyBankAccountsLoading
        : false,
      error: user.companyBankAccountsError
        ? user.companyBankAccountsError
        : false,
    };
  },
);
