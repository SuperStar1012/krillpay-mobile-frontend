import React from 'react';
import { View, Text, ButtonList, CustomImage } from 'components';

const MfaLanding = props => {
  const {
    hasFingerprintScanner,
    hasSavedFingerprints,
    localAuth,
    setState,
    reset,
  } = props;
  const { pin, biometrics } = localAuth;

  const buttons = [];
  if (hasFingerprintScanner && hasSavedFingerprints && !biometrics) {
    buttons.push({
      id: 'activate_biometrics',
      onPress: () => setState('biometrics'),
    });
  }
  if (!pin) {
    buttons.push({
      id: 'set_pin',
      onPress: () => setState('pin'),
    });
  }

  if (pin || biometrics) {
    buttons.push({
      id: 'reset',
      onPress: reset,
      color: 'error',
      type: 'text',
    });
  }

  return (
    <View style={{ alignContent: 'center' }}>
      <CustomImage
        containerStyle={{ paddingBottom: 16 }}
        name={'localAuth'}
        width={120}
      />
      <Text tA={'center'} id="local_auth_landing_description" />
      <View pt={1}>
        {!hasFingerprintScanner ? (
          <Text c={'error'} tA={'center'} id="biometrics_no_scanner_error" />
        ) : !hasSavedFingerprints ? (
          <Text
            c={'error'}
            tA={'center'}
            id="biometrics_no_fingerprints_error"
          />
        ) : null}
      </View>
      <View mt={1}>
        <ButtonList items={buttons} />
      </View>
    </View>
  );
};

export default MfaLanding;
