import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage  from '@react-native-async-storage/async-storage';

export const SET_COMPANY = 'set_company';
export const CACHE_COMPANY = 'cache_company';
export const SET_TEMP_COMPANY = 'set_temp_company';
export const STORE_TEMP_COMPANY = 'set_temp_company';

export const INITIAL_AUTH_STATE = {
  users: null,

  user: null, // TODO: replace {} with null
  token: '',

  companyID: '',
  tempCompanyID: '',
  tempCompany: null,

  companyHistory: [],
};

function authReducer(state = INITIAL_AUTH_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_COMPANY:
      return {
        ...state,
        companyID: payload,
      };

    case STORE_TEMP_COMPANY:
      return {
        ...state,
        tempCompany: payload,
        tempCompanyID: payload.id,
      };

    case SET_TEMP_COMPANY:
      return {
        ...state,
        tempCompanyID: payload,
      };

    case CACHE_COMPANY:
      return cacheCompany(state, payload);

    // case LOGIN_SUCCESS:
    // case AUTH_SUCCESS:
    // case REGISTER_SUCCESS:
    //   return {
    //     ...state,
    //     user: payload.user,
    //     token: payload.token,
    //     tempCompany: null,
    //     tempCompanyID: '',
    //   };

    // case 'set_token':
    //   return {
    //     ...state,
    //     token: payload,
    //   };

    // case LOGOUT_USER:
    //   return {
    //     ...INITIAL_STATE,
    //     email: state.user.email,
    //     logout: true,
    //     appLoaded: false,

    //     companyID: state.companyID,
    //     companyHistory: state.companyHistory,
    //     companyPublic: state.companyPublic,
    //     tempCompany: state.tempCompany,
    //     tempCompanyID: state.tempCompanyID,
    //   };

    // case RESET_LOGOUT:
    //   return {
    //     ...state,
    //     logout: false,
    //   };

    // case RESET_AUTH:
    //   return {
    //     ...state,
    //     appLoaded: false,
    //   };

    // case FETCH_ACCOUNTS_ASYNC.success:
    //   return {
    //     ...state,
    //     appLoaded: true,
    //   };

    default:
      return state;
  }
}

const AuthContext = createContext();
function AuthProvider({ children, initial }) {
  const [store, dispatch] = useReducer(authReducer, initial);

  useEffect(() => {
    const value = JSON.stringify(store);
    AsyncStorage.setItem('auth', value);
  }, [store]);

  function setCompany(id) {
    dispatch({
      type: SET_COMPANY,
      payload: id,
    });
  }
  function setTempCompany(id) {
    dispatch({
      type: SET_TEMP_COMPANY,
      payload: id,
    });
  }
  function storeTempCompany(company) {
    dispatch({
      type: SET_TEMP_COMPANY,
      payload: company,
    });
  }
  function cacheCompany(company) {
    dispatch({
      type: CACHE_COMPANY,
      payload: company,
    });
  }

  return (
    <AuthContext.Provider
      value={{
        store,
        setCompany,
        setTempCompany,
        storeTempCompany,
        cacheCompany,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a CountProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
