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
      viewBox="0 0 250 250">
      <Defs>
        <ClipPath id="clip-Product-placeholder">
          <Path d="M0 0H250V250H0z"></Path>
        </ClipPath>
      </Defs>
      <G id="Product-placeholder" clipPath="url(#clip-Product-placeholder)">
        <G
          id="Rectangle_2218"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeWidth="8"
          data-name="Rectangle 2218">
          <Path
            stroke="none"
            d="M0 0h109v117a19 19 0 01-19 19H19a19 19 0 01-19-19V0z"
            transform="translate(49.5 74.642)"></Path>
          <Path
            d="M8 4h93a4 4 0 014 4v109a15 15 0 01-15 15H19a15 15 0 01-15-15V8a4 4 0 014-4z"
            transform="translate(49.5 74.642)"></Path>
        </G>
        <Path
          id="Path_62212"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M77.53 102.215v-40.6s2-21.789 26.843-22.252 27.081 22.252 27.081 22.252v40.6"
          data-name="Path 62212"></Path>
        <Path
          id="Rectangle_2219"
          fill="#fff"
          d="M0 0h85v72a19 19 0 01-19 19H19A19 19 0 010 72V0z"
          data-name="Rectangle 2219"
          transform="translate(115.5 119.642)"></Path>
        <Path
          id="primary"
          fill={primary}
          d="M0 0h85v72a19 19 0 01-19 19H19A19 19 0 010 72V0z"
          opacity="0.35"
          transform="translate(115.5 119.642)"></Path>
        <Path
          id="Path_62213"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M175.591 133.357v17.964s-1.3 9.641-17.524 9.846-17.679-9.846-17.679-9.846v-17.964"
          data-name="Path 62213"></Path>
      </G>
    </Svg>
  );
}
