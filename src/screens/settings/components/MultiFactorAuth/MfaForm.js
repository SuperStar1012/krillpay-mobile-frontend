import React, { useState, useEffect } from 'react';
import {
  enableAuthToken,
  getMFA,
  disableAuthSMS,
  disableAuthToken,
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
  const [token, setToken] = useState('');
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
  const { data: mfa, error: mfaError } = useQuery(
    ['mfa', tempAuth?.token],
    getMFA,
    {
      enabled: !!authConfig?.mfa || settingsMFA,
    },
  );

  const { setMfaStepCompleted } = useMfaSuccess({
    tempAuth,
    setTempAuth,
    onSuccess,
  });

  useEffect(() => {
    if (!authConfig?.mfa) setMfaStepCompleted(true);
  }, []);

  useEffect(() => {
    if (mfa) {
      setFormState(mfa.token || mfa.sms ? 'enabled' : 'landing');
    }
  }, [mfa]);

  useEffect(() => {
    if (mfaError) {
      setModalVisible(true);
      setError(mfaError?.message);
    }
  }, [mfaError]);

  const getToken = async () => {
    setLoading(true);
    try {
      const token = await enableAuthToken();
      setToken(token);
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
    setLoading(false);
  };

  const handleButton = type => {
    setFormState(type);
    if (type !== 'sms') {
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

  const disableMFA = () => {
    setModalLoading(true);
    try {
      if (mfa.token) {
        disableAuthToken();
      } else if (mfa.sms) {
        disableAuthSMS();
      }
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
    const type =
      formState === 'enabled' ? (mfa.sms ? 'sms' : 'token') : formState;
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
            onSuccess={onSuccessMFA}
            issuer={tempAuth?.company}
            account={tempAuth?.email}
            secret={token ? token?.key : ''}
            error={modalError}
            type={type}
            mobile={mobile}
          />
        )}
      </PopUpGeneral>
    );
  };

  const renderContent = () => {
    const onBack = () => handleButton('landing');
    const onSms = () => handleButton('sms');
    const onToken = () => handleButton('token');

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
              token,
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
      {!!modalVisible && renderModal()}
    </View>
  );
}

export default MfaForm;
