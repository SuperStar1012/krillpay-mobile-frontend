import React, { useState, useEffect } from 'react';
import { Image, TouchableOpacity, StyleSheet, Share } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Text, View, Button } from 'components';
import { get } from 'lodash';
import ProfilePlaceholder from './ProfilePlaceholder';
import { useTheme } from 'components/context';
import { getActiveTier } from 'utility/general';
import { currenciesSelector } from 'screens/accounts/redux/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SendRecipient from 'screens/accounts/components/SendRecipient';
import { Icon } from 'components/outputs/Icon';
import { useSelector } from 'react-redux';

async function getLocalStorage(key) {
  try {
    await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('Error getting item:', error);
  }
}

export default function HeaderProfile(props) {
  const currencies = useSelector(currenciesSelector);

  const currency = get(currencies, ['data', 0]);

  const { context = {}, navigation } = props;

  const [showModal, setShowModal] = useState(false);

  const { colors, design } = useTheme();
  if (!context?.user) {
    return (
      <View p={1} ph={1.25} style={styles.viewStyleContainer}>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            // style={viewStyleContainer}
          >
            <SkeletonPlaceholder.Item
              width={50}
              height={50}
              borderRadius={50}
            />
            <SkeletonPlaceholder.Item marginLeft={16}>
              <SkeletonPlaceholder.Item
                width={120}
                height={18}
                borderRadius={10}
              />
              <SkeletonPlaceholder.Item
                marginTop={8}
                width={80}
                height={15}
                borderRadius={10}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </View>
    );
  }
  const { tiers = {}, user } = context ?? {};

  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    async function getVerifiedStatus() {
      try {
        const verified = await AsyncStorage.getItem('get-verified');
        setIsVerified(verified === 'true');
      } catch (error) {
        console.error('Error getting item:', error);
      }
    }
    getVerifiedStatus();
  }, []);

  const photoLink = user?.profile;

  const userTags = user?.username;
  const name = user?.first_name ? user?.first_name + ' ' + user?.last_name : '';

  const { viewStyleContainer, imageStylePhoto, viewStyleName } = styles;

  const item = getActiveTier(tiers);

  const tierDescription = item
    ? 'Tier ' + item.level + (item.name ? ' - ' + item.name : '')
    : '';

  return (
    <View
      bC={design.app.surface ? 'transparent' : 'header'}
      p={1}
      ph={1}
      f={2}
      fD="column"
      aI="center"
      style={viewStyleContainer}>
      <View pos={'absolute'} mt={-0.5}>
        <SendRecipient user={user} />
        {/* {photoLink ? (
            <Image
              style={[
                imageStylePhoto,
                {
                  borderColor: colors.headerContrast,
                },
              ]}
              source={{
                uri: photoLink,
                // cache: 'only-if-cached',
              }}
              key={photoLink}
            />
          ) : (
            <ProfilePlaceholder size={50} />
          )} */}

        <View mt={0.2}>
          {tierDescription ? (
            <Button onPress={() => navigation.navigate('Tier')}>
              <Text tA={'center'} s={15} c={'primary'} fW="500">
                {tierDescription}
              </Text>
            </Button>
          ) : null}
        </View>
        <View w={300} f={1} fD={'row'} jC={'space-between'} mt={0.2}>
          <Icon
            onPress={async () => {
              try {
                await Share.share({
                  message: user?.username, //to be updated later to real profile link
                });
              } catch (error) {
                // alert(error.message);
              }
            }}
            set={'MaterialIcons'}
            style={{ alignItems: 'flex-start' }}
            name={'ios-share'}
            size={30}
            color={'fontLight'}
          />

          <Icon
            onPress={() => navigation.navigate('Receive', { currency })}
            set={'MaterialCommunityIcons'}
            style={{ alignItems: 'flex-start' }}
            name={'qrcode'}
            size={30}
            color={'fontLight'}
          />
        </View>
        <View f={1} mt={0.2} fD={'column'} aI={'center'}>
          <Button
            onPress={async () => {
              try {
                await Share.share({
                  message: 'https://krillpay.com', //to be updated later to real profile link
                });
              } catch (error) {
                // alert(error.message);
              }
            }}
            label="Invite Friends"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyleContainer: {
    borderBottomWidth: 1,
    marginBottom: 1,
    borderBottomColor: '#E0E0E0',
    // elevation: 2,
    // zIndex: 2,
  },
  imageStylePhoto: {
    width: 50,
    height: 50,
    borderRadius: 40,
    borderWidth: 0,
  },
  viewStyleName: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
  },
});
