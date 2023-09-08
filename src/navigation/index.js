import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PublicNavigator from './PublicNavigator';

import PrivateNavigator from './PrivateNavigator';
import { createNavigationContainerRef } from '@react-navigation/native';
// import { useRehiveContext } from 'contexts';
import help from 'screens/help/config';
import LanguageRestartModal from 'components/modals/LanguageRestartModal';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function goBack() {
  navigationRef.goBack();
}

const Stack = createStackNavigator();

export default function RootNavigator() {
  // const {
  //   context: { user },
  // } = useRehiveContext();

  return (
    <>
      <Stack.Navigator
        initialRouteName="Public"
        screenOptions={{ headerShown: false, animationEnabled: false }}>
        <Stack.Screen name="Public" component={PublicNavigator} />
        <Stack.Screen name="Private" component={PrivateNavigator} />
        {help?.pages &&
          Object.keys(help?.pages).map(key => (
            <Stack.Screen key={key} name={key} component={help?.pages?.[key]} />
          ))}
      </Stack.Navigator>
      <LanguageRestartModal />
    </>
  );
}

{
  /* <CurrentSessionsDrawer
// navigation={navigation}
drawerOpen={drawerOpen}
hideDrawer={() => setDrawerOpen(false)}>
    </CurrentSessionsDrawer> */
}
