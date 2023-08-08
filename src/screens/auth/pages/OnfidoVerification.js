import React, { useEffect } from 'react';
import { View } from 'components';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import HeaderNew from 'components/layout/HeaderNew';

import AsyncStorage from '@react-native-async-storage/async-storage';

async function setLocalStorage(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error setting item:', error);
  }
}

export default function OnfidoVerification(props) {
  const navigation = useNavigation();

  useEffect(() => {
    setLocalStorage('get-verified', 'true');
  }, []);
  return (
    <>
      <View style={{ marginTop: 30, paddingBottom: 10 }}>
        <HeaderNew
          handleBack={() => {
            navigation.goBack();
          }}
        />
      </View>
      <WebView
        source={{
          uri: 'https://us.onfido.app/f/724df456-bf60-4b5d-a4cc-e788acdfef7b?sandbox',
        }}
        javaScriptEnabled={true}
        style={{ zIndex: 100000 }}
        startInLoadingState={true}
      />
    </>
  );
}
