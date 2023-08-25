import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { View } from 'react-native';

export default function Error(props) {
  const { width, colors } = props;
  const { primary } = colors;

  return (
    <View>
      <Svg
        height={width}
        width={width}
        data-name="Layer 1"
        viewBox={`0 0 ${width} ${width}`}>
        <G transform="translate(-67 -294.207)">
          <Circle
            cx={120}
            cy={120}
            r={120}
            transform="translate(67 294.207)"
            fill={primary}
            opacity={0.3}
          />
          <Circle
            data-name="primary"
            cx={100}
            cy={100}
            r={100}
            transform="translate(87 314.542)"
            fill={primary}
            opacity={0.4}
          />
          <Path
            data-name="Path 290"
            d="M187 343.882a70 70 0 11-70 70 70 70 0 0170-70z"
            fill="#fd6666"
          />
          <Path
            data-name="Rectangle 151"
            fill="#fff"
            d="M179.492 369.592h15.818v55.512h-15.818z"
          />
          <Path
            data-name="Rectangle 152"
            fill="#fff"
            d="M179.492 440.437h15.818v18.205h-15.818z"
          />
        </G>
      </Svg>
    </View>
  );
}
