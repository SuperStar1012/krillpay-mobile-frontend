import React from 'react';

import { View } from 'components';
import Header from 'components/layout/HeaderNew';
import { WebView } from 'react-native-webview';

export default function SupportPage(props) {
  const { navigation } = props;

  function handleMessage(event) {
    if (event.nativeEvent.data === 'closeWebView') {
      props.navigation.goBack();
    }
  }

  return (
    <View screen bC={'white'}>
      <Header navigation={navigation} />
      <View style={{ flex: 1 }}>
        {
          <WebView
            source={{
              uri: 'https://p48musicrecord.com/chat',
            }}
            javaScriptEnabled={true}
            style={{ zIndex: 100000 }}
            startInLoadingState={true}
            onMessage={handleMessage}
          />
        }
      </View>
    </View>
  );
}
