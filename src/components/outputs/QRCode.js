import React from 'react';
import RNQRCode from 'react-native-qrcode-svg';
import { View } from '../layout/View';
import { Spinner } from './Spinner';

export default function QRCode(props) {
  const { encUrl, width = 200, ...restProps } = props;

  return (
    <View
      style={{ position: 'relative' }}
      jC={'center'}
      w={'100%'}
      h={width + 32}
      {...restProps}>
      <Spinner />
      <View
        style={{ position: 'absolute', left: 0, right: 0 }}
        w={'100%'}
        h={'100%'}
        p={1}>
        <View f={1} jC={'center'} aI={'center'}>
          <RNQRCode value={encUrl} size={width} />
        </View>
      </View>
    </View>
  );
}
