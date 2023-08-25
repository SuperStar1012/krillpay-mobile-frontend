import {
  CACHE_COMPANY,
  SET_COMPANY,
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  LOGOUT_USER,
  AUTH_SUCCESS,
  RESET_LOGOUT,
  SET_TEMP_COMPANY,
  ACTIVATE_BIOMETRICS,
  SET_LOCAL_PIN,
  RESET_LOCAL_AUTH,
  RESET_AUTH,
  DISMISS_ADMIN,
  APP_LOAD_SUCCESS,
  REMOVE_AUTH_SESSION,
  REMOVE_ALL_AUTH_SESSIONS,
  SWITCH_AUTH_SESSION,
  NEW_AUTH,
} from './actions';
import { get, isEmpty } from 'lodash';
import { FETCH_DATA_ASYNC, UPDATE_USER } from '@redux/actions';

const INITIAL_STATE = {
  currentSessions: null,
  userID: '',

  logout: false,
  appLoaded: false,
  dismissedAdmin: false,

  companyID: '',
  companyHistory: [],
  tempCompanyID: '',

  tempCompany: null,
};

const cacheCompany = (state, payload) => {
  let companies = state.companyHistory ? [...state.companyHistory] : [];
  var foundIndex = companies.findIndex(company => company.id === payload.id);
  const data = { ...payload, last_login: Date.now() };
  if (foundIndex === -1) {
    companies.push(data);
  } else {
    companies[foundIndex] = data;
  }
  return {
    ...state,
    companyHistory: companies,
    tempCompany: null,
  };
};

function handleAuthSuccess(state, payload) {
  const { currentSessions, userID } = state;
  const { data, company } = payload;
  state = cacheCompany(state, company);
  const { user, token } = data;
  const newCompanyID = company.id;
  const companySessions = get(state, ['currentSessions', newCompanyID], {});
  const newUserID = get(user, 'id', userID);
  return {
    ...state,
    currentSessions: {
      ...currentSessions,
      [newCompanyID]: {
        ...companySessions,
        [newUserID]: {
          user,
          token,
        },
      },
    },
    companyID: newCompanyID,
    userID: newUserID,
    tempCompany: null,
    tempCompanyID: '',
  };
}

function handleUserUpdate(state, payload) {
  const user = payload?.data?.[0] ?? payload?.data ?? payload;
  const { currentSessions, userID, companyID } = state;
  const companySessions = state?.currentSessions?.[companyID] ?? {};
  const newUserID = user?.id ?? userID;
  return {
    ...state,
    currentSessions: {
      ...currentSessions,
      [companyID]: {
        ...companySessions,
        [newUserID]: {
          ...(companySessions?.[newUserID] ?? {}),
          user,
        },
      },
    },
    userID: newUserID,
  };
}

function handleAuthRemove(state, payload = {}, logout) {
  let { userID, companyID } = payload;
  let { currentSessions } = state;

  if (!userID) {
    ({ userID } = state);
  }
  if (!companyID) {
    ({ companyID } = state);
  }
  if (!companyID && state.tempCompanyID) {
    ({ tempCompanyID: companyID } = state);
  }

  try {
    delete currentSessions[companyID][userID];
    if (isEmpty(currentSessions[companyID])) {
      delete currentSessions[companyID];
    }
  } catch (e) {}
  let extra = {};
  if (logout) {
    extra = {
      logout,
      appLoaded: false,
      companyID: '',
      userID: '',
    };
  }
  return {
    ...state,
    currentSessions,
    tempCompanyID: companyID,
    ...extra,
  };
}

function handleAuthRemoveAll(state) {
  return {
    ...state,
    currentSessions: null,
    tempCompanyID: '',
    tempCompany: null,
    companyID: '',
    logout: true,
    appLoaded: false,
  };
}

function handleAuthSwitch(state, payload) {
  const { userID, companyID } = payload;
  return {
    ...state,
    companyID,
    userID,
  };
}

export default (state = INITIAL_STATE, action) => {
  // console.log('🚀 ~ file: reducer.js ~ line 172 ~ action', action);
  const { type, payload } = action;
  switch (type) {
    case SET_COMPANY:
      return {
        ...state,
        companyID: payload,
      };

    case SET_TEMP_COMPANY:
      return {
        ...state,
        tempCompany: payload,
        tempCompanyID: payload.id,
      };

    case CACHE_COMPANY:
      return cacheCompany(state, payload);

    case LOGIN_SUCCESS:
    case AUTH_SUCCESS:
    case REGISTER_SUCCESS:
      return handleAuthSuccess(state, payload);

    case LOGOUT_USER:
      return handleAuthRemove(state, payload, true);

    case REMOVE_AUTH_SESSION:
      return handleAuthRemove(state, payload);
    case REMOVE_ALL_AUTH_SESSIONS:
      return handleAuthRemoveAll(state);
    case SWITCH_AUTH_SESSION:
      return handleAuthSwitch(state, payload);

    case RESET_LOGOUT:
      return {
        ...state,
        logout: false,
      };

    case FETCH_DATA_ASYNC?.success:
      if (action.payload.prop !== 'profile') return state;

    case UPDATE_USER:
      return handleUserUpdate(state, payload);

    case RESET_AUTH:
      return {
        ...state,
        logout: false,
        appLoaded: false,
      };

    case NEW_AUTH:
      return {
        ...state,
        newAuth: true,
      };

    case APP_LOAD_SUCCESS:
      return {
        ...state,
        appLoaded: true,
        newAuth: false,
      };

    case ACTIVATE_BIOMETRICS:
      return {
        ...state,
        biometrics: true,
        pin: '',
      };

    case SET_LOCAL_PIN:
      return {
        ...state,
        biometrics: false,
        pin: payload,
      };

    case RESET_LOCAL_AUTH:
      return {
        ...state,
        pin: '',
        biometrics: false,
      };

    case DISMISS_ADMIN:
      return {
        ...state,
        dismissedAdmin: true,
      };

    default:
      return state;
  }
};
