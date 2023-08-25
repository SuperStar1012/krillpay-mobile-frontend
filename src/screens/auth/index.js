import React, { useState, useEffect } from 'react';
import { UIManager } from 'react-native';
import { useMachine } from '@xstate/react';
import { useSelector, useDispatch } from 'react-redux';
import { get } from 'lodash';

import {
  initWithoutToken,
  initWithToken,
  verifyToken,
  getPublicCompany,
  getCompanyAppConfig,
} from 'utility/rehive';

import {
  companiesSelector,
  currentSessionsSelector,
  authLogoutSelector,
} from './redux/selectors';


import { Spinner, View } from 'components';
import CompanyPage from './pages/CompanyPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EmailVerifyPage from './pages/EmailVerifyPage';
import MobileVerifyPage from './pages/MobileVerifyPage';
import LocalAuthVerifyPage from './pages/LocalAuthVerifyPage';
import LocalAuthSetPage from './pages/LocalAuthSetPage';
import MfaVerifyPage from './pages/MfaVerifyPage';
import locales from './config/locales';

import authMachine, {
  LANDING,
  LOGIN,
  REGISTER,
  FORGOT,
  COMPANY,
  AUTH_INIT,
  LOCAL_AUTH_SET,
  LOCAL_AUTH_VERIFY,
  EMAIL_VERIFY,
  MFA_SET,
  MFA_VERIFY,
  BACK,
  ABOUT,
  SUCCESS,
  MOBILE_VERIFY,
  DISCLAIMER,
  AUTH_SUCCESS,
  PRE_AUTH_SLIDES,
  POST_AUTH_SLIDES,
  GROUP,
} from './config/authMachine';

