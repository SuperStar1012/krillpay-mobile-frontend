import React from 'react';
import Svg, { Path, Defs, ClipPath, G, Circle } from 'react-native-svg';

export default function EmptyProducts(props) {
  const { width = 200, height = 200, colors } = props;
  const { primary } = colors;

  return (
    <Svg width={width} height={height} viewBox="0 0 200 200">
      <Defs>
        <ClipPath id="clip-No-notifications">
          <Path d="M0 0H200V200H0z"></Path>
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-No-notifications)">
        <G
          fill="none"
          stroke="#9a9a9a"
          strokeWidth="8"
          data-name="Group 1524"
          transform="translate(.394 1.049)">
          <Path
            d="M27.501 150.898H171.75s.206-15.913-18.17-27.271V75.388s-.367-55.81-53.76-55.79-52.353 55.79-52.353 55.79v48.242c-21.818 14.119-19.966 27.268-19.966 27.268z"
            data-name="Path 62311"></Path>
          <Path
            d="M73.606 150.901c.071 15.145 11.684 27.4 26 27.4s25.929-12.255 26-27.4z"
            data-name="Intersection 21"></Path>
        </G>
        <Circle
          cx="34.5"
          cy="34.5"
          r="34.5"
          fill="#fff"
          data-name="Ellipse 1114"
          transform="translate(122 13)"></Circle>
        <Circle
          cx="34.5"
          cy="34.5"
          r="34.5"
          fill={primary}
          opacity="0.35"
          transform="translate(122 13)"></Circle>
      </G>
    </Svg>
  );
}
