import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const SET_LOCAL_PIN = 'set_local_pin';
const ACTIVATE_BIOMETRICS = 'activate_biometrics';
const RESET_LOCAL_AUTH = 'reset_local_auth';

export const INITIAL_LOCAL_AUTH_STATE = {
  pin: '',
  biometrics: false,
};

function localAuthReducer(state = INITIAL_LOCAL_AUTH_STATE, action) {
  const { type, payload } = action;
  switch (type) {
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

    default:
      return state;
  }
}

const LocalAuthContext = createContext();
function LocalAuthProvider({ children, initial }) {
  const [localAuth, dispatch] = useReducer(localAuthReducer, initial);

  const { pin, biometrics } = localAuth;

  useEffect(() => {
    const value = JSON.stringify(localAuth);
    SecureStore.setItemAsync('localAuth', value);
  }, [localAuth]);

  function setLocalPin(value) {
    dispatch({
      type: SET_LOCAL_PIN,
      payload: value,
    });
  }
  function activateBiometrics() {
    dispatch({
      type: ACTIVATE_BIOMETRICS,
    });
  }

  function setLocalAuth(type, value) {
    if (type === 'pin') {
      setLocalPin(value);
    } else {
      activateBiometrics();
    }
  }

  function reset() {
    dispatch({
      type: RESET_LOCAL_AUTH,
    });
  }

  function validatePin(value) {
    if (value === pin) {
      return true;
    }
    return false;
  }

  return (
    <LocalAuthContext.Provider
      value={{
        localAuth,
        setLocalPin,
        activateBiometrics,
        setLocalAuth,
        reset,
        validatePin,
      }}>
      {children}
    </LocalAuthContext.Provider>
  );
}
function useLocalAuth() {
  const context = useContext(LocalAuthContext);
  if (context === undefined) {
    throw new Error('useLocalAuth must be used within a LocalAuthProvider');
  }
  return context;
}

export { LocalAuthProvider, useLocalAuth };