import ModalBasic from '../../components/modals/ModalBasic';
import AboutPage from './pages/AboutPage';
import DisclaimerPage from './pages/DisclaimerPage';
import AuthSuccess from './pages/AuthSuccessPage';
import { resetAuth, setTempCompany, removeAuthSession } from './redux/actions';
import PreAuthSlidesPage from './pages/PreAuthSlidesPage';
import PostAuthSlidesPage from './pages/PostAuthSlidesPage';
import GroupPage from './pages/GroupPage';
import CurrentSessionsDrawer from '../../components/auth/CurrentSessionsDrawer';
import CompanyStatusBanner from 'components/auth/CompanyStatusBanner';
import Disclaimer from './components/Disclaimer';
import { useToast } from 'contexts/ToastContext';
import { LanguageProvider } from 'contexts/LanguageContext';
import MfaSetPage from './pages/MfaSetPage';
import { useRehiveContext } from 'contexts/RehiveContext';
import { useCompany } from 'contexts/CompanyContext';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default function AuthScreen(props) {
  // return null;
  const { navigation, route } = props;
  const companies = useSelector(companiesSelector);
  const { currentCompanyID, tempCompanyID, tempCompany, recent } = companies;

  const params = route?.params ?? {
    newAuth: false,
    switching: false,
    token: '',
    user: '',
    companyID: '',
  };
  const { company: client } = useCompany();
  let { user, switching, newSession, newApp, token, companyID } = params;
  if (!companyID) {
    companyID = client.company ? client.company : currentCompanyID;
  }
  const [current, send] = useMachine(authMachine);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const {
    config: { authConfig },
  } = useRehiveContext();
  const logout = useSelector(authLogoutSelector);
  const { items: currentSessions, userID } = useSelector(
    currentSessionsSelector,
  );
  let company = null;
  const dispatch = useDispatch();
  const { showToast } = useToast();

  if (tempCompanyID && tempCompany) {
    companyID = client.company
      ? client.company
      : get(companies, 'tempCompanyID');
    company = tempCompany;
  }
  if (companyID && !company) {
    company = recent[companyID] ? recent[companyID] : tempCompany;
  }
  if (tempCompanyID && !company) {
    company = recent[tempCompanyID] ? recent[tempCompanyID] : tempCompany;
  }

  if (!token) {
    const currentSession = get(currentSessions, [companyID, userID], {
      token: '',
      user: null,
    });
    ({ token, user } = currentSession);
  }
  useEffect(() => {
    if (logout) {
      showToast({
        text: 'Session no longer valid. Please log in again.',
        duration: 3500,
        variant: 'warning',
      });
      initWithoutToken();
      dispatch(resetAuth());
      handleCompany();
    }
  }, [logout]);

  const [tempAuth, setTempAuth] = useState({ user, token });

  useEffect(() => {
    if (get(company, 'id') !== get(tempCompany, 'id')) {
      dispatch(setTempCompany(company));
    }
  }, []);

  async function verifyCompany(company) {
    if (!company) {
    } else {
      company = company.toLowerCase();
      try {
        const response = await getPublicCompany(company);
        const config = await getCompanyAppConfig(company, false);
        if (response.status === 'success' && config?.status === 'success') {
          dispatch(
            setTempCompany({
              ...(response?.data ?? {}),
              ...(config?.data ?? {}),
            }),
          );
        } else {
        }
      } catch (error) {
        console.log('TCL: verifyCompany -> error', error);
      }
    }
  }

  function verifyTokenFail(tempCompanyID, tempUserID) {
    if (switching || (tempCompanyID && tempUserID)) {
      showToast({
        text: 'Session no longer valid. Please log in again.',
        duration: 3500,
        variant: 'warning',
      });
      if (tempCompanyID) {
        dispatch(removeAuthSession(tempCompanyID, tempUserID));
      } else {
        dispatch(removeAuthSession(companyID, userID));
      }
    }
    initWithoutToken();
    handleCompany();
  }

  function handleCompany() {
    if (companyID && get(company, 'id', '') === companyID) {
      send(LANDING);
    } else {
      send(COMPANY);
    }
  }

  async function handleVerifyToken(token, companyID, userID) {
    setLoading(true);
    try {
      if (companyID) {
        const temp = get(companies, ['recent', companyID]);
        dispatch(setTempCompany(temp));
      } else {
        dispatch(setTempCompany(company));
      }
      await verifyToken(token);
      await initWithToken(token);
      send(LOCAL_AUTH_VERIFY);
    } catch (e) {
      console.log('handleVerifyToken -> e', e);
      verifyTokenFail(companyID, userID);
    }
    setLoading(false);
  }

  async function initApp() {
    initWithoutToken();
    dispatch(resetAuth());
    if (token) {
      handleVerifyToken(token, companyID, userID);
    } else {
      verifyTokenFail();
    }
  }

  useEffect(() => {
    if (tempCompanyID) verifyCompany(tempCompanyID);
    if (newSession) {
      send(LANDING);
      setLoading(false);
    } else if (newApp) {
      send(COMPANY);
      setLoading(false);
    } else {
      initApp();
    }
  }, []);

  function onSuccess() {
    setLoading(true);
    send(SUCCESS);
    setEmail('');
  }

  function onBack() {
    send(BACK);
  }

  function onAbout() {
    send(ABOUT);
  }
  const [drawerOpen, setDrawerOpen] = useState(false);

  function onGroup() {
    setLoading(true);
    send(GROUP);
  }

  const pageProps = {
    authConfig,
    newAuth: newSession || newApp,
    companies,
    current,
    send,
    setTempAuth,
    tempAuth,
    onSuccess,
    onBack,
    onAbout,
    initialUser: get(tempAuth, 'user'),
    company,
    loading,
    drawerOpen,
    setDrawerOpen,
    currentSessions,
    setLoading,
    onGroup,
    showToast,
    email,
    ...props,
  };

  return (
    <LanguageProvider
      localLocales={locales}
      configLocales={authConfig?.locales ?? {}}>
      <View screen bC={'authScreen'}>
        <CompanyStatusBanner company={company} />
        {current.matches(AUTH_INIT) ? (
          <Spinner
            type="auth"
            size="large"
            color="authScreenContrast"
            backgroundColor="authScreen"
          />
        ) : current.matches(COMPANY) || current.matches(LANDING) ? (
          <CurrentSessionsDrawer
            navigation={navigation}
            isLanding={current.matches(LANDING)}
            isCompany={current.matches(COMPANY)}
            handleVerifyToken={handleVerifyToken}
            drawerOpen={drawerOpen}
            hideDrawer={() => setDrawerOpen(false)}
            onBack={onBack}>
            {current.matches(LANDING) ? (
              <LandingPage
                {...pageProps}
                onLogin={() => send(LOGIN)}
                onGroup={onGroup}
                onRegister={() => send(REGISTER)}
              />
            ) : (
              <CompanyPage {...pageProps} navigation={navigation} />
            )}
          </CurrentSessionsDrawer>
        ) : current.matches(LOGIN) ? (
          <LoginPage
            {...pageProps}
            onForgot={email => {
              setEmail(email);
              send(FORGOT);
            }}
            onGroup={email => {
              setEmail(email);
              onGroup();
            }}
            onRegister={email => {
              setEmail(email);
              send(REGISTER);
            }}
          />
        ) : current.matches(GROUP) ? (
          <GroupPage {...pageProps} onSuccess={() => send(SUCCESS)} />
        ) : current.matches(REGISTER) ? (
          <RegisterPage
            {...pageProps}
            onLogin={email => {
              setEmail(email);
              send(LOGIN);
            }}
          />
        ) : current.matches(FORGOT) ? (
          <ForgotPasswordPage {...pageProps} />
        ) : current.matches(ABOUT) ? (
          <AboutPage {...pageProps} />
        ) : current.matches(DISCLAIMER) ? (
          <DisclaimerPage {...pageProps} />
        ) : current.matches(PRE_AUTH_SLIDES) ? (
          <PreAuthSlidesPage {...pageProps} onSuccess={() => send(SUCCESS)} />
        ) : current.matches(POST_AUTH_SLIDES) ? (
          <PostAuthSlidesPage {...pageProps} />
        ) : current.matches(LOCAL_AUTH_SET) ? (
          <LocalAuthSetPage {...pageProps} />
        ) : current.matches(LOCAL_AUTH_VERIFY) ? (
          <LocalAuthVerifyPage {...pageProps} />
        ) : current.matches(EMAIL_VERIFY) ? (
          <EmailVerifyPage {...pageProps} />
        ) : current.matches(MOBILE_VERIFY) ? (
          <MobileVerifyPage {...pageProps} />
        ) : current.matches(MFA_SET) ? (
          <MfaSetPage {...pageProps} />
        ) : current.matches(MFA_VERIFY) ? (
          <MfaVerifyPage {...pageProps} authScreen />
        ) : current.matches(AUTH_SUCCESS) ? (
          <AuthSuccess {...pageProps} />
        ) : (
          <View f={1} jC={'center'} aI={'center'}>
            <Spinner
              type="auth"
              size="large"
              color="authScreenContrast"
              backgroundColor="authScreen"
            />
          </View>
        )}
      </View>
      <Disclaimer
        company={company}
        hideOverride={loading || current.matches(AUTH_SUCCESS)}
      />
      <ModalBasic
        visible={loading}
        animationType={'none'}
        backdropOpacity={0}
        presentationStyle={'overFullScreen'}
        transparent={true}>
        <View f={1} jC={'center'} aI={'center'}>
          <Spinner
            type="auth"
            size="large"
            color="authScreenContrast"
            backgroundColor="authScreen"
          />
        </View>
      </ModalBasic>
    </LanguageProvider>
  );
}
