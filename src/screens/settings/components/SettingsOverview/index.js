import React, { useState } from 'react';

import Constants from 'expo-constants';
import * as Application from 'expo-application';
import Header from 'components/layout/HeaderNew';

import { Text, View, PopUpGeneral } from 'components';
import { useModal } from 'utility/hooks';
import overview from '../../config/pages/overview';
import SettingsOverviewSection from './SettingsOverviewSection';
import SettingsProviders from '../SettingsProviders';
import { useRehiveContext } from 'contexts/RehiveContext';
import { useDispatch } from 'react-redux';
import { logoutUser } from 'screens/auth/redux/actions';
import { useTranslation } from 'react-i18next';

export default function SettingsOverview(props) {
  const { navigation } = props;

  const {
    context: { services },
    config: { faqsConfig, settingsConfig },
  } = useRehiveContext();
  const dispatch = useDispatch();

  const { modalVisible, hideModal, showModal } = useModal();
  const [loading, setLoading] = useState(false);
  const { i18n } = useTranslation();
  const context = { services, settingsConfig, faqsConfig, i18n };

  async function handleLogout() {
    dispatch(logoutUser());
    hideModal();
    if (navigation) navigation.replace('Public', { screen: 'Auth' });
  }

  const buttonActions = [
    {
      id: 'cancel',
      type: 'text',
      onPress: hideModal,
    },
    {
      id: 'logout',
      loading,
      onPress: () => {
        setLoading(true);
        handleLogout();
      },
    },
  ];

  const contentText = 'logout_modal_text';
  const titleText = 'logout';

  const { sections } = overview;
  const filteredSections = sections.filter(item => item.condition(context));

  return (
    <SettingsProviders>
      <View screen scrollView jC="space-between">
        <Header navigation={navigation} back title="settings" />
        <View f={1}>
          {filteredSections.map((item, index) => (
            <SettingsOverviewSection
              {...props}
              context={context}
              showModal={showModal}
              key={item?.id ?? item}
              index={index}
              last={index === sections.length - 1}
              {...item}
            />
          ))}
        </View>

        <View bC="white" ph={1.5} style={{ paddingTop: 32, justifySelf: 'flex-end' }}>
          <Text tA={'center'}>
            <Text id="App version" tA={'center'}/>
            {`: ${Constants.manifest2?.extra?.expoClient?.extra?.eas?.appVersion ??
                  Constants.manifest?.extra?.eas?.appVersion}`}
          </Text>
          <Text tA={'center'}>
            <Text id="Native build version" tA={'center'} />
            {`: ${Application.nativeApplicationVersion}`}
          </Text>
        </View>
      </View>
      {!!modalVisible && (
        <PopUpGeneral
          buttonActions={buttonActions}
          visible={modalVisible}
          onDismiss={hideModal}
          loading={loading}
          // errorText={modalError}
          title={titleText}
          contentText={contentText}
        />
      )}
    </SettingsProviders>
  );
}
