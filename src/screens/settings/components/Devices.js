import React, { useState } from 'react';
import moment from 'moment';

import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as Device from 'expo-device';
import { get } from 'lodash';
import Constants from 'expo-constants';

import { View, Text, Button, CustomIcon, EmptyListMessage } from 'components';
import { addDevice, addDeviceApp, deleteDevice } from 'utility/rehive';
import OutputList from 'components/outputs/OutputList';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { Platform, Pressable } from 'react-native';
import { useToast } from 'contexts/ToastContext';
import FormLayout from 'components/layout/Form';
import { FlatList } from 'react-native-gesture-handler';
import RefreshControl from 'components/outputs/RefreshControl';
import { useRehive } from 'hooks/rehive';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';
import * as Application from 'expo-application';

export default function DevicesScreen(props) {
  const { setTempItem, state, setState, tempItem: item } = props;

  const { context: devices, refresh } = useRehive('devices');
  const data = devices?.items ?? [];

  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function registerForPushNotificationsAsync() {
    setLoading(true);
    // console.log('gggg', Constants.isDevice);
    //Constants.isDevice = true;
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
        setError(
          'Unabled to add device for push notifications. Notification preferences have been disabled for this app. Please allow notifications in settings.',
        );
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync())?.data;
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          sound: true,
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          // lightColor: '#FF231F7C', // TODO: add client color?
        });
      }
      return token;
    } else {
      setError('Must use physical device for Push Notifications');
    }
  }

  const showAdd =
    data.findIndex(item => item?.imei === Constants.deviceId) === -1;

  function handleReset() {
    setTempItem('');
    setState('');
    handleRefresh();
  }

  async function getDeviceId() {
    let deviceId = '';
    if (Platform.OS === 'android') {
      deviceId = await Application.androidId;
    } else {
      try {
        // SecureStore.deleteItemAsync('secure_deviceid');
        deviceId = await SecureStore.getItemAsync('secure_deviceid');

        if (!deviceId) {
          deviceId = await Application.getIosIdForVendorAsync();
        }
      } catch (e) {
        console.log('Error deviceId', e);
      }
      // deviceId neither in storage nor getIosIdForVendorAsync(as per doc it may be null)
      if (!deviceId) {
        deviceId = uuidv4();
      }
      deviceId && (await SecureStore.setItemAsync('secure_deviceid', deviceId));
    }
    return deviceId;
  }

  async function handleAddDevice() {
    const deviceId = await getDeviceId();
    const token = await registerForPushNotificationsAsync();
    // console.log(token);
    if (token) {
      setError('');
      try {
        const dataDevice = {
          imei: deviceId,
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
          const respApp = await addDeviceApp(deviceId, dataApp);
          if (respApp.status === 'success') {
            handleReset();
            showToast({
              text: 'Device ' + Device.deviceName + ' successfully added',
              variant: 'success',
            });
          } else {
            setError(
              respApp.message ? respApp.message : 'Unable to add device',
            );
          }
        } else {
          setError(
            respDevice.message ? respDevice.message : 'Unable to add device',
          );
          showToast({
            text: 'Unable to add device',
            variant: 'error',
          });
        }
      } catch (e) {
        console.log('handleAddDevice -> e', e);
      }
    }
    setLoading(false);
  }

  async function handleRemoveDevice(item) {
    setLoading(true);
    try {
      const resp = await deleteDevice(item.id);
      if (resp.status === 'success') {
        handleReset();
        showToast({
          text: 'Device ' + item.name + ' successfully removed',
          variant: 'success',
        });
      } else {
        setError(resp.message ? resp.message : 'Unable to remove device');
      }
    } catch (e) {
      console.log('handleRemoveDevice -> e', e);
    }
    setLoading(false);
  }

  const config = {
    renderItem: ({ item, index }) => (
      <Pressable
        onPress={() => {
          setTempItem(item);
          setState('detail');
        }}>
        <View fD={'row'} mb={1}>
          <View jC={'center'} style={{ paddingRight: 16 }}>
            <CustomIcon
              name={item.metadata.osName.toLowerCase()}
              size={48}
              padded
            />
          </View>
          <View
            fD={'column'}
            aI={'flex-start'}
            jC={'center'}
            style={[
              {
                flex: 1,
                width: '100%',
              },
            ]}>
            <Text t={'h4'}>
              {item.name
                ? item.name
                : item.metadata.brand + ' ' + item.metadata.modelName}
            </Text>
            <Text>
              <Text o={0.8} t="s1" id="last_updated_prefix" />
              <Text o={0.8} t="s1">
                {moment(item.updated).format('ll')}
              </Text>
            </Text>
          </View>
        </View>
      </Pressable>
    ),
    renderDetail: item =>
      item && item.metadata ? (
        <View w="100%">
          <View aI={'center'} w="100%" ph={1} mb={1}>
            <CustomIcon
              name={item.metadata.osName.toLowerCase()}
              size={96}
              padded
            />
          </View>
          <OutputList
            pb={1.5}
            outputProps={{ horizontal: true }}
            items={[
              { label: 'device_name', value: item.name ?? '' },
              { label: 'brand', value: item.metadata.brand },
              { label: 'model', value: item.metadata.modelName },
              {
                label: 'date_added',
                value: moment(item.created).format('lll'),
              },
              {
                label: 'last_updated',
                value: moment(item.updated).format('lll'),
              },
            ]}
          />

          <Button
            wide
            type="text"
            color="error"
            id="remove"
            loading={loading}
            disabled={loading}
            onPress={() => handleRemoveDevice(item)}
          />
        </View>
      ) : null,
    renderEdit: () => (
      <View>
        <View aI={'center'} w="100%" ph={1} pb={1}>
          <CustomIcon name={Device.osName.toLowerCase()} size={96} padded />
        </View>
        <OutputList
          pb={1.5}
          outputProps={{ horizontal: true }}
          vertical
          items={[
            // { label: 'Device ID', value: Constants.deviceId },
            { label: 'device_name', value: Device.deviceName },
            { label: 'brand', value: Device.brand },
            { label: 'model', value: Device.modelName },
          ]}
        />

        {Boolean(error) && (
          <View pb={1.5}>
            <ErrorOutput>{error}</ErrorOutput>
          </View>
        )}
        <Button
          wide
          id="add_device"
          loading={loading}
          disabled={loading || error}
          onPress={() => handleAddDevice()}
        />
      </View>
    ),
  };

  const pageProps = {
    // id,
    // type,
    // item: pageConfig,
    // config: pageConfig,
    // configs,
    // context,
    // state,
    // setState,
    // handleBack,
    showToast,
    // index,
    // listType,
  };

  function handleRefresh() {
    refresh();
  }

  return (
    <FormLayout {...props} {...pageProps} scrollView={false}>
      {state === 'detail' && item ? (
        config?.renderDetail(item)
      ) : state === 'form' ? (
        config?.renderEdit()
      ) : (
        <View pb={1}>
          <FlatList
            // refreshControl={
            //   <RefreshControl
            //     refreshing={devices?.data?.isLoading}
            //     onRefresh={handleRefresh}
            //   />
            // }
            refreshing={devices?.isLoading}
            onRefresh={handleRefresh}
            // keyboardShouldPersistTaps={'handled'}
            data={data}
            renderItem={config?.renderItem}
            ListEmptyComponent={
              devices?.isLoading ? null : (
                <EmptyListMessage pb={1} id="devices" />
              )
            }
            keyExtractor={item => (item.id ? item.id.toString() : '0')}
            // ListEmptyComponent={
            //   !loading && (
            //     <EmptyListPlaceholderImage name={type} text={emptyListMessage} />
            //   )
            // }
            // ListHeaderComponent={renderHeader ? renderHeader : null}
            // ListFooterComponent={
            //   <PaginationListFooter
            //     next={more && !loading}
            //     loading={nextLoading}
            //     getNext={getNext}
            //   />
            // }
            // {...restProps}
          />

          {showAdd && (
            <Button id="button.add_new" wide onPress={() => setState('form')} />
          )}
        </View>
      )}
    </FormLayout>
  );
}
