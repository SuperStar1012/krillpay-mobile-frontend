import React from 'react';
import Svg, { Path, Defs, ClipPath, G, Circle } from 'react-native-svg';

const UserVerifySuccess = props => {
  const { width = 150, height = 150 } = props;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 100 100">
      <Defs>
        <ClipPath id="clip-path">
          <Path d="M0 0H100V100H0z" data-name="Rectangle 2585"></Path>
        </ClipPath>
        <ClipPath id="clip-path-2">
          <Path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H90V100H0z"
            data-name="Rectangle 2398"
            transform="translate(113 283)"></Path>
        </ClipPath>
        <ClipPath id="clip-path-3">
          <Path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H40V40H0z"
            data-name="Rectangle 2399"
            transform="translate(203 283)"></Path>
        </ClipPath>
        <ClipPath id="clip-path-4">
          <Path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H38V39H0z"
            data-name="Rectangle 2583"
            transform="translate(997 23861)"></Path>
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-path)">
        <G clipPath="url(#clip-path)">
          <G data-name="verify" transform="translate(174 9418)">
            <G
              clipPath="url(#clip-path-2)"
              data-name="Mask Group 678"
              transform="translate(-286 -9703)">
              <Path
                fill="none"
                stroke="#020d88"
                strokeWidth="5"
                d="M158 335a22.5 22.5 0 10-22.5-22.5A22.5 22.5 0 00158 335zm15.75 5.625h-2.936a30.6 30.6 0 01-25.629 0h-2.935a23.631 23.631 0 00-23.625 23.625v7.313a8.44 8.44 0 008.438 8.437h61.875a8.44 8.44 0 008.438-8.435v-7.315a23.631 23.631 0 00-23.626-23.625z"
                data-name="user-solid (1)"></Path>
            </G>
            <G
              clipPath="url(#clip-path-3)"
              data-name="Mask Group 679"
              transform="translate(-318 -9643)">
              <G transform="translate(195.099 275.099)">
                <Circle
                  cx="20"
                  cy="20"
                  r="20"
                  fill="#fff"
                  data-name="Ellipse 1101"
                  transform="translate(7.901 7.901)"></Circle>
                <Circle
                  cx="20"
                  cy="20"
                  r="20"
                  fill="#24a070"
                  transform="translate(7.901 7.901)"></Circle>
                <Path
                  fill="#fff"
                  d="M25.949 35.507a1.95 1.95 0 01-1.4-.593l-6.342-6.534a1.951 1.951 0 112.8-2.718L25.9 30.7l8.85-9.765a1.952 1.952 0 112.893 2.62L27.4 34.867a1.954 1.954 0 01-1.416.64z"
                  data-name="Path 62340"></Path>
              </G>
            </G>
          </G>
        </G>
        <G
          clipPath="url(#clip-path-4)"
          data-name="Mask Group 767"
          transform="translate(-1004 -23803)">
          <G transform="translate(997 23861.5)">
            <Path fill="none" d="M0 0h38v38H0z" data-name="Path 62507"></Path>
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default UserVerifySuccess;
