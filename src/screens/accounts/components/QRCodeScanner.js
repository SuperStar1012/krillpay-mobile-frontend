import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Spinner, EmptyListMessage, Text } from 'components';
import { decodeQR } from 'utility/general';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const qr_width = SCREEN_WIDTH - 64;

class QRCodeScanner extends Component {
  static navigationOptions = {
    title: 'QR code scanner',
  };

  state = { hasCameraPermission: false, loading: true, scanned: false };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
      loading: false,
    });
  }

  _handleBarCodeRead = raw => {
    this.setState({ scanned: true });
    const data = decodeQR(raw?.data ?? '') ?? {};
    const { currencies, currencyHook, account } = this.props;
    const currentCurrency =
      currencies?.data?.[currencyHook?.[0]] ?? this.props?.currency ?? {};
    const { currency, image = '', invoice = '', type, asset_code } = data;
    let accountRef = '';
    accountRef = account ? account : currentCurrency.account;
    let tempCurrencies = null;
    if (type === 'web+stellar') {
      if (asset_code) {
        tempCurrencies = currencies?.data?.filter(
          item => item.currency.code === asset_code,
        );
      } else {
        tempCurrencies = currencies?.data?.filter(
          item =>
            item?.currency?.code?.match('XLM') ||
            item?.currency?.code?.match('TXLM'),
        );
      }
    } else if (type === 'bitcoin') {
      tempCurrencies = currencies?.data.filter(
        item =>
          item.currency.code.match('XBT') || item.currency.code.match('TXBT'),
      );
    } else if (currency) {
      tempCurrencies = currencies?.data.filter(
        item => item.currency.code === currency,
      );
    }
    if (tempCurrencies?.length > 1) {
      let tempCurrencies2 = tempCurrencies.filter(
        item => item?.account === accountRef,
      );
      if (tempCurrencies2?.length === 0)
        tempCurrencies2 = tempCurrencies.filter(item => item.primary); // account ref?
      if (tempCurrencies2.length) {
        tempCurrencies = tempCurrencies2;
      }
    }
    const tempCurrency =
      tempCurrencies && tempCurrencies.length > 0 ? tempCurrencies[0] : null;

    let tempData = {};
    if (image || invoice) {
      try {
        tempData = {
          image: image ? decodeURIComponent(image) : '',
          invoice: invoice ? JSON.parse(decodeURIComponent(invoice)) : null,
        };
      } catch (error) {
        console.log('QRCodeScanner -> error', error);
      }
    }

    this.props.onSuccess({
      ...data,
      ...tempData,
      currency: tempCurrency ? tempCurrency : currentCurrency,
      currentCurrency,
      currencyCode: currency,
      accountRef,
      error:
        !tempCurrencies || tempCurrencies?.length === 0
          ? 'You do not have an account for the currency requested'
          : '',
    });
  };

  render() {
    const { hasCameraPermission, loading } = this.state;

    return (
      <View style={{ flex: 1, width: '100%' }}>
        {loading ? (
          <View f={1} aI={'center'} jC={'center'}>
            <Spinner size={'large'} />
          </View>
        ) : hasCameraPermission ? (
          <View style={{ flex: 1, width: '100%' }}>
            {/* <View style={styles.overlay} /> */}
            <BarCodeScanner
              onBarCodeScanned={
                !this.state.scanned ? this._handleBarCodeRead : () => {}
              }
              style={{
                ...StyleSheet.absoluteFillObject,
                padding: 0,
                margin: 0,
              }}
              barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}>
              <View style={styles.layerTop} />
              <View style={styles.layerCenter}>
                <View style={styles.layerLeft} />
                <View style={styles.focused} />
                <View style={styles.layerRight} />
              </View>
              <View style={styles.layerBottom} />
            </BarCodeScanner>
            <View style={styles.bottomMessage}>
              <Text p={1} tA="center" id="scan_helper_text"></Text>
            </View>
          </View>
        ) : (
          <EmptyListMessage idOverride="no_access_to_camera" />
        )}
      </View>
    );
  }
}

export default QRCodeScanner;

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  bottomMessage: {
    // ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    // opacity: 0.8,
    // justifyContent: 'center',
    // alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopEndRadius: 25,
    borderTopStartRadius: 25,
  },
  layerTop: {
    height: SCREEN_HEIGHT / 6,
    backgroundColor: opacity,
  },
  layerCenter: {
    height: qr_width,
    width: qr_width,
    flexDirection: 'row',
  },
  layerLeft: {
    width: 32,
    backgroundColor: opacity,
  },
  focused: {
    height: qr_width,
    width: qr_width,
    // flex: 10,
  },
  layerRight: {
    width: 32,
    backgroundColor: opacity,
  },
  layerBottom: {
    flex: 1,
    backgroundColor: opacity,
  },
});
