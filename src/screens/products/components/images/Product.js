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
        <ClipPath id="clip-Products">
          <Path d="M0 0H200V200H0z"></Path>
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-Products)">
        <G
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeWidth="8"
          data-name="Rectangle 2218">
          <Path
            stroke="none"
            d="M0 0h109v117a19 19 0 01-19 19H19a19 19 0 01-19-19V0z"
            transform="translate(34 49)"></Path>
          <Path
            d="M8 4h93a4 4 0 014 4v109a15 15 0 01-15 15H19a15 15 0 01-15-15V8a4 4 0 014-4z"
            transform="translate(34 49)"></Path>
        </G>
        <Path
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M62.03 76.573v-40.6s2-21.789 26.843-22.252 27.081 22.252 27.081 22.252v40.6"
          data-name="Path 62212"></Path>
        <Path
          fill="#fff"
          d="M0 0h85v72a19 19 0 01-19 19H19A19 19 0 010 72V0z"
          data-name="Rectangle 2219"
          transform="translate(100 94)"></Path>
        <Path
          fill={primary}
          d="M0 0h85v72a19 19 0 01-19 19H19A19 19 0 010 72V0z"
          opacity="0.35"
          transform="translate(100 94)"></Path>
        <Path
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M160.091 107.715v17.964s-1.3 9.641-17.524 9.846-17.679-9.846-17.679-9.846v-17.964"
          data-name="Path 62213"></Path>
      </G>
    </Svg>
  );
}
