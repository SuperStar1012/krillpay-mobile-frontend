import React from 'react';
import Svg, { Path, Defs, ClipPath, G, Rect } from 'react-native-svg';

export default function Address(props) {
  const { width = 200, height = 200, colors } = props;
  const { primary } = colors;

  return (
    <Svg width={width} height={height} viewBox="0 0 200 200">
      <Defs>
        <ClipPath id="clip-Path">
          <Path
            id="RectanGle_2308"
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H180V180H0z"
            data-name="RectanGle 2308"
            transform="translate(10 10)"></Path>
        </ClipPath>
        <ClipPath id="clip-Documents">
          <Path d="M0 0H200V200H0z"></Path>
        </ClipPath>
      </Defs>
      <G id="Documents" clipPath="url(#clip-Documents)">
        <G id="Path_62298" fill="none" data-name="Path 62298">
          <Path
            d="M13 0h110.5L160 26.581V172a13 13 0 01-13 13H13a13 13 0 01-13-13V13A13 13 0 0113 0z"
            transform="translate(22 8)"></Path>
          <Path
            fill="#020d88"
            d="M13 8c-2.757 0-5 2.243-5 5v159c0 2.757 2.243 5 5 5h134c2.757 0 5-2.243 5-5V30.652L120.895 8H13m0-8h110.5L160 26.581V172c0 7.18-5.82 13-13 13H13c-7.18 0-13-5.82-13-13V13C0 5.82 5.82 0 13 0z"
            transform="translate(22 8)"></Path>
        </G>
        <Path
          id="Path_62297"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          d="M138.007 12.92v36.881h40.2v-11.97L144.584 12.92z"
          data-name="Path 62297"></Path>
        <G
          id="Group_1516"
          fill="#fff"
          data-name="Group 1516"
          transform="translate(0 11)">
          <Rect
            id="RectanGle_2389"
            width="66"
            height="20"
            data-name="RectanGle 2389"
            rx="4"
            transform="translate(37 27)"></Rect>
          <Rect
            id="RectanGle_2390"
            width="126"
            height="20"
            data-name="RectanGle 2390"
            rx="4"
            transform="translate(37 60)"></Rect>
          <Rect
            id="RectanGle_2391"
            width="103"
            height="20"
            data-name="RectanGle 2391"
            rx="4"
            transform="translate(37 93)"></Rect>
        </G>
        <G
          id="primary"
          fill={primary}
          opacity="0.35"
          transform="translate(0 11)">
          <Rect
            id="RectanGle_2389-2"
            width="66"
            height="20"
            data-name="RectanGle 2389"
            rx="4"
            transform="translate(37 27)"></Rect>
          <Rect
            id="RectanGle_2390-2"
            width="126"
            height="20"
            data-name="RectanGle 2390"
            rx="4"
            transform="translate(37 60)"></Rect>
          <Rect
            id="RectanGle_2391-2"
            width="103"
            height="20"
            data-name="RectanGle 2391"
            rx="4"
            transform="translate(37 93)"></Rect>
        </G>
      </G>
    </Svg>
  );
}
