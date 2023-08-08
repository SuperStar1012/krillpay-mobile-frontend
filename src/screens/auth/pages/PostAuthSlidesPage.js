import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as Device from 'expo-device';
import { get } from 'lodash';
import Constants from 'expo-constants';

import { FullScreenForm, Slides } from 'components';
import { onAuthSuccess } from '../redux/actions';
import { addDevice, addDeviceApp } from 'utility/rehive';
import { Platform, View, Text } from 'react-native';
import { useRehiveContext } from 'contexts/RehiveContext';
import { useIsRTL } from 'hooks/general';

export default function PostAuthSlidesPage(props) {
  const { onSuccess, setLoading, onBack, tempAuth, company } = props;

  const isRTL = useIsRTL();
  const {
    config: { slidersConfig },
  } = useRehiveContext();
  const slides = slidersConfig?.postAuth ?? [];
  const dispatch = useDispatch();

  async function registerForPushNotificationsAsync() {
    let token = '';
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS,
      );
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS,
        );
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        // setError('Unabled to add device for push notifications');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync())?.data;
    } else {
      // setError('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        sound: true,
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        // lightColor: '#FF231F7C',
      });
    }

    try {
      const dataDevice = {
        imei: Constants.deviceId,
        name: Device.deviceName,
        metadata: {
          brand: Device.brand,
          modelName: Device.modelName,
          osName: Device.osName,
          osVersion: Device.osVersion,
        },
      };
      const respDevice = await addDevice(dataDevice);

      if (respDevice.status === 'success') {
        const dataApp = {
          name: 'Wallet',
          type: 'expo',
          token,
        };
        const deviceId = get(respDevice, ['data', 'id']);
        await addDeviceApp(deviceId, dataApp);
      } else {
      }
    } catch (e) {
      console.log('handleAddDevice -> e', e);
    }

    setLoading(false);
  }

  useEffect(() => {
    async function register() {
      if (tempAuth.register) {
        // await registerForPushNotificationsAsync();
        registerForPushNotificationsAsync();
      }
      dispatch(onAuthSuccess(tempAuth, company));
    }
    register();
  }, [tempAuth]);

  useEffect(() => {
    if (slides.length === 0 || !tempAuth.register) {
      onSuccess();
    } else {
      setLoading(false);
    }
  }, [slides]);

  return (
    <>
      <View style={{ height: 200 }}>
        <Text>{JSON.stringify(slides)}</Text>
      </View>
      <FullScreenForm
        type="auth"
        iconHeaderLeft={isRTL ? 'chevron-right' : 'chevron-left'}
        onPressHeaderLeft={onBack}
        textHeaderRight={'skip'}
        onPressHeaderRight={onSuccess}>
        <Slides items={slides} fullScreen onSuccess={onSuccess} />
      </FullScreenForm>
    </>
  );
}
