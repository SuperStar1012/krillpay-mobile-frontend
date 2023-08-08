import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  currentCompanySelector,
  appLoadedSelector,
  authUserSelector,
  currentSessionsSelector,
} from 'screens/auth/redux/selectors';
import { useSelector, useDispatch } from 'react-redux';
import defaults from 'config/default';
import { userProfileSelector } from '@redux/rehive/reducer';
import { userTierSelector, userTiersSelector } from '@redux/rehive/selectors';
import { fetchData } from '@redux/actions';

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
    services[service.name] = true;
    return { [service.name]: true };
  });
  return services;
}

function RehiveProvider({ children, initial = {} }) {
  const dispatch = useDispatch();
  const company = useSelector(currentCompanySelector);
  const user = useSelector(userProfileSelector);
  const init = useSelector(appLoadedSelector);
  const services = useMemo(() => mapServices(company), [company]);
  const config = useMemo(() => mapConfig(company), [company]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  // const { showToast } = useToast();

  // const [init, setInit] = useState(false);
  // const [initialAuthScreen, setInitialAuthScreen] = useState(false);
  // const { context: tiers, refresh: refreshRehive } = useRehive(
  //   'tiers',
  //   Boolean(init && user),
  //   {
  //     user,
  //   },
  // );
  const tier = useSelector(userTierSelector);
  const tiers = useSelector(userTiersSelector);
  // const currentTier = tiers?.items?.find(item => item?.active);
  // const tier = { ...tiers, items: currentTier ? [currentTier] : [] };

  // const localAuth = useLocalAuth();

  const context = {
    drawerOpen,
    company,
    tier,
    init,
    tiers,
    // companyID,
    // companies: {
    //   recent: companies,
    //   history: companyHistory,
    //   companyID,
    //   company,
    // },
    // token,
    user: user?.data?.[0],
    services,
  };

  // const memoizedValue = useMemo(newContext, memo.map(mem=>context?.[mem]));

  const refresh = {
    // refreshRehive,
    // refreshAccounts: accounts?.refresh,
    // refreshCrypto: accounts?.refresh('crypto'),
    refreshUser: () => dispatch(fetchData('profile')),
    refreshTier: () => {
      dispatch(fetchData('tiers'));
    },
    // refreshRates: () => accounts?.refresh('rates'),
  };
  const methods = {
    // updateUser: handleUserUpdate,
    // setInit,
    // clearData,
    // switchAuthSession: handleAuthSessionChange,
    // dispatch,
    // send,
    // logoutUser,
    // logoutAll: handleLogoutAll,
    // setTempEmail,
    // setLoading,
    setDrawerOpen,
    ...refresh,
  };

  return (
    <RehiveContext.Provider
      value={{
        ...context,
        context,
        config,
        methods,
        // loading,
        // current,
        // store,
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
    return null;
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
