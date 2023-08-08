import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarIcon from 'components/layout/TabBarIcon';

import HomeScreen from 'screens/home';
import accounts from 'screens/accounts';
import RewardsScreen from 'screens/rewards';
import ProductScreen from 'screens/products';
import ProfileNavigator from 'screens/profile';
import ExchangeScreen from 'screens/accounts/pages/exchange';

import { useRehiveContext } from 'contexts';

const Stack = {
  Home: HomeScreen,
  Wallets: accounts,
  //Rewards: RewardsScreen,
  //Product: ProductScreen,
  Exchange: ExchangeScreen,
  Profile: ProfileNavigator,
};
const Tab = createBottomTabNavigator();

export default function TabNavigator(props) {
  const {
    context: { services, tiers },
    config: { authConfig },
  } = useRehiveContext();

  let hiddenRoutes = [];
  if (!services['Rewards Service']) {
    hiddenRoutes.push('Rewards');
  }
  if (!services['Product Service']) {
    hiddenRoutes.push('Product');
  }

  const isVerified = tiers?.items?.[0]?.level ?? 10 >= (authConfig?.tier ?? 0);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="initialRoute"
      tabStyle={{ backgroundColor: 'transparent' }}
      barStyle={{
        minHeight: 50,
        borderTopWidth: 0,
        elevation: 5,
        zIndex: 5,
        backgroundColor: 'white',

        overflow: 'hidden',
      }}
      // tabBarOptions={{
      //   keyboardHidesTabBar: true,
      //   activeBackgroundColor: 'transparent',
      //   inactiveBackgroundColor: 'transparent',
      //   // tabStyle: { backgroundColor: 'transparent' },
      //   // barStyle: { backgroundColor: 'transparent' },
      //   style: {
      //     marginLeft: 8,
      //     marginRight: 8,
      //     borderTopEndRadius: 12,
      //     borderTopStartRadius: 12,
      //     minHeight: 50,
      //     borderTopWidth: 0,
      //     elevation: 5,
      //     zIndex: 5,
      //     backgroundColor: '#F8F8F8',
      //     overflow: 'hidden',
      //   },
      //   showLabel: false,
      // }}

      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopEndRadius: 25,
          borderTopStartRadius: 25,
          borderWidth: 2,
          borderBottomWidth: 0,
          borderColor: '#EBEBEB',
          minHeight: 50,
          elevation: 5,
          zIndex: 5,
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
        },
        tabBarIcon: ({ focused }) => {
          const { name } = route;
          return <TabBarIcon focused={focused} routeName={name} />;
        },
      })}>
      {/* {Object.keys(Stack).map(key =>
        hiddenRoutes?.includes(key) ||
        (!isVerified && key !== 'Profile') ? null : (
          <Tab.Screen
            key={key}
            name={key}
            component={Stack?.[key]}
            options={{ unmountOnBlur: key === 'Profile' }}
            listeners={({ navigation }) => ({
              blur: () =>
                key === 'Profile'
                  ? navigation.setParams({ screen: undefined })
                  : {},
            })}
          />
        ),
      )} */}

      {Object.keys(Stack).map(key => (
        <Tab.Screen
          key={key}
          name={key}
          component={Stack?.[key]}
          options={{ unmountOnBlur: key === 'Profile' }}
          listeners={({ navigation }) => ({
            blur: () =>
              key === 'Profile'
                ? navigation.setParams({ screen: undefined })
                : {},
          })}
        />
      ))}
    </Tab.Navigator>
  );
}
