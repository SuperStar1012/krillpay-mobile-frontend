import React from 'react';
import Svg, { Path, Defs, ClipPath, G, Circle } from 'react-native-svg';

export default function EmptyProducts(props) {
  const { width = 200, height = 200, colors } = props;
  const { primary } = colors;

  return (
    <Svg width={width} height={height} viewBox="0 0 200 200">
      <Defs>
        <ClipPath id="clip-No_products">
          <Path d="M0 0H200V200H0z"></Path>
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-No_products)" data-name="No products">
        <Path
          fill="none"
          stroke="#9a9a9a"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M9.317 35.034H34.4l23.639 115.894h99.031"
          data-name="Path 62230"></Path>
        <Path
          fill="none"
          stroke="#9a9a9a"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M39.667 60.061h141.756l-9.515 56.471s-1.789 11.011-7.788 16.121-16.208 4.319-16.208 4.319h-92.67z"
          data-name="Path 62231"></Path>
        <G
          fill="none"
          stroke="#9a9a9a"
          strokeWidth="8"
          data-name="Ellipse 1109"
          transform="translate(49 147)">
          <Circle cx="17" cy="17" r="17" stroke="none"></Circle>
          <Circle cx="17" cy="17" r="13"></Circle>
        </G>
        <G
          fill="none"
          stroke="#9a9a9a"
          strokeWidth="8"
          data-name="Ellipse 1110"
          transform="translate(128 147)">
          <Circle cx="17" cy="17" r="17" stroke="none"></Circle>
          <Circle cx="17" cy="17" r="13"></Circle>
        </G>
        <Path
          fill={primary}
          d="M1207.649 2887.046l10.087 53.742h86.732l12.776-53.742z"
          opacity="0.35"
          transform="translate(-1151.841 -2815)"></Path>
      </G>
    </Svg>
  );
}
