import React, { useEffect } from 'react';
import { MultiFactorAuthentication } from 'components';
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
  const { challenges } = tempAuth;

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
    if (challenges?.length > 0) {
      setLoading(false);
    } else {
      if (authConfig?.mfa) send('MFA_SET');
      else setMfaStepCompleted(true);
    }
  }, []);

  if (loading) {
    return null;
  }
  return (
    <MultiFactorAuthentication
      authScreen
      challenges={challenges}
      mobile={mobile}
      onSuccess={onSuccess}
      setMfaStepCompleted={setMfaStepCompleted}
      logoutUser={onBack}
    />
  );
}
