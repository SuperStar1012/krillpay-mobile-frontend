import React, { useState, useEffect, useRef } from 'react';
import { LogBox, AppState, Image, ActivityIndicator } from 'react-native';
import * as Updates from 'expo-updates';
import SplashImage from '../assets/icons/splash.png';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { View } from './components/layout/View';
import Text from './components/outputs/Text';
import App from './navigation';
import { ToastProvider } from 'contexts/ToastContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import * as SplashScreen from 'expo-splash-screen';

import { ThemeProvider } from 'contexts/ThemeContext';
import {
  LocalAuthProvider,
  INITIAL_LOCAL_AUTH_STATE,
} from 'contexts/LocalAuthContext';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_300Light,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { Button } from './components';
import { RehiveProvider } from 'contexts/RehiveContext';
import Toast from 'components/layout/Toast';

import { LanguageProvider } from 'utility/i18n';
import { DirectionProvider } from 'utility/i18n/provider';
import { BusinessProvider } from 'contexts/BusinessContext';
LogBox.ignoreLogs(['Warning: ...', 'Remote', '']);

// Keep the splash screen visible while we fetch resources in _loadAssetsAsync
SplashScreen.preventAutoHideAsync();

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [localAuth, setLocalAuth] = useState(null);

  const appState = useRef(AppState.currentState);
  const [fetchingUpdate, setFetchingUpdate] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    async function prepare() {
      try {
        // Pre-load activities
        console.log("loading")
        await _loadAssetsAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render and hide the splash screen
        await SplashScreen.hideAsync();
      }
    }
    prepare();

    return () => {
      subscription.remove();
    };
  }, []);

  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_300Light,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  async function handleUpdate() {
    try {
      if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setFetchingUpdate(true);
          await Updates.fetchUpdateAsync();
          setUpdated(true);
        }
      }
    } catch (e) {}
  }

  const handleAppStateChange = async nextAppState => {
    try {
      if (
        appState.current?.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        await handleUpdate();
      }
      appState.current = nextAppState;
    } catch (error) {
      console.log(error);
    }
  };
  async function _loadAssetsAsync() {
    try {
      if (!__DEV__) {
        await handleUpdate();
      }
      const tempLocalAuth = await SecureStore.getItemAsync('localAuth');
      setLocalAuth(
        tempLocalAuth &&
          tempLocalAuth !== 'null' &&
          typeof JSON.parse(tempLocalAuth) === 'object'
          ? JSON.parse(tempLocalAuth)
          : INITIAL_LOCAL_AUTH_STATE,
      );
    } catch (e) {
      console.log('TCL: function_loadAssetsAsync -> e', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleRestart() {
    await Updates.reloadAsync();
  }

  if (loading || !localAuth || !fontsLoaded) {
    return null;
  } else {
    return (
      <Providers {...{ localAuth }}>
        {fetchingUpdate ? (
          <View style={{ position: 'relative' }}>
            <Image
              source={{
                uri: Image.resolveAssetSource(SplashImage).uri,
              }}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
            {updated ? (
              <View
                p={2}
                w={'100%'}
                aI="center"
                style={{ position: 'absolute', bottom: 0 }}>
                <Text tA={'center'} fW={'500'} style={{ paddingBottom: 8 }}>
                  App updated!
                </Text>
                <Button label="Restart app" onPress={handleRestart} />
              </View>
            ) : (
              <View
                p={2}
                w={'100%'}
                style={{ position: 'absolute', bottom: 0 }}>
                <View mb={0.5}>
                  <ActivityIndicator />
                </View>
                <Text tA={'center'} fW={'500'}>
                  Fetching the latest update...
                </Text>
                <Text tA={'center'}>Please wait while it is installed</Text>
              </View>
            )}
          </View>
        ) : (
          <>
            <StatusBar style="auto" />
            <App />
            <Toast />
          </>
        )}
      </Providers>
    );
  }
};

const queryClient = new QueryClient();
const Providers = ({ children, localAuth }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <LocalAuthProvider initial={localAuth}>
          <RehiveProvider>
            <BusinessProvider>
              <ThemeProvider>
                <LanguageProvider>
                  <DirectionProvider>{children}</DirectionProvider>
                </LanguageProvider>
              </ThemeProvider>
            </BusinessProvider>
          </RehiveProvider>
        </LocalAuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default Main;
