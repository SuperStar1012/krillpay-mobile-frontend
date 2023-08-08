import React from 'react';

import config from './config';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import settingsConfig from 'screens/settings';
import ProfileProviders from './components/ProfileProviders';

const { pages } = config;
const { pages: settingsPages } = settingsConfig;

export default function ProfileNavigator() {
  return (
    <ProfileProviders>
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: false,
          headerShown: false,
          unmountOnBlur: true,
        }}>
        {Object.keys(pages).map(key => (
          <Stack.Screen
            key={key}
            name={key}
            component={pages?.[key]}
            initialParams={{ config }}
          />
        ))}
        {Object.keys(settingsPages).map(key => (
          <Stack.Screen
            key={key}
            name={key}
            component={settingsPages?.[key]}
            initialParams={{ config: settingsConfig }}
          />
        ))}
      </Stack.Navigator>
    </ProfileProviders>
  );
}

// const Stack = { ...(config?.pages ?? {}) }; //, ...settingsPages };

// export default createStackNavigator(Stack, {
//   headerMode: 'none',
//   // cardStyle: { backgroundColor: '#FFFFFF' },
// });
