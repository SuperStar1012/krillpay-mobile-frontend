import React from 'react';
import Svg, { Path, Defs, ClipPath, G, Circle } from 'react-native-svg';

const UserVerify = props => {
  const { width = 150, height = 150, colors } = props;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 100 100"
      {...props}>
      <Defs>
        <ClipPath id="prefix__b">
          <Path
            data-name="Rectangle 2398"
            transform="translate(113 283)"
            fill="#fff"
            stroke="#707070"
            d="M0 0h90v100H0z"
          />
        </ClipPath>
        <ClipPath id="prefix__c">
          <Path
            data-name="Rectangle 2399"
            transform="translate(203 283)"
            fill="#fff"
            stroke="#707070"
            d="M0 0h40v40H0z"
          />
        </ClipPath>
        <ClipPath id="prefix__a">
          <Path d="M0 0h100v100H0z" />
        </ClipPath>
      </Defs>
      <G data-name="verify" clipPath="url(#prefix__a)">
        <G
          data-name="Mask Group 678"
          transform="translate(-112 -285)"
          clipPath="url(#prefix__b)">
          <Path
            data-name="user-solid (1)"
            d="M158 335a22.5 22.5 0 10-22.5-22.5A22.5 22.5 0 00158 335zm15.75 5.625h-2.936a30.6 30.6 0 01-25.629 0h-2.935a23.631 23.631 0 00-23.625 23.625v7.313a8.44 8.44 0 008.438 8.437h61.875a8.44 8.44 0 008.438-8.437v-7.313a23.631 23.631 0 00-23.626-23.625z"
            fill="none"
            stroke="#020d88"
            strokeWidth={5}
          />
        </G>
        <G
          data-name="Mask Group 679"
          transform="translate(-144 -225)"
          clipPath="url(#prefix__c)">
          <G transform="translate(195.099 275.099)">
            <Circle
              data-name="Ellipse 1101"
              cx={20}
              cy={20}
              r={20}
              transform="translate(7.901 7.901)"
              fill="#fff"
            />
            <Circle
              cx={20}
              cy={20}
              r={20}
              transform="translate(7.901 7.901)"
              fill={colors.primary}
              opacity={0.35}
            />
            <Path
              data-name="Path 62340"
              d="M25.949 35.507a1.95 1.95 0 01-1.4-.593l-6.342-6.534a1.951 1.951 0 112.8-2.718L25.9 30.7l8.85-9.765a1.952 1.952 0 112.893 2.62L27.4 34.867a1.954 1.954 0 01-1.416.64z"
              fill="#fff"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default UserVerify;
