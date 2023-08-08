import React from 'react';
import { Image, Dimensions } from 'react-native';

import { View } from 'components/layout/View';
import Referral from '../../../../components/images/Referral';
import { useTheme } from 'components/context';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CustomImage(props) {
  const {
    width = SCREEN_WIDTH / 2,
    height = SCREEN_WIDTH / 3,
    card,
    rem,
    padded,
    name,
  } = props;

  const { colors } = useTheme();

  function renderSVG() {
    const w = padded ? width - 2 * rem * padded : width;
    const h = height ? height : card ? w / 2.5 : w;

    const imageProps = { width: w, height: h, colors };

    switch (name) {
      case 'referral':
        return <Referral {...imageProps} />;

      default:
        return <Image style={{ width: w, height: h }} source={{ uri: name }} />;
    }
  }

  return (
    <View
      style={[
        {
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        },
        props.containerStyle,
      ]}>
      {renderSVG()}
    </View>
  );
}
