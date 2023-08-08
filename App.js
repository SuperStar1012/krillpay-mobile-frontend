import App from './src';
import 'expo-dev-client';
require('node-libs-react-native/globals');
import Constants from 'expo-constants';

//import * as Sentry from 'sentry-expo';
//TODO:: Activate on golive 
// TODO: This constants format will change when we upgrade to the new Expo SDK.
// https://docs.expo.dev/guides/environment-variables/#reading-environment-variables
/*Sentry.init({
  dsn: Constants.manifest?.extra?.eas?.sentryDSN ?? Constants.manifest2?.extra?.expoClient?.extra?.eas?.sentryDSN,
  enableInExpoDevelopment: true,
  debug: true,
});*/

export default  App; //Sentry.Native.wrap(App);
