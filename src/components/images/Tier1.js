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
        <ClipPath id="clip-Tier1">
          <Path d="M0 0H200V200H0z"></Path>
        </ClipPath>
      </Defs>
      <G id="Tier1" clipPath="url(#clip-Tier1)">
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
          id="Path_62299"
          fill="#fff"
          d="M.679-67.9v12.61h13.58V0h15.714v-67.9z"
          data-name="Path 62299"
          transform="translate(81 135)"></Path>
        <Path
          id="primary"
          fill={primary}
          d="M.679-67.9v12.61h13.58V0h15.714v-67.9z"
          opacity="0.35"
          transform="translate(81 135)"></Path>
      </G>
    </Svg>
  );
}
