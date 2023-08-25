import React from 'react';
import Svg, { Path, Defs, ClipPath, G } from 'react-native-svg';

const UserVerifyPending = props => {
  const { width = 150, height = 150, colors } = props;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 100 100">
      <Defs>
        <ClipPath id="clip-path">
          <Path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H90V100H0z"
            data-name="Rectangle 2398"
            transform="translate(113 283)"></Path>
        </ClipPath>
        <ClipPath id="clip-Verify-pending">
          <Path d="M0 0H100V100H0z"></Path>
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-Verify-pending)">
        <G
          clipPath="url(#clip-path)"
          data-name="Mask Group 678"
          transform="translate(-108 -283)">
          <Path
            fill="none"
            stroke="#020d88"
            strokeWidth="5"
            d="M158 335a22.5 22.5 0 10-22.5-22.5A22.5 22.5 0 00158 335zm15.75 5.625h-2.936a30.6 30.6 0 01-25.629 0h-2.935a23.631 23.631 0 00-23.625 23.625v7.313a8.44 8.44 0 008.438 8.437h61.875a8.44 8.44 0 008.438-8.435v-7.315a23.631 23.631 0 00-23.626-23.625z"
            data-name="user-solid (1)"></Path>
        </G>
        <Path
          fill="#fff"
          d="M9.5 3.167v13.106h.02l-.02.022 8.19 8.716-8.19 8.737.02.022H9.5v13.084h24.569V33.77h-.02l.02-.022-8.19-8.738 8.19-8.716-.02-.022h.02V3.167z"
          data-name="Path 62509"
          transform="translate(62.431 53.146)"></Path>
        <Path
          fill={colors.primary}
          d="M9.5 3.167v13.106h.02l-.02.022 8.19 8.716-8.19 8.737.02.022H9.5v13.084h24.569V33.77h-.02l.02-.022-8.19-8.738 8.19-8.716-.02-.022h.02V3.167z"
          opacity="0.35"
          transform="translate(62.431 53.146)"></Path>
      </G>
    </Svg>
  );
};

export default UserVerifyPending;
