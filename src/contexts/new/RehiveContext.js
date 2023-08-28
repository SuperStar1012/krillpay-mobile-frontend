import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import reducer, { CLEAR_DATA } from 'utility/auth/reducer';

import { useMachine } from '@xstate/react';
import defaults from 'config/default';

import authMachine, {
  LANDING,
  COMPANY,
  LOGIN,
} from 'screens/auth/config/authMachine';
import {
  resetAuth,
  setTempCompany,
  removeAuthSession,
  switchAuthSession,
  updateUser,
  cacheCompany,
  LOGOUT_USER,
  removeAllAuthSessions,
} from 'utility/auth/actions';

import {
  initWithoutToken,
  initWithToken,
  verifyToken,
  getUser,
  getProfile,
  getCompany,
  getPublicCompany,
  logout,
} from 'utility/rehive';

// import client from 'config/client';
import { useRehive } from 'hooks/rehive';
// import { useAccounts } from 'hooks/accounts';
// import { useCrypto } from 'hooks/crypto';
import { useLocalAuth } from '../LocalAuthContext';
import { useToast } from 'contexts/ToastContext';
import { useQueryClient } from 'react-query';

export const SET_COMPANY = 'set_company';
export const CACHE_COMPANY = 'cache_company';
export const SET_TEMP_COMPANY = 'set_temp_company';
export const STORE_TEMP_COMPANY = 'set_temp_company';

/*

Test cases
- Start up i

*/

export const INITIAL_AUTH_STATE = {
  users: null,

  user: null,
  token: '',

  companyID: '',
  tempCompanyID: '',
  tempCompany: null,

  items: {},

  companyHistory: [],
};

const RehiveContext = createContext();
const RehiveMethods = createContext();

function mapConfig(company) {
  let config = {};

  Object.keys(defaults).map(key => {
    let item = defaults[key];
    config[key + 'Config'] = mergeConfig(company, key, item);
  });
  return config;
}
function mapServices(company) {
  let services = {};
  company?.services?.map(service => {
    services[service.slug] = true;
    return { [service.slug]: true };
  });
  return services;
}

