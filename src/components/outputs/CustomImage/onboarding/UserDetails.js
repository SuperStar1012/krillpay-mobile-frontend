import React from 'react';
import Svg, { Path, Defs, ClipPath, G } from 'react-native-svg';

const UserDetails = props => {
  const { width = 150, height = 150, colors, primary, primaryContrast } = props;

  return (
    <Svg width={width} height={height} viewBox={`0 0 100 100`} {...props}>
      <Defs>
        <ClipPath id="clip-path">
          <Path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H50V50H0z"
            data-name="Rectangle 1199"></Path>
        </ClipPath>
      </Defs>
      <G transform="translate(-113 -86)">
        <Path
          fill={primary ?? colors.primary}
          d="M50 0A50 50 0 110 50 50 50 0 0150 0z"
          transform="translate(113 86)"></Path>
        <G data-name="Group 841" transform="translate(138 110.857)">
          <G clipPath="url(#clip-path)" data-name="Mask Group 479">
            <Path
              fill={primaryContrast ?? colors.primaryContrast}
              d="M21.849 24.89A12.445 12.445 0 109.364 12.445 12.464 12.464 0 0021.849 24.89zm8.74 3.11H28.96a17.029 17.029 0 01-14.221 0h-1.63A13.092 13.092 0 000 41.068v4.045a4.676 4.676 0 004.682 4.667h34.334a4.676 4.676 0 004.684-4.668v-4.044A13.092 13.092 0 0030.589 28z"
              data-name="user-solid (1)"
              transform="translate(3.181)"></Path>
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default UserDetails;
