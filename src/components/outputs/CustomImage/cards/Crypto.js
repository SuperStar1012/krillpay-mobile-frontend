import React from 'react';
import Svg, { Path, Defs, ClipPath, G, Rect, Circle } from 'react-native-svg';

const Crypto = props => {
  const { width = 150, height = 150, colors } = props;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <Defs>
        <ClipPath id="clip-crypto-general">
          <Path d="M0 0H200V200H0z"></Path>
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-crypto-general)">
        <G
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Ellipse 42"
          transform="translate(5 5)">
          <Circle cx="95" cy="95" r="95" stroke="none"></Circle>
          <Circle cx="95" cy="95" r="91"></Circle>
        </G>
        <Circle
          cx="75"
          cy="75"
          r="75"
          fill={colors.primary}
          opacity="0.35"
          transform="translate(25 25)"></Circle>
        <Rect
          width="8"
          height="13"
          fill="#020d88"
          data-name="Rectangle 2243"
          rx="4"
          transform="translate(91.776 69)"></Rect>
        <Rect
          width="8"
          height="13"
          fill="#020d88"
          data-name="Rectangle 2246"
          rx="4"
          transform="translate(91.776 118)"></Rect>
        <Rect
          width="8"
          height="13"
          fill="#020d88"
          data-name="Rectangle 2244"
          rx="4"
          transform="translate(103.776 69)"></Rect>
        <Rect
          width="8"
          height="13"
          fill="#020d88"
          data-name="Rectangle 2245"
          rx="4"
          transform="translate(103.776 118)"></Rect>
        <Path
          fill="#020d88"
          d="M27.959 3.5c8.234 0 15.051-2.852 19.505-8.1A4.436 4.436 0 0046.3-9.792a5.371 5.371 0 00-5.86-1.034 15.308 15.308 0 01-11.879 5.38c-8.842 0-15.118-5.964-15.118-14.52s6.277-14.52 15.118-14.52A15.461 15.461 0 0140.44-29.17a5.976 5.976 0 005.86-1.284c2.724-2.47 1.16-4.939 1.16-4.939-4.455-5.186-11.271-8.038-19.438-8.038-14.713 0-25.647 9.788-25.647 23.466S13.313 3.5 27.959 3.5z"
          data-name="Path 62310"
          transform="translate(74.855 119.966)"></Path>
      </G>
    </Svg>
  );
};

export default Crypto;
