import React from 'react';
import Svg, { Path, Defs, ClipPath, Circle, G } from 'react-native-svg';
import { View } from 'react-native';

export default function Success(props) {
  const { width, colors } = props;
  const { primary } = colors;

  return (
    <View>
      <Svg
        height={width}
        width={width}
        data-name="Layer 1"
        viewBox={`0 0 ${width} ${width}`}>
        <Defs>
          <ClipPath id="prefix__a">
            <Path
              data-name="Rectangle 149"
              fill="#fff"
              stroke="#707070"
              strokeWidth={0.258}
              d="M0 0h127.234v121.33H0z"
            />
          </ClipPath>
        </Defs>
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
            fill="#7de589"
          />
          <G
            data-name="Mask Group 19"
            transform="translate(123 353.697)"
            clipPath="url(#prefix__a)">
            <Path
              data-name="Path 288"
              d="M5.89.121h115.584v121.345H5.89z"
              fill="none"
            />
            <Path
              data-name="Path 289"
              d="M49.232 82.028L29.008 60.792l-6.743 7.079 26.967 28.314 57.794-60.672-6.742-7.079z"
              fill="#fff"
            />
          </G>
        </G>
      </Svg>
    </View>
  );
}
