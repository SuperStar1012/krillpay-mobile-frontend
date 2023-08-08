import { createSelector } from 'reselect';
import { get, reverse, sortBy } from 'lodash';
import { arrayToObject } from 'utility/general';

export const authStateSelector = state => state.auth;
export const rehiveStateSelector = state => state.rehive;

export const authUserSelector = createSelector(authStateSelector, authState => {
  return get(authState, 'user', null);
});

export const dismissedAdminSelector = createSelector(
  authStateSelector,
  authState => {
    return authState.dismissedAdmin;
  },
);

export const authTempCompanySelector = createSelector(
  authStateSelector,
  authState => {
    return get(authState, 'tempCompany', null);
  },
);

export const tokenSelector = createSelector(authStateSelector, authState => {
  return authState.token;
});

export const authLogoutSelector = createSelector(
  authStateSelector,
  authState => {
    return authState.logout;
  },
);

export const appLoadedSelector = createSelector(
  authStateSelector,
  authState => {
    return authState.appLoaded ? authState.appLoaded : false;
  },
);

/* Company selectors */
export const recentCompaniesStateSelector = createSelector(
  authStateSelector,
  authState => {
    const companyHistory = get(authState, 'companyHistory', []);
    const recentCompanies = reverse(
      sortBy(companyHistory, [item => item.last_login]),
    );
    return recentCompanies;
  },
);

export const currentCompanyIDStateSelector = createSelector(
  authStateSelector,
  authState => {
    return get(authState, 'companyID', '');
  },
);

export const tempCompanyIDStateSelector = createSelector(
  authStateSelector,
  authState => {
    return get(authState, 'tempCompanyID', '');
  },
);

export const companiesSelector = createSelector(
  [
    recentCompaniesStateSelector,
    currentCompanyIDStateSelector,
    authTempCompanySelector,
    tempCompanyIDStateSelector,
  ],
  (
    recentCompaniesState,
    currentCompanyIDState,
    tempCompany,
    tempCompanyIDState,
  ) => {
    const currentCompany = recentCompaniesState.find(
      company => company.id === currentCompanyIDState,
    );

    const recent = arrayToObject(recentCompaniesState, 'id');

    if (!tempCompany && tempCompanyIDState) {
      tempCompany = recent[tempCompanyIDState]
        ? recent[tempCompanyIDState]
        : null;
    }

    return {
      recentCompanies: recentCompaniesState,
      recent,
      currentCompany,
      currentCompanyID: currentCompanyIDState,
      tempCompany,
      tempCompanyID: tempCompanyIDState,
    };
  },
);

export const currentCompanySelector = createSelector(
  [companiesSelector],
  companies => {
    const { tempCompany, currentCompany } = companies;
    if (tempCompany) {
      return tempCompany;
    }
    if (currentCompany) {
      return currentCompany;
    }
    return { services: [], config: {} };
  },
);

export const currentCompanyServicesSelector = createSelector(
  [currentCompanySelector],
  company => {
    let services = {};
    company.services.map(service => {
      services[service.name] = true;
      return { [service.name]: true };
    });
    return services;
  },
);

export const currentSessionsStateSelector = createSelector(
  authStateSelector,
  authState => {
    return get(authState, 'currentSessions', null);
  },
);

export const currentSessionsUserIdStateSelector = createSelector(
  authStateSelector,
  authState => {
    return get(authState, 'userID', null);
  },
);

export const currentSessionsSelector = createSelector(
  [
    currentSessionsStateSelector,
    currentSessionsUserIdStateSelector,
    companiesSelector,
  ],
  (currentSessionsState, currentSessionsUserIdState, companies) => {
    const companyID = companies.tempCompanyID
      ? companies.tempCompanyID
      : companies.currentCompanyID;

    const currentSession = get(
      currentSessionsState,
      [companyID, currentSessionsUserIdState],
      { token: '', user: null },
    );
    const { token, user } = currentSession;

    return {
      items: currentSessionsState,
      userID: currentSessionsUserIdState,
      companyID,
      token,
      user,
    };
  },
);

export const authEmailSelector = createSelector(
  authStateSelector,
  authState => {
    return get(authState, 'email', '');
  },
);

/* local auth */
export const localAuthSelector = createSelector(
  [authStateSelector],
  authState => {
    const { pin, biometrics } = authState;
    return {
      pin: pin ? pin : false,
      biometrics: biometrics ? biometrics : false,
    };
  },
);
