import React, { useEffect } from 'react';
import { View, Button, Text, PopUpGeneral } from 'components';
import { I18nManager as RNI18nManager } from 'react-native';
import * as Updates from 'expo-updates';
import { useModal } from 'hooks/general';
import { useTranslation } from 'react-i18next';

export default function LanguageRestartModal() {
  const { i18n } = useTranslation(['common']);
  const isLocaleRTL = i18n.dir() === 'rtl';
  const requiresRestart =
    isLocaleRTL !== RNI18nManager.isRTL &&
    i18n?.language === i18n?.resolvedLanguage;
  const { modalVisible, hideModal, showModal } = useModal(false);

  useEffect(() => {
    if (requiresRestart) showModal();
    else hideModal();
  }, [requiresRestart]);

  function switchRTL() {
    RNI18nManager.forceRTL(isLocaleRTL);
    Updates.reloadAsync();
  }

  return (
    <PopUpGeneral visible={modalVisible} onDismiss={hideModal}>
      <View mb={1.5}>
        <Text id="app_restart_language_rtl" tA="center" />
      </View>
      <Button id="restart" wide onPress={switchRTL} />
    </PopUpGeneral>
  );
}
