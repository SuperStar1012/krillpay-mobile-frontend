import React, { useState, useEffect } from 'react';
import { MultiFactorAuthentication } from 'components';
import { getMFA } from 'utility/rehive';
import { useMfaSuccess } from 'hooks/useMfaSuccess';

export default function MfaVerifyPage(props) {
  const {
    onSuccess,
    onBack,
    setLoading,
    initialUser,
    loading,
    send,
    authConfig,
    tempAuth,
    setTempAuth,
  } = props;
  const [mfa, setMfa] = useState('');

  const { setMfaStepCompleted } = useMfaSuccess({
    tempAuth,
    setTempAuth,
    onSuccess,
  });

  let mobile = '';
  if (initialUser) {
    ({ mobile } = initialUser);
  }

  useEffect(() => {
    async function handleGetMfa() {
      const mfa = await getMFA();
      if (mfa.token || mfa.sms) {
        setMfa(mfa.token ? 'token' : 'sms');
        setLoading(false);
      } else {
        if (authConfig?.mfa) send('MFA_SET');
        else setMfaStepCompleted(true);
      }
    }
    handleGetMfa();
  }, []);

  if (loading) {
    return null;
  }
  return (
    <MultiFactorAuthentication
      authScreen
      type={mfa}
      mobile={mobile}
      onSuccess={onSuccess}
      setMfaStepCompleted={setMfaStepCompleted}
      logoutUser={onBack}
    />
  );
}
