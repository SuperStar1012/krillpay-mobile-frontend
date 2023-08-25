import React from 'react';
import Svg, { Path, Defs, ClipPath, G, Rect } from 'react-native-svg';

export default function Data(props) {
  const { width, height, colors } = props;
  const { primary } = colors;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <Defs>
        <ClipPath id="clip-data">
          <Path d="M0 0H200V200H0z"></Path>
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-data)">
        <G data-name="data" transform="translate(-91 -177)">
          <G fill="none" data-name="Path 62197">
            <Path
              d="M14.517 0h80.329a14.765 14.765 0 0114.517 15v170a14.765 14.765 0 01-14.517 15H14.517A14.765 14.765 0 010 185V15A14.765 14.765 0 0114.517 0z"
              transform="translate(136.636 177)"></Path>
            <Path
              fill="#020d88"
              d="M14.517 8C10.924 8 8 11.14 8 15v170c0 3.86 2.924 7 6.517 7h80.33c3.593 0 6.517-3.14 6.517-7V15c0-3.86-2.924-7-6.518-7H14.517m0-8h80.33c8.017 0 14.517 6.716 14.517 15v170c0 8.284-6.5 15-14.518 15H14.517C6.5 200 0 193.284 0 185V15C0 6.716 6.5 0 14.517 0z"
              transform="translate(136.636 177)"></Path>
          </G>
          <Rect
            width="49"
            height="15"
            fill="#020d88"
            data-name="Rectangle 2207"
            rx="7.5"
            transform="translate(167 177)"></Rect>
          <Path
            fill={primary}
            d="M-227.572-27.287L-234-38h-23a8 8 0 01-8-8v-55a8 8 0 018-8h64a8 8 0 018 8v55a8 8 0 01-8 8h-23l-6.428 10.713A2.973 2.973 0 01-225-25.831a2.973 2.973 0 01-2.572-1.456z"
            opacity="0.35"
            transform="translate(417 344)"></Path>
          <Path
            fill="#020288"
            d="M91.961 101.341a3.906 3.906 0 00-6.071 4.916 16.807 16.807 0 009.7 5.54v.088a3.906 3.906 0 007.807.2c6.323-.964 10.778-5.044 11.486-10.643.805-6.373-3.369-12.49-10.151-14.874q-.693-.244-1.33-.471v-9.992a4.339 4.339 0 011.927 1.383 3.906 3.906 0 006.384-4.5 13.01 13.01 0 00-8.311-4.963v-.316a3.906 3.906 0 00-7.813 0v.6q-.621.148-1.256.338a12.064 12.064 0 00-8.261 10.581c-.357 4.829 2.219 9.02 6.89 11.211.592.278 1.491.652 2.627 1.1v12.185a8.052 8.052 0 01-3.631-2.372zm15.173-.878c-.225 1.778-1.555 3.058-3.73 3.655v-9.636c2.883 1.498 3.975 4.043 3.73 5.981zM93.866 79.8a4.463 4.463 0 011.725-3.168v6.355a3.307 3.307 0 01-1.725-3.187z"
            data-name="Path 62198"
            transform="translate(92 182)"></Path>
        </G>
      </G>
    </Svg>
  );
}
