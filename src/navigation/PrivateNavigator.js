import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabsNavigator';
import OnboardingScreen from 'screens/onboarding';
import ImageCapture from 'screens/utilities/ImageCapture';
import accounts from 'screens/accounts/pages';
import FormScreen from 'screens/form';
import help from 'screens/help/config';
import { useRehiveContext } from 'contexts';
import SplashScreen from 'components/auth/SplashScreen';
import PoSNavigator from 'screens/pos';
import RewardDetail from 'screens/rewards/pages/RewardDetail';
import CampaignDetail from 'screens/rewards/pages/CampaignDetail';
import WebView from 'screens/webview';
import OnfidoVerification from 'screens/auth/pages/OnfidoVerification';

const Stack = createStackNavigator();

export default function PrivateNavigator(props) {
  const {
    context: { appLoaded = true },
  } = useRehiveContext();

  if (!appLoaded) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      initialRouteName="Private"
      screenOptions={{ gestureEnabled: false, headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Onfido" component={OnfidoVerification} />
      <Stack.Screen name="Form" component={FormScreen} />
      <Stack.Screen name="ImageCapture" component={ImageCapture} />
      <Stack.Screen name="RewardDetail" component={RewardDetail} />
      <Stack.Screen name="CampaignDetail" component={CampaignDetail} />
      <Stack.Screen name="WebView" component={WebView} />
      <Stack.Screen name="PoS" component={PoSNavigator} />
      {accounts?.pages &&
        Object.keys(accounts?.pages).map(key => (
          <Stack.Screen
            key={key}
            name={key}
            component={accounts?.pages?.[key]}
          />
        ))}
      {help?.pages &&
        Object.keys(help?.pages).map(key => (
          <Stack.Screen key={key} name={key} component={help?.pages?.[key]} />
        ))}
    </Stack.Navigator>
  );
}
