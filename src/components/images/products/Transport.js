import React from 'react';
import Svg, { Path, Defs, ClipPath, G, Circle } from 'react-native-svg';

export default function Transport(props) {
  const { width, height, colors } = props;
  const { primary } = colors;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <Defs>
        <ClipPath id="clip-transport">
          <Path d="M0 0H200V200H0z"></Path>
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-transport)">
        <Path
          fill={primary}
          d="M2016.031 198.814h87.834s16.37-25.607 14.078-25.607-31.213-11.97-56.691-5.569-45.221 31.176-45.221 31.176z"
          opacity="0.35"
          transform="translate(-1960 -109)"></Path>
        <Path
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          d="M9.184 132.553h19.611s1.063-18.2 19.777-18.943 20.1 18.943 20.1 18.943h63.384s.691-19.046 19.373-18.943 19.13 18.943 19.13 18.943h19.3s.7-25.958 0-38.772-3.246-14.021-12.406-20.291-26.1-16.654-58.824-16.946-63.544 29.68-63.544 29.68-22.019 4.72-34.21 9.443-11.691 9.642-11.691 9.642z"
          data-name="Path 62210"></Path>
        <G
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Ellipse 34"
          transform="translate(27 110)">
          <Circle cx="22" cy="22" r="22" stroke="none"></Circle>
          <Circle cx="22" cy="22" r="18"></Circle>
        </G>
        <G
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Ellipse 35"
          transform="translate(129 110)">
          <Circle cx="22" cy="22" r="22" stroke="none"></Circle>
          <Circle cx="22" cy="22" r="18"></Circle>
        </G>
      </G>
    </Svg>
  );
}
