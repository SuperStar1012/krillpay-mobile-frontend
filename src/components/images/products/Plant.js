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
        <ClipPath id="clip-plant">
          <Path d="M0 0H200V200H0z"></Path>
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-plant)">
        <Path
          fill={primary}
          d="M0 0h121v61a27 27 0 01-27 27H27A27 27 0 010 61V0z"
          opacity="0.35"
          transform="translate(40 106)"></Path>
        <G
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2231"
          transform="translate(29 93)">
          <Rect width="143" height="19" stroke="none" rx="9.5"></Rect>
          <Rect width="135" height="11" x="4" y="4" rx="5.5"></Rect>
        </G>
        <Path
          fill="none"
          stroke="#020d88"
          strokeWidth="7.998"
          d="M80.508 72.285c8.273-4.186 9.785-17.305.003-24.927s-37.038-6.585-37.038-6.585-4.226 19.846 5.555 27.468 23.209 8.23 31.48 4.044z"
          data-name="Path 62218"></Path>
        <Path
          fill="none"
          stroke="#020d88"
          strokeWidth="7.998"
          d="M120.521 46.279c-8.272-4.186-9.786-17.306-.004-24.929s37.038-6.585 37.038-6.585 4.227 19.846-5.555 27.468-23.207 8.232-31.479 4.046z"
          data-name="Path 62219"></Path>
        <Path
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeWidth="8"
          d="M100 96.31s-2.916-26.176 5.512-41.977 28.2-21.226 28.2-21.226"
          data-name="Path 62220"></Path>
        <Path
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeWidth="8"
          d="M67.5 57.817s11.47 5.16 20.191 9.629 12.32 13.527 12.32 13.527"
          data-name="Path 62221"></Path>
      </G>
    </Svg>
  );
}
