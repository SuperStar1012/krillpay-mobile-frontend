import React, { useState, useEffect } from 'react';

import * as ExpoLocalAuthentication from 'expo-local-authentication';

import LocalAuthLanding from './LocalAuthLanding';
import { View, LocalAuthentication, Button, Spinner } from 'components';
import { useLocalAuth } from 'contexts/LocalAuthContext';
import { useToast } from 'contexts/ToastContext';

export default function LocalAuthForm(props) {
  const { navigation } = props;
  const [state, setState] = useState('');
  const [tempPin, setTempPin] = useState('');
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [hasFingerprintScanner, setHasFingerprintScanner] = useState(false);
  const [hasSavedFingerprints, setHasSavedFingerprints] = useState(false);

  useEffect(() => {
    async function checkBiometrics() {
      if (await ExpoLocalAuthentication.hasHardwareAsync()) {
        setHasFingerprintScanner(true);
        if (await ExpoLocalAuthentication.isEnrolledAsync()) {
          setHasSavedFingerprints(true);
        }
      }
      setLoading(false);
    }
    checkBiometrics();
  }, []);

  const { localAuth, setLocalPin, activateBiometrics, reset } = useLocalAuth();

  let pin = '';
  let biometrics = false;
  let onSuccess = () => {};
  let onDismiss = () => setState('');
  let type = '';

  switch (state) {
    case 'biometrics':
      biometrics = true;
      onSuccess = () => {
        activateBiometrics();
        showToast({
          text: 'Local authentication: fingerprint/biometrics activated',
          duration: 3500,
        });
        navigation.goBack();
      };
      break;
    case 'pin':
      pin = 'set';
      onSuccess = code => {
        setTempPin(code);
        setState('confirm');
      };
      break;
    case 'confirm':
      pin = tempPin;
      type = 'confirm';
      onSuccess = code => {
        setLocalPin(code);
        showToast({
          text: 'Local authentication: pin activated',
          duration: 3500,
        });
        navigation.goBack();
      };
      break;
    default:
      const landingProps = {
        hasFingerprintScanner,
        hasSavedFingerprints,
        localAuth,
        setState,
        reset,
      };
      return loading ? <Spinner /> : <LocalAuthLanding {...landingProps} />;
  }

  return (
    <View>
      <LocalAuthentication
        localAuth={{ pin, biometrics }}
        attempts={3}
        type={type}
        onSuccess={onSuccess}
        onDismiss={onDismiss}
      />
      <Button
        id="cancel"
        color="primary"
        type="text"
        wide
        onPress={onDismiss}
      />
    </View>
  );
}
