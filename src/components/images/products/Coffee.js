import React from 'react';
import Svg, { Path, Defs, ClipPath, G, Rect } from 'react-native-svg';

export default function Coffee(props) {
  const { width, height, colors } = props;
  const { primary } = colors;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <Defs>
        <ClipPath id="clip-coffee">
          <Path d="M0 0H200V200H0z"></Path>
        </ClipPath>
      </Defs>
      <G id="coffee" clipPath="url(#clip-coffee)">
        <G id="Path_62222" fill="none" data-name="Path 62222">
          <Path
            d="M-14.743-2.93H88.1L75.035 116c0 8.284-5.444 15-12.16 15H9.369c-6.716 0-12.16-6.716-12.16-15z"
            transform="translate(63.743 52)"></Path>
          <Path
            fill="#020d88"
            d="M-5.901 5.07L5.209 116c0 3.942 2.236 7 4.16 7h53.506c1.924 0 4.16-3.058 4.208-7.874L79.173 5.07H-5.9m-8.842-8H88.101L75.035 116c0 8.284-5.444 15-12.16 15H9.369c-6.716 0-12.16-6.716-12.16-15L-14.743-2.93z"
            transform="translate(63.743 52)"></Path>
        </G>
        <G
          id="Rectangle_2232"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2232"
          transform="translate(41 32)">
          <Rect width="118" height="25" stroke="none" rx="8"></Rect>
          <Rect width="110" height="17" x="4" y="4" rx="4"></Rect>
        </G>
        <G
          id="Rectangle_2233"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2233"
          transform="translate(54 17)">
          <Rect width="93" height="21" stroke="none" rx="8"></Rect>
          <Rect width="85" height="13" x="4" y="4" rx="4"></Rect>
        </G>
        <Circle
          id="primary"
          cx="27.5"
          cy="27.5"
          r="27.5"
          fill={primary}
          opacity="0.35"
          transform="translate(73 82)"></Circle>
      </G>
    </Svg>
  );
}
