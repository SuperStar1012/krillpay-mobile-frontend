import React from 'react';
import { View, Text, Spinner } from 'components';
import HeaderNew from 'components/layout/HeaderNew';
import PoSCheckoutHeader from './PoSCheckoutHeader';
import QRCode from 'react-native-qrcode-svg';
import { Dimensions } from 'react-native';
import client from 'config/client';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function PoSCheckoutScan(props) {
  const { setState, invoiceId } = props;
  const url = client?.url + '/checkout/?request=' + invoiceId;

  return (
    <View w="100%" screen>
      <HeaderNew handleBack={() => setState('email')} />
      <PoSCheckoutHeader {...props} />
      <View f={1} jC="space-around">
        <View>
          <View pv={SCREEN_WIDTH < 380 ? 1 : 1.5} aI="center" w="100%">
            <QRCode
              value={url}
              size={SCREEN_WIDTH / (SCREEN_WIDTH < 380 ? 2.25 : 2)}
            />
          </View>
          <Text
            tA="center"
            fW="500"
            id="scan_qr_helper"
            paragraph
            s={16}></Text>
        </View>
        <View pb={2}>
          <Spinner
            style={{ paddingBottom: SCREEN_WIDTH < 380 ? 8 : 12 }}
            // size={SCREEN_WIDTH < 380 ? 'small' : ''}
          />
          <Text
            fW="500"
            tA="center"
            c="primary"
            id="awaiting_payment"
            s={SCREEN_WIDTH < 380 ? 16 : 20}></Text>
        </View>
      </View>
    </View>
  );
}
