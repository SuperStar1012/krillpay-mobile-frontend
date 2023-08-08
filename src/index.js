import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import Main from './main';
import { persistor, store } from './redux/store';

import { fetch, addEventListener } from '@react-native-community/netinfo';
import EmptyListPlaceholderImage from './components/outputs/CustomImage/empty/EmptyListPlaceholderImage';
import { LogBox, View, AppState } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { navigationRef } from 'navigation';

export default function App(props) {
  LogBox.ignoreAllLogs();
  const [isConnected, setIsConnected] = useState(true);

  // async function handleAppStateChange() {
  //   fetch().then(setNetworkState);
  // }

  // function setNetworkState(state) {
  //   if (state?.isConnected !== isConnected) {
  //     setIsConnected(state?.isConnected);
  //   }
  // }

  // useEffect(() => {
  //   const unsubscribe = addEventListener(setNetworkState);
  //   // AppState.addEventListener('change', handleAppStateChange);

  //   return () => {
  //     unsubscribe();
  //     // AppState.removeEventListener('change');
  //   };
  // }, []);

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#FFFFFF',
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <NavigationContainer theme={MyTheme} ref={navigationRef}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {!isConnected ? (
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <EmptyListPlaceholderImage
                  name="internet"
                  text="Please check your internet connection"></EmptyListPlaceholderImage>
              </View>
            ) : (
              <Main />
            )}
          </PersistGate>
        </Provider>
      </NavigationContainer>
    </View>
  );
}
