import React, { useState } from 'react';
import { View, Spinner, Button, Text } from 'components';
import Header from 'components/layout/HeaderNew';
import { WebView } from 'react-native-webview';
import { Dimensions } from 'react-native';
import { createWyreOrderReserve } from 'utility/rehive';
import { useSelector } from 'react-redux';
import { cryptoSelector } from '@redux/crypto/reducer';
import Images from 'components/images';
import { useWyreReceive } from 'extensions/wyre/hooks';
import ErrorPage from 'components/page/ErrorPage';
import SuccessPage from 'components/page/SuccessPage';
import WyreBuyHeader from './WyreBuyHeader';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function QuickBuy(props) {
  const crypto = useSelector(cryptoSelector);
  const { navigation, route } = props;
  const currency = route?.params?.currency ?? { currency: { code: 'XBT' } };
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState('wyre');
  const [result, setResult] = useState(
    'https://app.rehive.com/accounts/T668JD8WW2/XLM/quickbuy/success/?accountId=US_UJ2XEX66BV3&authCodesRequested=false&blockchainNetworkTx&createdAt=1658500735000&dest=stellar%3AGD7WXI7AOAK2CIPZVBEFYLS2NQZI2J4WN4HFYQQ4A2OMFVWGWAL3IW7K%3A3BR4H4AMGRB&destCurrency=XLM&id=WO_GPV3GBL3P8&ok=true&orderType=INTERNATIONAL&owner=user%3AUS_UJ2XEX66BV3&paymentMethodName=Visa%20ending%201111&purchaseAmount=100&sourceAmount=105&sourceCurrency=USD&status=COMPLETE&transferId=TF_4R6B9299ZQ9',
  );

  function handleBack() {
    if (!state) {
      props?.navigation?.goBack();
    } else if (state === 'wyre') {
      setState('numpad');
    } else {
      setState('');
    }
  }

  const [data, setData] = useState(null);

  const url =
    'https://app.rehive.com/accounts/' +
    currency?.account +
    '/' +
    currency?.currency?.code +
    '/quickbuy/';

  const { wyreReceiveAddress } = useWyreReceive(currency);

  const destination =
    wyreReceiveAddress ?? crypto?.[currency?.crypto]?.user?.account_id;
  const [loading, setLoading] = useState(false);

  const success_redirect_url = url + 'success/';
  const failure_redirect_url = url + 'error/';

  async function handleWyre() {
    const data = {
      success_redirect_url,
      failure_redirect_url,
      destination_currency: currency?.currency?.code,
      destination,
    };
    setLoading(true);
    const resp = await createWyreOrderReserve({ data });
    setData(resp?.data);
    setState('wyre');
  }
  const isLoading = !destination;

  const uri = data?.url;

  function handleNavigationStateChange(state) {
    const url = state?.url?.split('?')?.[0] ?? '';
    if (url === failure_redirect_url) {
      setResult(state?.url);
      setState('error');
    } else if (url === success_redirect_url) {
      setResult(state?.url);
      setState('success');
    }
  }

  function handleLoadEnd() {
    setLoaded(true);
  }
  const isPost = state === 'error' || state === 'success';

  return (
    <View screen pos="relative">
      <Header
        bC={isPost ? 'background' : 'white'}
        handleBack={handleBack}
        onClose={navigation?.goBack}
      />
      {state === 'error' ? (
        <ErrorPage />
      ) : state === 'success' ? (
        <SuccessPage
          wallet={currency}
          header={WyreBuyHeader}
          result={result}
          onNext={navigation?.goBack}
        />
      ) : state === 'wyre' && uri ? (
        <>
          {!loaded && (
            <View aI="center" jC="center">
              <Spinner style={{ position: 'absolute', top: 200, zIndex: 10 }} />
              <Text p={1} id="this_may_take_a_while_to_load" />
            </View>
          )}
          <View ph={0.5} pt={1} f={1} bC="transparent">
            <WebView
              style={{
                width: '100%',
                flex: loaded ? 1 : 0,
              }}
              enableApplePay
              //    onLoadProgress={({ nativeEvent }) => {
              //     //your code goes here
              //  }}
              onNavigationStateChange={handleNavigationStateChange}
              //  onMessage={onMessage.bind(this)}

              originWhitelist={['*']}
              source={{ uri }}
              onLoadEnd={handleLoadEnd}
            />
          </View>
        </>
      ) : (
        <View fD="column" f={1} jC="space-between" pt={1}>
          <View aI="center">
            <Images name="wyre" width={(SCREEN_WIDTH / 5) * 3} height={100} />
            <Text
              c="fontDark"
              tA="center"
              p={1.5}
              lH={24}
              s={18}
              id="wyre_helper_text"></Text>
            <View p={1.5}>
              {/* <Text fW="700" c="fontDark" tA="center" lH={24} s={18}>
                Please prepare your card details, billing address, email and
                phone number
              </Text> */}
            </View>
          </View>

          <View ph={1.5} pb={1.5} w="100%">
            <Button
              id="continue_to_wyre"
              wide
              disabled={isLoading}
              loading={loading}
              onPress={handleWyre}
            />
          </View>
        </View>
      )}
    </View>
  );
}
