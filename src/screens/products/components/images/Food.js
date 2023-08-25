import React from 'react';
import Svg, { Path, Defs, ClipPath, G, Rect } from 'react-native-svg';

export default function Food(props) {
  const { width, height, colors } = props;
  const { primary } = colors;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <Defs>
        <ClipPath id="clip-food">
          <Path d="M0 0H200V200H0z"></Path>
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-food)">
        <G
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-name="Path 62206">
          <Path
            d="M88.009-11.349c31.605 0 92.311 23.661 92.311 38.849S168.255 55 153.37 55H26.95C12.066 55 0 42.688 0 27.5s56.4-38.849 88.009-38.849z"
            transform="translate(9.679 50)"></Path>
          <Path
            fill="#020d88"
            d="M88.01-3.35C56.852-3.35 10.14 19.445 8 27.5 8 38.252 16.501 47 26.95 47h126.42c10.45 0 18.95-8.748 18.999-19.074-2.977-9.313-53.999-31.275-84.36-31.275m0-8c31.605 0 92.312 23.661 92.312 38.849 0 15.188-12.066 27.5-26.95 27.5H26.95C12.065 55 0 42.688 0 27.5s56.404-38.85 88.01-38.85z"
            transform="translate(9.679 50)"></Path>
        </G>
        <Rect
          width="180"
          height="29"
          fill={primary}
          opacity="0.35"
          rx="14.5"
          transform="translate(10 105)"></Rect>
        <G
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          data-name="Rectangle 2213">
          <Path
            stroke="none"
            d="M0 0h180v20a20 20 0 01-20 20H20A20 20 0 010 20V0z"
            transform="translate(10 134)"></Path>
          <Path
            d="M8 4h164a4 4 0 014 4v12a16 16 0 01-16 16H20A16 16 0 014 20V8a4 4 0 014-4z"
            transform="translate(10 134)"></Path>
        </G>
        <Path
          fill={primary}
          d="M1791.443 117.538l32.891 11.633-32.891 7.226z"
          data-name="primary"
          opacity="0.35"
          transform="translate(-1691 -109)"></Path>
        <Path
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeWidth="8"
          d="M99.84 12.419V49.81"
          data-name="Path 62209"></Path>
        <Rect
          width="22"
          height="11"
          fill="#020d88"
          data-name="Rectangle 2214"
          rx="5.5"
          transform="translate(87 73)"></Rect>
        <Rect
          width="22"
          height="11"
          fill="#020d88"
          data-name="Rectangle 2216"
          rx="5.5"
          transform="translate(31 73)"></Rect>
        <Rect
          width="22"
          height="11"
          fill="#020d88"
          data-name="Rectangle 2215"
          rx="5.5"
          transform="translate(55 59)"></Rect>
      </G>
    </Svg>
  );
}
