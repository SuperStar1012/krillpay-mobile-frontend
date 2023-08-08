import React from 'react';
import { Image, Dimensions } from 'react-native';
import image from '../../../../../assets/icons/request.png';
import Svg, { Path, Defs, ClipPath, G } from 'react-native-svg';

const Success = props => {
  const { width = 150, height = 150, colors, primary, primaryContrast } = props;

  return (
    <Image
      source={image}
      style={{
        width: 120,
        height: 120,
      }}
      resizeMode="contain"
    />
  );
};

export default Success;
