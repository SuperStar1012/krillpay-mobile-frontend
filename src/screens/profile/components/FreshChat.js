import React from 'react';
import { View } from 'components/layout/View';
import { WebView } from 'react-native-webview';

export default function FreshChat(props) {
  function handleMessage(event) {
    if (event.nativeEvent.data === 'closeWebView') {
      props.navigation.goBack();
    }
  }

  return (
    <>
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
    </>
  );
}
