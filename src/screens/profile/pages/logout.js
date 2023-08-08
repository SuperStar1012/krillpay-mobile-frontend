import React, { useState } from 'react';

import { View, Button, CustomIcon, Text } from 'components';
import HeaderProfile from '../components/HeaderProfile';
import { objectToArray } from 'utility/general';
import IconListItem from 'components/outputs/IconListItem';
import { FlatList, I18nManager } from 'react-native';
// import RefreshControl from 'components/outputs/RefreshControl';
import { useRehiveContext } from 'contexts/RehiveContext';
import ProfileProviders from '../components/ProfileProviders';
import CurrentSessionsDrawer from 'components/auth/CurrentSessionsDrawer';
import client from 'config/client';
import RewardPlaceholderImage from 'screens/rewards/components/images';
import BurgerIcon from 'components/outputs/CustomIcon/BurgerIcon';
import IncreaseKycLimitCard from '../components/IncreaseKycLimitCard';

export default function Logout(props) {
  const { navigation, route } = props;
  const { config } = route?.params ?? {};

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

  console.log(listItems);
  const { sessions = true } = authConfig;
  const hideSessions = Boolean(client.company && !sessions);

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

            <Button t={'text'} onPress={() => navigation.navigate('Settings')}>
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
            </Button>
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

          <FlatList
            data={listItems}
            renderItem={({ item }) => (
              <IconListItem
                key={item?.id ?? item}
                {...sharedProps}
                {...item}
                ns="profile"
                onPress={() =>
                  navigation.navigate(item?.page ?? 'ProfilePage', item)
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
                <View h={16} />
              )
            }
          />
        </CurrentSessionsDrawer>
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
