import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from 'screens/auth';
import SplashScreen from 'components/auth/SplashScreen';
import LocalAuthScreen from 'screens/auth/pages/LocalAuthScreen';
import { useRehiveContext } from 'contexts';
import SendNaira from 'screens/accounts/pages/sendNaira';
import ReviewTransaction from 'screens/accounts/pages/review/ReviewTransaction';

const Stack = createStackNavigator();

export default function PublicNavigator() {
  const {
    context: { initialAuthScreen = 'Send' },
  } = useRehiveContext();
  if (!initialAuthScreen) {
    return <SplashScreen />;
  }
  return (
    <Stack.Navigator
      initialRouteName={initialAuthScreen}
      screenOptions={{ headerShown: false, animationEnabled: false }}>
      <Stack.Screen name="Send" component={SendNaira} />
      <Stack.Screen name="ReviewTransaction" component={ReviewTransaction} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="LocalAuth" component={LocalAuthScreen} />
    </Stack.Navigator>
  );
}
