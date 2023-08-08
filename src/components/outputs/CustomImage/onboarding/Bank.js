import React from 'react';
import Svg, { Path, Defs, ClipPath, G } from 'react-native-svg';

const Address = props => {
  const { width = 150, height = 150 } = props;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 150 150"
      {...props}>
      <Defs>
        <ClipPath id="prefix__a">
          <Path
            data-name="Rectangle 1236"
            transform="translate(113 75)"
            fill="#fff"
            stroke="#707070"
            d="M0 0h150v150H0z"
          />
        </ClipPath>
      </Defs>
      <G
        data-name="Mask Group 499"
        clipPath="url(#prefix__a)"
        transform="translate(-113 -75)">
        <Path
          data-name="Path 61835"
          d="M146.86 213.281h-17.577v-77.243h17.577zm0 0"
          fill="#848484"
        />
        <Path
          data-name="Path 61836"
          d="M180.146 213.281h-17.578v-77.243h17.578zm0 0"
          fill="#848484"
        />
        <Path
          data-name="Path 61837"
          d="M213.432 213.281h-17.578v-77.243h17.578zm0 0"
          fill="#848484"
        />
        <Path
          data-name="Path 61838"
          d="M246.717 213.281H229.14v-77.243h17.577zm0 0"
          fill="#848484"
        />
        <Path
          data-name="Path 61839"
          d="M248.183 144.827H127.818a4.394 4.394 0 01-4.395-4.395v-17.576a4.394 4.394 0 014.395-4.395h120.365a4.395 4.395 0 014.395 4.395v17.577a4.395 4.395 0 01-4.395 4.394zm0 0"
          fill="#cecece"
        />
        <Path
          data-name="Path 61841"
          d="M258.6 225H117.4a4.394 4.394 0 01-4.4-4.395v-11.718a4.394 4.394 0 014.4-4.395h141.2a4.394 4.394 0 014.4 4.395v11.719a4.394 4.394 0 01-4.4 4.394zm0 0"
          fill="#cecece"
        />
        <Path
          data-name="Path 61843"
          d="M258.605 122.855h-141.21L188 79.395zm0 0"
          fill="#cecece"
        />
        <Path
          data-name="Path 61845"
          d="M258.605 127.249h-141.21a4.395 4.395 0 01-2.3-8.137l70.605-43.46a4.394 4.394 0 014.607 0l70.605 43.46a4.394 4.394 0 01-2.3 8.137zm-125.688-8.789h110.166L188 84.555zm0 0"
          fill="#e6e6e6"
        />
        <Path
          data-name="Path 61847"
          d="M190.988 109.637h-5.976a4.395 4.395 0 110-8.789h5.976a4.395 4.395 0 110 8.789zm0 0"
          fill="#848484"
        />
      </G>
      <Path
        data-name="Intersection 4"
        d="M75.5 149.5v-20.01h7.354V69.825H75.5V.499h1.536c.089.048.179.1.266.152l70.605 43.46a4.406 4.406 0 011.59 1.7v4.081a4.4 4.4 0 01-3.893 2.354h-6.03V65.43a4.393 4.393 0 01-4.392 4.395h-1.467v59.665H145.6a4.4 4.4 0 013.9 2.356v15.794a4.424 4.424 0 01-1.859 1.859zm24.929-20.01h15.71V69.825h-15.71z"
        opacity={0.1}
      />
    </Svg>
  );
};

export default Address;
