import React from 'react';
import { View } from 'components';
import MfaForm from './MfaForm';
import { useRehiveContext } from 'contexts/RehiveContext';
import { useToast } from 'contexts/ToastContext';

export default function TwoFactorSettingsPage(props) {
  const {
    context: { user },
  } = useRehiveContext();
  const { showToast } = useToast();
  return (
    <View scrollView>
      <MfaForm
        tempAuth={user}
        onSuccess={() => props.navigation.goBack()}
        showToast={showToast}
        settingsMFA
      />
    </View>
  );
}