function RehiveProvider({ children, initial = {} }) {
  const [store, dispatch] = useReducer(reducer, initial);

  const [current, send] = useMachine(authMachine);

  const [loading, setLoading] = useState(true);
  const [tempEmail, setTempEmail] = useState('');

  const {
    companies = {},
    tempCompany,
    currentSessions,
    companyID,
    userID,
    tempCompanyID,
    companyHistory,
  } = store;

  const company = tempCompany ?? companies?.[companyID] ?? {};
  const currentSession = currentSessions?.[companyID]?.[userID] ?? {};
  const { token, user } = currentSession;
  const services = useMemo(() => mapServices(company), [company]);
  const config = useMemo(() => mapConfig(company), [company]);

  async function refreshCompany() {
    try {
      const resp = await getPublicCompany(companyID);
      dispatch(cacheCompany(resp?.data));
    } catch (e) {
      //
    }
  }

  const { showToast } = useToast();

  const [init, setInit] = useState(false);
  const [initialAuthScreen, setInitialAuthScreen] = useState(false);
  const {
    context: { tier, tiers, businessServiceSettings },
    refresh: refreshRehive,
    // clear,
  } = useRehive(
    ['tier', 'tiers', 'businessServiceSettings'],
    Boolean(init && user),
    {
      user,
    },
  );

  const localAuth = useLocalAuth();

  const queryClient = useQueryClient();

  function handleInvalidToken(
    tempCompanyID = companyID,
    tempUserID = userID,
    navigation,
  ) {
    setInit(false);
    const session = currentSessions?.[tempCompanyID]?.[tempUserID];
    setTempEmail(session?.user?.email ?? user?.email);
    if (session) {
      send(LOGIN);
      showToast({
        variant: 'error',
        id: 'session_invalid_error',
        duration: 3500,
      });
      setInitialAuthScreen('Auth');
    } else {
      handleCompany();
    }
    setLoading(false);
    // dispatch({//TODO:!?
    //   type: LOGOUT_USER,
    //   payload: { companyID: tempCompanyID, userID: tempUserID },
    // });
    initWithoutToken();
    if (navigation) navigation.navigate('Public', { screen: 'Auth' });
  }

  function clearData() {
    dispatch({
      type: CLEAR_DATA,
      payload: {
        email: user?.email,
        company,
      },
    });
  }

  async function refreshUser({ data } = {}) {
    let user = data;
    try {
      if (!data) user = await getProfile();
      dispatch(updateUser(user));
    } catch (e) {
      // error
    }
  }

  useEffect(() => {
    if (init) {
      refreshRehive();
    } else {
      queryClient.clear();
    }
  }, [init]);

  function handleCompany() {
    if (company?.id) {
      send(LANDING);
    } else {
      send(COMPANY);
    }
    setInitialAuthScreen('Auth');
  }

  async function handleVerifyToken(token) {
    setLoading(true);
    try {
      // if (companyID) {
      //   const temp = companies?.[companyID];
      //   dispatch(setTempCompany(temp));
      // } else {
      //   dispatch(setTempCompany(company));
      // }
      const resp = await verifyToken(token);
      if (resp?.status === 'success') {
        await initWithToken(token);
        refreshCompany();
        setInitialAuthScreen('LocalAuth');
        setInit(true);
      } else {
        handleInvalidToken(companyID, userID);
      }
    } catch (e) {
      console.log('handleVerifyToken -> e', e);
      handleInvalidToken(companyID, userID);
    }
    setLoading(false);
  }

  async function initApp() {
    initWithoutToken();
    dispatch(resetAuth());
    if (token) {
      handleVerifyToken(token);
    } else {
      handleInvalidToken();
    }
  }

  useEffect(() => {
    initApp();
  }, []);

  useEffect(() => {
    const value = JSON.stringify(store);
    AsyncStorage.setItem('auth', value);
  }, [store]);

  async function handleLogoutAll(navigation) {
    try {
      logout();
    } catch (error) {}
    send(LANDING);
    dispatch(removeAllAuthSessions());
    if (navigation)
      navigation.navigate('Public', {
        screen: 'Auth',
      });
    return true;
  }

  async function handleAuthSessionChange(params, navigation, isAuth) {
    clearData();
    setInit(false);
    const companyId = params?.companyID;
    const userId = params?.user?.id;
    const newSomething = params?.newSession || params?.newApp;
    if (params?.newApp) {
      send(COMPANY);
    } else {
      send(LANDING);
    }
    if (!isAuth && navigation) {
      navigation.navigate('Public', {
        params,
        screen: 'Auth',
      });
    }
    await initWithoutToken();

    if (!newSomething) {
      dispatch(setTempCompany(companies?.[companyId]));
      if (navigation)
        navigation.navigate('Public', {
          params,
          screen: 'Splash',
        });
      const tempToken = currentSessions?.[companyId]?.[userId]?.token ?? '';
      if (tempToken) {
        try {
          const resp = await getUser(tempToken);
          if (resp?.status === 'success') {
            initWithoutToken();
            await initWithToken(tempToken);
            dispatch(switchAuthSession(companyId, userId, resp?.data));
            setInit(true);
            if (navigation) navigation.replace('Private');
            return false;
          } else {
            send(LOGIN);
            handleInvalidToken(companyId, userId, navigation);
          }
        } catch (e) {
          send(LOGIN);
          handleInvalidToken(companyId, userId, navigation);
        }
      }
    }
  }

  const appLoading =
    !user ||
    // accounts?.context?.loading ||
    businessServiceSettings?.isLoading ||
    tier?.isLoading;

  const context = {
    email: tempEmail,
    // accounts: accounts?.context,
    // ...accounts?.context,
    company,
    tier,
    tiers,
    companyID,
    companies: {
      recent: companies,
      history: companyHistory,
      companyID,
      company,
    },
    businessServiceSettings,
    token,
    user,
    services,
    currentSessions,
    localAuth,
    init,
    appLoading,
    appLoaded: !appLoading,
    initialAuthScreen,
  };

  function handleUserUpdate(user) {
    dispatch(updateUser(user));
  }

  async function logoutUser() {
    send(LANDING);
    try {
      await logout();
    } catch (error) {}
    dispatch({
      type: LOGOUT_USER,
      payload: { companyID, userID },
    });
  }

  const refresh = {
    refreshRehive,
    // refreshAccounts: accounts?.refresh,
    // refreshCrypto: accounts?.refresh('crypto'),
    refreshUser,
    // refreshRates: () => accounts?.refresh('rates'),
  };
  const methods = {
    updateUser: handleUserUpdate,
    setInit,
    clearData,
    switchAuthSession: handleAuthSessionChange,
    dispatch,
    send,
    logoutUser,
    logoutAll: handleLogoutAll,
    setTempEmail,
    setLoading,
    refresh,
    ...refresh,
  };

  return (
    <RehiveContext.Provider
      value={{
        context,
        config,
        loading,
        current,
        store,
      }}>
      <RehiveMethods.Provider value={methods}>
        {children}
      </RehiveMethods.Provider>
    </RehiveContext.Provider>
  );
}

function useRehiveContext() {
  const context = useContext(RehiveContext);
  if (context === undefined) {
    throw new Error(
      'useRehiveContext must be used within a RehiveContextProvider',
    );
  }
  return context;
}
function useRehiveMethods() {
  const context = useContext(RehiveMethods);
  if (context === undefined) {
    throw new Error(
      'useRehiveMethod must be used within a RehiveMethodProvider',
    );
  }
  return context;
}

function mergeConfig(company, key, def = {}) {
  let temp = company?.config?.[key] ?? def;
  return { ...def, ...temp };
}

export { useRehiveContext, useRehiveMethods, RehiveProvider };
