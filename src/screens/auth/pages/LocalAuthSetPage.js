import React, { useEffect } from 'react';
import { LocalAuthenticationSet, View } from 'components';
import PostAuthLayout from '../components/PostAuthLayout';
import { useLocalAuth } from 'contexts/LocalAuthContext';

export default function LocalAuthSetPage(props) {
  const { authConfig, onSuccess, onBack, setLoading } = props;

  useEffect(() => {
    if (!authConfig.localAuth) {
      onSuccess();
    } else {
      setLoading(false);
    }
  }, []);

  const { setLocalAuth } = useLocalAuth();

  const skip = Boolean(authConfig.localAuth === 'optional');

  function handleSuccess(type, value) {
    setLocalAuth(type, value);
    onSuccess();
  }

  return (
    <PostAuthLayout mv={2} onBack={onBack} skip={skip} onSuccess={onSuccess}>
      <View ph={2} f={1} keyboardAvoiding scrollView>
        <LocalAuthenticationSet
          skip={skip}
          nextAuthFormState={onSuccess}
          handleLocalAuthSet={handleSuccess}
          onDismiss={onBack}
        />
      </View>
    </PostAuthLayout>
  );
}
