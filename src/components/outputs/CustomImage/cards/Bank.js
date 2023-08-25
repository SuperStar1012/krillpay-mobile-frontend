import React from 'react';
import Svg, { Path, Defs, ClipPath, G, Rect } from 'react-native-svg';

const Bank = props => {
  const { width = 150, height = 150, colors } = props;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <Defs>
        <ClipPath id="clip-bank">
          <Path d="M0 0H200V200H0z"></Path>
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-bank)">
        <Path
          fill={colors.primary}
          d="M0 0H25V65H0z"
          opacity="0.35"
          transform="translate(24 83)"></Path>
        <Path
          fill={colors.primary}
          d="M0 0H25V65H0z"
          data-name="primary"
          opacity="0.35"
          transform="translate(88 85)"></Path>
        <Path
          fill={colors.primary}
          d="M0 0H25V65H0z"
          data-name="primary"
          opacity="0.35"
          transform="translate(152 83)"></Path>
        <G
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2234"
          transform="translate(6 161)">
          <Rect width="187" height="24" stroke="none" rx="8"></Rect>
          <Rect width="179" height="16" x="4" y="4" rx="4"></Rect>
        </G>
        <G
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2235"
          transform="translate(13 48)">
          <Rect width="172" height="24" stroke="none" rx="8"></Rect>
          <Rect width="164" height="16" x="4" y="4" rx="4"></Rect>
        </G>
        <G
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2236">
          <Path
            stroke="none"
            d="M0 0h153v20a5 5 0 01-5 5H5a5 5 0 01-5-5V0z"
            transform="translate(24 64)"></Path>
          <Path
            d="M8 4h137a4 4 0 014 4v12a1 1 0 01-1 1H5a1 1 0 01-1-1V8a4 4 0 014-4z"
            transform="translate(24 64)"></Path>
        </G>
        <G
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2237">
          <Path
            stroke="none"
            d="M5 0h143a5 5 0 015 5v19H0V5a5 5 0 015-5z"
            transform="translate(24 145)"></Path>
          <Path
            d="M5 4h143a1 1 0 011 1v11a4 4 0 01-4 4H8a4 4 0 01-4-4V5a1 1 0 011-1z"
            transform="translate(24 145)"></Path>
        </G>
        <Path
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          d="M19.288 51.908l81.185-39.652 78.208 39.652z"
          data-name="Path 62223"></Path>
      </G>
    </Svg>
  );
};

export default Bank;
