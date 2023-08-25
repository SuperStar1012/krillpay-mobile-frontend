import React from 'react';
import Svg, { Path, Defs, ClipPath, G } from 'react-native-svg';

export default function Address(props) {
  const { width = 200, height = 200, colors } = props;
  const { primary } = colors;

  return (
    <Svg width={width} height={height} viewBox="0 0 200 200">
      <Defs>
        <ClipPath id="clip-Path">
          <Path
            id="RectanGle_2308"
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H180V180H0z"
            data-name="RectanGle 2308"
            transform="translate(10 10)"></Path>
        </ClipPath>
        <ClipPath id="clip-Tier2">
          <Path d="M0 0H200V200H0z"></Path>
        </ClipPath>
      </Defs>
      <G id="Tier2" clipPath="url(#clip-Tier2)">
        <G id="PolyGon_30" fill="none" data-name="PolyGon 30">
          <Path
            d="M127.073 0a14 14 0 0112 6.8l36.6 61a14 14 0 010 14.406l-36.6 61a14 14 0 01-12 6.8H52.927a14 14 0 01-12-6.8l-36.6-61a14 14 0 010-14.406l36.6-61a14 14 0 0112-6.8z"
            transform="rotate(90 82.5 92.5)"></Path>
          <Path
            fill="#020d88"
            d="M52.927 8a6.03 6.03 0 00-5.145 2.913l-36.6 61a5.99 5.99 0 000 6.174l36.6 61A6.03 6.03 0 0052.927 142h74.146a6.03 6.03 0 005.145-2.913l36.6-61a5.989 5.989 0 000-6.174l-36.6-61A6.03 6.03 0 00127.073 8H52.927m0-8h74.146a14 14 0 0112.005 6.797l36.6 61a14 14 0 010 14.406l-36.6 61A14 14 0 01127.073 150H52.927a14 14 0 01-12.005-6.797l-36.6-61a14 14 0 010-14.406l36.6-61A14 14 0 0152.927 0z"
            transform="rotate(90 82.5 92.5)"></Path>
        </G>
        <Path
          id="Path_62300"
          fill="#fff"
          d="M25.317-12.8l15.617-14.748c9.506-8.827 11.349-14.841 11.349-21.437 0-12.319-10.088-20.079-25.22-20.079-12.222 0-21.728 4.947-26.963 12.61l11.446 7.372c3.3-4.559 8.245-6.79 14.065-6.79 7.178 0 10.864 3.1 10.864 8.439 0 3.3-1.067 6.79-7.081 12.513L3.2-10.185V0h51.314v-12.8z"
          data-name="Path 62300"
          transform="translate(72 135)"></Path>
        <Path
          id="primary"
          fill={primary}
          d="M25.317-12.8l15.617-14.748c9.506-8.827 11.349-14.841 11.349-21.437 0-12.319-10.088-20.079-25.22-20.079-12.222 0-21.728 4.947-26.963 12.61l11.446 7.372c3.3-4.559 8.245-6.79 14.065-6.79 7.178 0 10.864 3.1 10.864 8.439 0 3.3-1.067 6.79-7.081 12.513L3.2-10.185V0h51.314v-12.8z"
          opacity="0.35"
          transform="translate(72 135)"></Path>
      </G>
    </Svg>
  );
}
