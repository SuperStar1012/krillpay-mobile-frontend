import React from 'react';
import Svg, { Path, Defs, ClipPath, G, Rect } from 'react-native-svg';

export default function Address(props) {
  const { width = 200, height = 200, colors } = props;
  const { primary } = colors;

  return (
    <Svg width={width} height={height} viewBox="0 0 200 200">
      <Defs>
        <ClipPath id="clip-path">
          <Path
            id="Rectangle_2380"
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H75V75H0z"
            data-name="Rectangle 2380"
            transform="translate(63 63)"></Path>
        </ClipPath>
        <ClipPath id="clip-OTP">
          <Path d="M0 0H200V200H0z"></Path>
        </ClipPath>
      </Defs>
      <G id="OTP" clipPath="url(#clip-OTP)">
        <G id="data" transform="translate(-91 -177)">
          <G id="Path_62197" fill="none" data-name="Path 62197">
            <Path
              d="M14.517 0h80.329a14.765 14.765 0 0114.517 15v170a14.765 14.765 0 01-14.517 15H14.517A14.765 14.765 0 010 185V15A14.765 14.765 0 0114.517 0z"
              transform="translate(136.636 177)"></Path>
            <Path
              fill="#020d88"
              d="M14.517 8C10.924 8 8 11.14 8 15v170c0 3.86 2.924 7 6.517 7h80.33c3.593 0 6.517-3.14 6.517-7V15c0-3.86-2.924-7-6.518-7H14.517m0-8h80.33c8.017 0 14.517 6.716 14.517 15v170c0 8.284-6.5 15-14.518 15H14.517C6.5 200 0 193.284 0 185V15C0 6.716 6.5 0 14.517 0z"
              transform="translate(136.636 177)"></Path>
          </G>
          <Rect
            id="Rectangle_2207"
            width="49"
            height="15"
            fill="#020d88"
            data-name="Rectangle 2207"
            rx="7.5"
            transform="translate(167 177)"></Rect>
        </G>
        <G
          id="Mask_Group_611"
          clipPath="url(#clip-path)"
          data-name="Mask Group 611">
          <G id="https-24px" transform="translate(63 63)">
            <Path
              id="Path_62277"
              fill="none"
              d="M0 0h75v75H0z"
              data-name="Path 62277"></Path>
          </G>
        </G>
        <Path
          id="primary"
          fill={primary}
          d="M56.25 25h-3.125v-6.25a15.625 15.625 0 00-31.25 0V25H18.75a6.268 6.268 0 00-6.25 6.25V62.5a6.268 6.268 0 006.25 6.25h37.5a6.268 6.268 0 006.25-6.25V31.25A6.268 6.268 0 0056.25 25zm-9.062 0H27.812v-6.25a9.688 9.688 0 0119.375 0z"
          opacity="0.4"
          transform="translate(62.5 64.063)"></Path>
      </G>
    </Svg>
  );
}
