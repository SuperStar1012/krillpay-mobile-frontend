import React from 'react';
import Svg, { Path, Defs, G, Rect, ClipPath } from 'react-native-svg';

const UserDocFailed = props => {
  const { width = 150, height = 150 } = props;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <Defs>
        <ClipPath id="clip-path">
          <Path
            id="Rectangle_3340"
            d="M0 0H200V200H0z"
            data-name="Rectangle 3340"></Path>
        </ClipPath>
        <ClipPath id="clip-path-2">
          <Path
            id="Rectangle_3339"
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H70V70H0z"
            data-name="Rectangle 3339"
            transform="translate(67 30)"></Path>
        </ClipPath>
      </Defs>
      <G id="failed-doc" clipPath="url(#clip-path)">
        <G
          id="Rectangle_2461"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2461"
          transform="translate(22 8)">
          <Rect width="160" height="185" stroke="none" rx="13"></Rect>
          <Rect width="152" height="177" x="4" y="4" rx="9"></Rect>
        </G>
        <G
          id="Group_1516"
          fill="#fff"
          data-name="Group 1516"
          transform="translate(0 53)">
          <Rect
            id="Rectangle_2390"
            width="126"
            height="20"
            data-name="Rectangle 2390"
            rx="4"
            transform="translate(37 60)"></Rect>
          <Rect
            id="Rectangle_2391"
            width="103"
            height="20"
            data-name="Rectangle 2391"
            rx="4"
            transform="translate(37 93)"></Rect>
        </G>
        <G id="error" fill="#ff4c6f" opacity="0.35" transform="translate(0 53)">
          <Rect
            id="Rectangle_2390-2"
            width="126"
            height="20"
            data-name="Rectangle 2390"
            rx="4"
            transform="translate(37 60)"></Rect>
          <Rect
            id="Rectangle_2391-2"
            width="103"
            height="20"
            data-name="Rectangle 2391"
            rx="4"
            transform="translate(37 93)"></Rect>
        </G>
        <G
          id="Mask_Group_1578"
          clipPath="url(#clip-path-2)"
          data-name="Mask Group 1578">
          <G id="error_outline_black_24dp" transform="translate(67 30)">
            <Path
              id="Path_62890"
              fill="none"
              d="M0 0h70v70H0z"
              data-name="Path 62890"></Path>
            <Path
              id="Path_62891"
              fill="#ff4c6f"
              d="M32.083 43.75h5.833v5.833h-5.833zm0-23.333h5.833v17.5h-5.833zm2.888-14.584A29.167 29.167 0 1064.167 35 29.152 29.152 0 0034.971 5.833zm.029 52.5A23.333 23.333 0 1158.333 35 23.327 23.327 0 0135 58.333z"
              data-name="Path 62891"></Path>
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default UserDocFailed;
