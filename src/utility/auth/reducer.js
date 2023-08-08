import {
  CACHE_COMPANY,
  SET_COMPANY,
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  LOGOUT_USER,
  AUTH_SUCCESS,
  RESET_LOGOUT,
  SET_TEMP_COMPANY,
  RESET_AUTH,
  APP_LOAD_SUCCESS,
  REMOVE_AUTH_SESSION,
  REMOVE_ALL_AUTH_SESSIONS,
  SWITCH_AUTH_SESSION,
  NEW_AUTH,
  USER_UPDATE,
  CLEAR_TEMP,
} from './actions';
import { isEmpty } from 'lodash';

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

export { INITIAL_STATE };

const cacheCompany = (state, payload = {}) => {
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
    companies: {
      ...(state?.companies ?? {}),
      [payload?.id]: data,
    },
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
  const companySessions = state?.currentSessions?.[newCompanyID] ?? {};
  const newUserID = user?.id ?? userID;
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

function handleAuthRemove(state, payload = {}, logout) {
  let { userID, companyID } = payload;
  let { currentSessions, companies } = state;

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
    if (isEmpty(currentSessions?.[companyID])) {
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
    tempCompany: companies?.[companyID],
    tempCompanyID: companyID,
    ...extra,
  };
}

function handleAuthRemoveAll(state) {
  return {
    ...state,
    currentSessions: null,
    tempCompanyID: state.companyID,
    logout: true,
    appLoaded: false,
  };
}

function handleAuthSwitch(state, payload) {
  const { userID, companyID, user } = payload;
  if (user) {
    state = handleUserUpdate(state, payload);
  }
  return {
    ...state,
    tempCompanyID: '',
    tempCompany: null,
    companyID,
    userID,
  };
}

function handleUserUpdate(state, payload) {
  const { companyID, tempCompanyID, currentSessions } = state;
  const { user } = payload;

  const userId = user?.id;
  const companyId =
    payload?.companyID ?? (tempCompanyID ? tempCompanyID : companyID);

  const companySessions = currentSessions?.[companyId];
  const token = companySessions?.[userId]?.token;

  if (!companyID || !userId || !token) return state;

  return {
    ...state,
    currentSessions: {
      ...currentSessions,
      [companyId]: {
        ...companySessions,
        [userId]: {
          user,
          token,
        },
      },
    },
  };
}

export const CLEAR_DATA = 'clear_data';

export default (state = INITIAL_STATE, action = {}) => {
  let { type, payload } = action;

  switch (type) {
    case SET_COMPANY:
      return {
        ...state,
        companyID: payload,
      };

    case CLEAR_DATA:
      state = {
        ...state,
        companyID: '',
        userID: '',
        email: payload?.email,
      };
      payload = payload?.company;

    case SET_TEMP_COMPANY:
      return {
        ...state,
        tempCompany: payload,
        tempCompanyID: payload?.id,
      };

    case CACHE_COMPANY:
      return cacheCompany(state, payload);

    case LOGIN_SUCCESS:
    case AUTH_SUCCESS:
    case REGISTER_SUCCESS:
      return handleAuthSuccess(state, payload);

    case USER_UPDATE:
      return handleUserUpdate(state, payload);

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

    case CLEAR_TEMP:
      return {
        ...state,
        newAuth: true,
        userID: '',
      };

    case APP_LOAD_SUCCESS:
      return {
        ...state,
        appLoaded: true,
        newAuth: false,
      };

    default:
      return state;
  }
};
