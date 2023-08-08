import React from 'react';
import { View } from 'components';
import Header from 'components/layout/HeaderNew';
import { WebView } from 'react-native-webview';

export default function FAQsPage(props) {
  const { navigation } = props;

  return (
    <View screen bC={'white'}>
      <Header navigation={navigation} />
      <View style={{ flex: 1 }}>
        {
          <WebView
            source={{
              uri: 'https://support.krillpay.com/support/solutions/folders/151000290754',
            }}
            javaScriptEnabled={true}
            style={{ zIndex: 100000 }}
            startInLoadingState={true}
          />
        }
      </View>
    </View>
  );
}
