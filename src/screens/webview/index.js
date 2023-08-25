import React, { useRef } from 'react';
import { WebView as RNWebView } from 'react-native-webview';

import { PopUpGeneral, View } from 'components';
import { Dimensions } from 'react-native';
import Constants from 'expo-constants';
import { useKeyboard } from 'hooks/keyboard';
// import { useQuery } from 'react-query';
// import { getWyreUser, getWyreUserOnboarding } from 'utility/rehive';
import { useRehiveContext } from 'contexts';

import configs from './config';
import { useRehive } from 'hooks/rehive';
import WebViewDisclaimerLayout from './components/WebViewDisclaimerLayout';
import { useModal } from 'utility/hooks';
import Header from 'components/layout/HeaderNew';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function WebView(props) {
  let { onEvent, onExit, onSuccess, navigation, route } = props;

  const { id } = route?.params ?? {};

  const config = configs?.[id] ?? {};
  let { uri, data } = config;

  const { showModal, hideModal, modalVisible } = useModal();
  const { context: rehiveContext } = useRehiveContext();

  const query = useRehive(data);
  const { keyboardHeight } = useKeyboard();
  let webviewRef = useRef();

  if (!config) return null;

  const context = { ...rehiveContext };

  // if (typeof config === 'function') config = config({ context });
  if (typeof uri === 'function') uri = uri({ context, query });

  function handleDismiss() {
    // typeof onExit === 'function' && onExit();
    hideModal();
    navigation.goBack();
  }

  function handleNavigationStateChange(event) {
    onEvent(event);
  }

  function handleLoad() {}

  const visible = !!(uri && config && modalVisible);

  return (
    <>
      {!visible ? (
        <WebViewDisclaimerLayout
          config={config}
          onPress={showModal}
          loading={query?.loading || !uri}
        />
      ) : (
        <View
          screen
          // h={SCREEN_HEIGHT - (40 + Constants.statusBarHeight + keyboardHeight)}
        >
          <Header handleBack={hideModal} onClose={navigation?.goBack} />
          {!!uri && (
            <RNWebView
              ref={webviewRef}
              source={{
                uri,
              }}
              // onLoad={event => console.log('event', event)}
              // style={{ zIndex: 100000, flex: 1 }}
              // // ref={ref => (webviewRef = ref)}
              // onError={event => console.log('error', event)}
              // onMessage={event => console.log('message', event)}
            />
          )}
        </View>
      )}
    </>
  );
}

{
  /* <PopUpGeneral
        containerStyle={{ paddingBottom: 0 }}
        onDismiss={handleDismiss}
        // showClose
        visible={visible}
        contentExtra={ */
}
{
  /* }
      /> */
}
