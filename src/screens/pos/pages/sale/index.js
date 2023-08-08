import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import PoSProducts from './Products';
import PoSCustom from './Custom';
import NavigationIcon from 'components/layout/TabBarIcon';

const Stack = {
  PoSProducts,
  PoSCustom,
};

const Tab = createBottomTabNavigator();

export default function NewSaleNavigator(props) {
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
          return <NavigationIcon focused={focused} routeName={name} />;
        },
      })}>
      {Object.keys(Stack).map(key => (
        <Tab.Screen key={key} name={key} component={Stack?.[key]} />
      ))}
    </Tab.Navigator>
  );
}
