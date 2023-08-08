import React from 'react';
import { View } from '../layout/View';
import LottieImage from 'components/outputs/LottieImage';

export default function StateAnimation(props) {
  let { state = '', m = -0.75, ...restProps } = props;

  const image = state === 'success' ? state : 'error';

  return (
    <View m={m}>
      <LottieImage
        name={image}
        color={image}
        size={200}
        loop={false}
        {...restProps}
      />
    </View>
  );
}
