import React, { useEffect } from 'react';
import { View, LocalAuthentication, Button } from 'components';
import { useLocalAuth } from 'contexts/LocalAuthContext';

export default function LocalAuthVerifyPage(props) {
  const { onSuccess, onBack, authConfig, setLoading } = props;
  const { localAuth } = useLocalAuth();

  useEffect(() => {
    if (
      !(
        authConfig.localAuth ||
        authConfig.pin ||
        localAuth.pin ||
        localAuth.biometrics
      )
    ) {
      onSuccess();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <View f={1} keyboardAvoiding>
      <View>
        <View fD="row">
          <Button
            type={'text'}
            onPress={onBack}
            id={'logout'}
            buttonStyle={{ marginLeft: 2 }}
          />
        </View>
      </View>
      <View ph={2}>
        <LocalAuthentication
          localAuth={localAuth}
          attempts={3}
          onSuccess={onSuccess}
          onDismiss={onBack}
        />
      </View>
    </View>
  );
}
