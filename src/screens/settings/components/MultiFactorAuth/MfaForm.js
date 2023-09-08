import React, { useState, useEffect, useMemo } from 'react';
import {
  getMFAAuthenticators,
  deleteMfaAuthenticator,
  createMFAAuthenticator,
} from 'utility/rehive';

import {
  Spinner,
  View,
  Button,
  Text,
  PopUpGeneral,
  MultiFactorAuthentication,
} from 'components';

import MfaLanding from './MfaLanding';
import MfaToken from './MfaToken';
import MfaSms from './MfaSms';
import { useToast } from 'contexts/ToastContext';
import { useQuery } from 'react-query';
import { useMfaSuccess } from 'hooks/useMfaSuccess';

function MfaForm(props) {
  const { showToast } = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [formState, setFormState] = useState('');
  const [token, setToken] = useState();
  const [sms, setSms] = useState();
  const [error, setError] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const {
    onSuccess,
    tempAuth,
    setTempAuth,
    authScreen,
    authConfig,
    settingsMFA,
  } = props;

  const { data } = useQuery(
    ['mfa', tempAuth?.token],
    () => getMFAAuthenticators(),
    {
      enabled: Boolean(settingsMFA || authConfig?.mfa),
    },
  );
  const authenticators = data?.data;
  const verifiedAuthenticator = useMemo(
    () => authenticators?.results?.find(item => item.verified === true),
    [authenticators],
  );
  const unverifiedAuthenticators = useMemo(
    () =>
      authenticators?.results?.filter(
        item => item.verified === false && item.id !== token?.id,
      ),
    [authenticators],
  );

  useEffect(() => {
    // removing unverified authenticators, otherwise new authenticator can't be created.
    if (unverifiedAuthenticators?.length) {
      unverifiedAuthenticators?.forEach(async item => {
        await deleteMfaAuthenticator(item.id);
      });
    }
  }, [unverifiedAuthenticators]);

  const { setMfaStepCompleted } = useMfaSuccess({
    tempAuth,
    setTempAuth,
    onSuccess,
  });

  useEffect(() => {
    if (!authConfig?.mfa) setMfaStepCompleted(true);
  }, []);

  useEffect(() => {
    // show landing when authenticators available and no verified auth exists
    if (authenticators) {
      setFormState(verifiedAuthenticator ? 'enabled' : 'landing');
    }
  }, [authenticators, verifiedAuthenticator]);

  // useEffect(() => {
  //   if (mfaError) {
  //     setModalVisible(true);
  //     setError(mfaError?.message);
  //   }
  // }, [mfaError]);

  const getToken = async () => {
    if (!token) {
      setLoading(true);
      try {
        const _token = await createMFAAuthenticator('totp');
        setToken(_token);
      } catch (e) {
        console.log(e);
        setError(e.message);
      }
      setLoading(false);
    }
  };

  const handleButton = type => {
    setFormState(type);
    if (type === 'token') {
      getToken();
    }
  };

  const renderEnabled = () => {
    return (
      <View>
        <Text tA={'center'} id="mfa_auth_enabled" />
        <View pv={1.5}>
          <Button
            id="disable"
            color="primary"
            wide
            onPress={() => setModalVisible(true)}
          />
        </View>
      </View>
    );
  };

  const disableMFA = async () => {
    setModalLoading(true);
    try {
      await deleteMfaAuthenticator(verifiedAuthenticator?.id);
      setModalError('');
      setModalVisible(false);
      setFormState('landing');
      setMobile('');
      showToast({
        text: 'Two-factor authentication disabled',
      });
    } catch (e) {
      console.log(e);
      setModalError(e.message);
    }
    setModalLoading(false);
  };

  const onSuccessMFA = () => {
    setMfaStepCompleted(true);
    setModalLoading(false);
    if (settingsMFA) onSuccess();
  };

  const renderModal = () => {
    return (
      <PopUpGeneral
        visible={modalVisible}
        textActionOne={formState === 'enabled' ? 'accept' : ''}
        onPressActionOne={disableMFA}
        textActionTwo={'cancel'}
        onPressActionTwo={() => setModalVisible(false)}
        onDismiss={() => setModalVisible(true)}
        loading={modalLoading}
        title={
          formState === 'enabled' ? 'disable_two_factor_authentication' : ''
        }
        contentText={
          formState === 'enabled'
            ? 'disable_two_factor_authentication_description'
            : ''
        }>
        {formState === 'enabled' ? null : (
          <MultiFactorAuthentication
            authenticator={formState === 'token' ? token : sms}
            onSuccess={onSuccessMFA}
            error={modalError}
            mobile={mobile}
          />
        )}
      </PopUpGeneral>
    );
  };

  const renderContent = () => {
    const onBack = () => handleButton('landing');
    const onToken = () => handleButton('token');
    const onSms = () => handleButton('sms');

    switch (formState) {
      case 'landing':
        return <MfaLanding {...{ onSms, onToken }} authScreen={authScreen} />;
      case 'enabled':
        return renderEnabled();
      case 'token':
        return <MfaToken {...{ token, error, onBack, setModalVisible }} />;
      case 'sms':
        return (
          <MfaSms
            {...{
              sms,
              setSms,
              error,
              onBack,
              setModalVisible,
              profile: tempAuth,
              setMobile,
            }}
          />
        );
      default:
        return <Spinner size="large" />;
    }
  };

  return (
    <View>
      {loading ? <Spinner size={'large'} /> : renderContent()}
      {modalVisible && renderModal()}
    </View>
  );
}

export default MfaForm;
