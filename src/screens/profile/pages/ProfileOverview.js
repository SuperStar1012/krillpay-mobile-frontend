import React, { useState } from 'react';

import { View, Button, CustomIcon, Text } from 'components';
import { useNavigation } from '@react-navigation/native';
import HeaderProfile from '../components/HeaderProfile';
import { objectToArray } from 'utility/general';
import { useDispatch } from 'react-redux';
import IconListItem from 'components/outputs/IconListItem';
import { FlatList, I18nManager, Pressable } from 'react-native';
// import RefreshControl from 'components/outputs/RefreshControl';
import { useRehiveContext } from 'contexts/RehiveContext';
import { removeAllAuthSessions } from 'screens/auth/redux/actions';
import { logout } from 'utility/rehive';
import ProfileProviders from '../components/ProfileProviders';
import CurrentSessionsDrawer from 'components/auth/CurrentSessionsDrawer';
import client from 'config/client';
import RewardPlaceholderImage from 'screens/rewards/components/images';
import BurgerIcon from 'components/outputs/CustomIcon/BurgerIcon';
import IncreaseKycLimitCard from '../components/IncreaseKycLimitCard';
// import { useModal } from 'hooks/general';
import { PopUpGeneral } from 'components/layout/PopUpGeneral';
import { logoutUser } from 'screens/auth/redux/actions';
function useModal() {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function dismiss() {
    setVisible(false);
    setLoading(false);
    setError('');
  }

  function show() {
    setVisible(true);
    setError('');
  }

  return {
    visible,
    setVisible,
    loading,
    setLoading,
    error,
    setError,
    dismiss,
    show,
  };
}

export default function ProfileOverview(props) {
  const { route } = props;
  const { config } = route?.params ?? {};
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    context: { services, user, tiers },
    config: { profileConfig, authConfig },
  } = useRehiveContext();

  const context = { user, tiers, services, profileConfig };

  const [drawerOpen, setDrawerOpen] = useState(false);

  const sharedProps = { context, navigation };

  const listItems = objectToArray(config?.config ?? {}, 'id').filter(item =>
    typeof item?.condition === 'function' ? item?.condition(context) : true,
  );

  const { sessions = true } = authConfig;
  const hideSessions = Boolean(client.company && !sessions);
  const Modal = useModal();
  //console.log("testdd",props);

  //  async function logoutAll(navigation) {

  // try {
  //   //TODO: call logout function on all sessions
  //    logout();
  //   dispatch(removeAllAuthSessions());
  //   Modal.dismiss();
  //   navigation.navigate('Public', { screen: 'Auth' });
  // } catch (error) {
  //   console.log(error);
  //   if (error.message === 'Invalid token.') {
  //     dispatch(removeAllAuthSessions());
  //     if (navigation) navigation.navigate('Public', { screen: 'Auth' });
  //   }
  // }
  //}

  async function handleLogout() {
    dispatch(logoutUser());
    Modal.dismiss();
    if (navigation) navigation.replace('Public', { screen: 'Auth' });
  }

  function renderModal() {
    const buttonActions = [
      {
        text: 'cancel',
        type: 'text',
        onPress: Modal.dismiss,
      },
      {
        text: 'logout',
        onPress: () => {
          Modal.setLoading(true);
          // logoutAll(navigation);
          handleLogout();
        },
      },
    ];

    const contentText = 'logout_modal_text';
    const titleText = 'logout';

    if (!Modal.visible) return null;

    return (
      <PopUpGeneral
        visible={Modal.visible}
        onDismiss={Modal.dismiss}
        loading={Modal.loading}
        errorText={Modal.error}
        title={titleText}
        contentText={contentText}
        buttonActions={buttonActions}
      />
    );
  }

  return (
    <ProfileProviders>
      <View screen hC={'header'}>
        <CurrentSessionsDrawer
          navigation={navigation}
          drawerOpen={drawerOpen}
          hideDrawer={() => setDrawerOpen(false)}>
          <View
            fD={'row'}
            jC={'space-between'}
            aI="center"
            mh={1}
            mt={1}
            mb={0.5}
            style={{
              zIndex: 3,
              elevation: 3,
            }}>
            {!hideSessions ? (
              <Button t={'text'} onPress={() => setDrawerOpen(true)}>
                <View
                  style={{
                    // minWidth: 110,
                    zIndex: 20,
                  }}>
                  <BurgerIcon />
                </View>
              </Button>
            ) : (
              <View />
            )}

            {/* <Button t={'text'} onPress={() => navigation.navigate('Settings')}>
              <View fD="row" aI="center" style={{ minWidth: 90, zIndex: 20 }}>
                <Text
                  c="#B9B9B9"
                  style={{
                    [I18nManager.isRTL ? 'paddingLeft' : 'paddingRight']: 12,
                  }}
                  id="settings"></Text>
                <CustomIcon
                  name={'settings'}
                  size={24}
                  color="fontLight"
                  contained={false}
                />
              </View>
            </Button> */}
          </View>
          {/* <SkeletonContent
          // containerStyle={{ flex: 1, width: 300 }}
          isLoading={true}
          // layout={[
          //   { key: 'someId', width: 220, height: 20, marginBottom: 6 },
          //   { key: 'someOtherId', width: 180, height: 20, marginBottom: 6 }
          // ]}
        > */}
          <HeaderProfile {...sharedProps} />
          <View f={5}>
            <FlatList
              data={listItems}
              renderItem={({ item }) => (
                <IconListItem
                  key={item?.id ?? item}
                  {...sharedProps}
                  {...item}
                  ns="profile"
                  onPress={() =>
                    navigation.navigate(
                      item?.label === 'settings'
                        ? navigation.navigate('Settings')
                        : item?.page ?? 'ProfilePage',
                      item,
                    )
                  }
                />
              )}
              // refreshControl={
              //   <RefreshControl
              //     refreshing={isLoading}
              //     onRefresh={() => refresh()}
              //   />
              // }
              ListHeaderComponent={<IncreaseKycLimitCard m={1} />}
              ListFooterComponent={
                services?.['Rewards Service'] &&
                profileConfig?.referral?.enabled ? (
                  <Button onPress={() => navigation.navigate('Referral')}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      mt={1}>
                      <View
                        bC="primary"
                        o={0.1}
                        pos="absolute"
                        top={0}
                        h={55}
                        w="100%"
                      />
                      <View pl={1.5} pr={1} pt={0.25}>
                        <RewardPlaceholderImage size={35} />
                      </View>
                      <Text c="primary" fW="500" id={'refer_a_friend'} />
                    </View>
                  </Button>
                ) : (
                  <View>
                    <Button>
                      {/* <Text>iyiola</Text> */}
                      <IconListItem
                        {...sharedProps}
                        label="logout"
                        ns="logout"
                        icon="logout"
                        onPress={() => Modal.show()}
                      />
                    </Button>
                  </View>
                )
              }
            />
          </View>
        </CurrentSessionsDrawer>
        {renderModal()}
      </View>
    </ProfileProviders>
  );
}

// services?.['Rewards Service'] &&
// profileConfig?.referral?.enabled ? (
//   <View mh={1} w="100%">
//     <ReferRewardBanner
//       color={colors.primary}
//       navigation={navigation}
//     />
//   </View>
// ) : (
