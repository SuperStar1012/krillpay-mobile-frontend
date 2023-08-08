import React, { useEffect } from 'react';
import { View } from 'components';
import MfaForm from 'screens/settings/components/MultiFactorAuth/MfaForm';
import PostAuthLayout from 'screens/auth/components/PostAuthLayout';
import PageContent from 'components/layout/PageContent';
import { useMfaSuccess } from 'hooks/useMfaSuccess';

export default function MfaSetPage(props) {
  const {
    onSuccess,
    onBack,
    setLoading,
    loading,
    authConfig,
    tempAuth,
    setTempAuth,
  } = props;

  const { setMfaStepCompleted } = useMfaSuccess({
    tempAuth,
    setTempAuth,
    onSuccess,
  });

  const handleMfaStepComplete = () => setMfaStepCompleted(true);

  useEffect(() => {
    if (authConfig?.mfa === 'required' || authConfig?.mfa === 'optional')
      setLoading(false);
    else handleMfaStepComplete();
  }, []);

  const skip = authConfig?.mfa === 'optional';
  if (loading) {
    return null;
  }

  return (
    <PostAuthLayout
      onBack={onBack}
      skip={skip}
      onSuccess={handleMfaStepComplete}>
      <PageContent>
        <View h="100%">
          <MfaForm
            authScreen
            tempAuth={tempAuth?.user}
            setTempAuth={setTempAuth}
            onSuccess={onSuccess}
            authConfig={authConfig}
          />
        </View>
      </PageContent>
    </PostAuthLayout>
  );
}
