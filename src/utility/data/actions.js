import { createAsyncTypes } from 'utility/redux';

export const FETCH_DATA_ASYNC = createAsyncTypes('fetch_data');
export const fetchData = prop => {
  return { type: FETCH_DATA_ASYNC.pending, payload: prop };
};
export const fetchDataSuccess = (prop, data) => {
  return { type: FETCH_DATA_ASYNC.success, payload: { prop, data } };
};
export const fetchDataError = (prop, message) => {
  return { type: FETCH_DATA_ASYNC.error, payload: { prop, message } };
};

export const REFRESH_PROFILE_ASYNC = createAsyncTypes('refresh_profile');
export const refreshGetVerified = () => {
  return { type: REFRESH_PROFILE_ASYNC.pending };
};

export const RESEND_VERIFICATION_ASYNC = createAsyncTypes(
  'resend_verification',
);
export const resendVerification = (type, index) => {
  return {
    type: RESEND_VERIFICATION_ASYNC.pending,
    payload: {
      type,
      index,
    },
  };
};

export const CARD_DISMISS = 'card_dismiss';
export const cardDismiss = card_id => {
  return {
    type: CARD_DISMISS,
    payload: card_id,
  };
};

export const CARD_RESTORE_ALL = 'card_restore_all';
export const cardRestoreAll = () => {
  return {
    type: CARD_RESTORE_ALL,
  };
};

export const RESET_LOADING = 'reset_loading';
export const resetLoading = () => {
  return {
    type: RESET_LOADING,
  };
};

export const CLEAR = 'clear';
