// Action called after successful login TODO: remove for on auth success
export const APP_LOAD = 'app_load';
export const APP_LOAD_SUCCESS = 'app_load_success';
export const appLoad = login => {
  return {
    type: APP_LOAD,
    payload: login,
  };
};

// After successful auth set current company and cache the company in history
export const SET_COMPANY = 'set_company';
export const CACHE_COMPANY = 'cache_company';
export const setCompany = company => {
  return {
    type: SET_COMPANY,
    payload: company,
  };
};

// Set temp company
export const SET_TEMP_COMPANY = 'set_temp_company';
export const setTempCompany = company => {
  return {
    type: SET_TEMP_COMPANY,
    payload: company,
  };
};

export const AUTH_SUCCESS = 'auth_success';
export const onAuthSuccess = (data, company) => {
  return {
    type: AUTH_SUCCESS,
    payload: { data, company },
  };
};

export const RESET_AUTH = 'reset_auth';
export const resetAuth = () => {
  return {
    type: RESET_AUTH,
  };
};

export const LOGOUT_USER = 'logout';
export const logoutUser = (companyID, userID) => {
  return {
    type: LOGOUT_USER,
    payload: { companyID, userID },
  };
};

export const REMOVE_AUTH_SESSION = 'remove_auth_session';
export const removeAuthSession = (companyID, userID) => {
  return {
    type: REMOVE_AUTH_SESSION,
    payload: { companyID, userID },
  };
};

export const REMOVE_ALL_AUTH_SESSIONS = 'remove_all_auth_sessions';
export const removeAllAuthSessions = () => {
  return {
    type: REMOVE_ALL_AUTH_SESSIONS,
  };
};

export const SWITCH_AUTH_SESSION = 'switch_auth_session';
export const switchAuthSession = (company, userID) => {
  return {
    type: SWITCH_AUTH_SESSION,
    payload: { company, userID },
  };
};

export const SET_LOCAL_PIN = 'set_local_pin';
export const setLocalPin = value => {
  return {
    type: SET_LOCAL_PIN,
    payload: value,
  };
};

export const ACTIVATE_BIOMETRICS = 'activate_biometrics';
export const activateBiometrics = () => {
  return {
    type: ACTIVATE_BIOMETRICS,
  };
};

export const RESET_LOCAL_AUTH = 'reset_local_auth';
export const resetLocalAuth = () => {
  return {
    type: RESET_LOCAL_AUTH,
  };
};

export const DISMISS_ADMIN = 'dismiss_admin';
export const dismissAdmin = () => {
  return {
    type: DISMISS_ADMIN,
  };
};
