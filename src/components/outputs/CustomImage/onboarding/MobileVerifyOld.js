import React from 'react';
import Svg, {
  Path,
  Defs,
  ClipPath,
  G,
  LinearGradient,
  Stop,
  Rect,
} from 'react-native-svg';

const Mobile = props => {
  const { width = 150, height = 150 } = props;

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 500 500"
      {...props}>
      <Defs>
        <ClipPath id="prefix__c">
          <Path
            data-name="Rectangle 22"
            transform="translate(.107 -.39)"
            fill="#fff"
            stroke="#707070"
            d="M0 0h128v115H0z"
          />
        </ClipPath>
        <ClipPath id="prefix__a">
          <Path d="M0 0h500v500H0z" />
        </ClipPath>
        <LinearGradient
          id="prefix__b"
          x1={0.5}
          x2={0.5}
          y2={1.34}
          gradientUnits="objectBoundingBox">
          <Stop offset={0} stopColor="#80f1fa" />
          <Stop offset={1} stopColor="#fff" />
        </LinearGradient>
      </Defs>
      <G clipPath="url(#prefix__a)">
        <G data-name="Group 45">
          <G data-name="Group 44">
            <Rect
              data-name="Rectangle 29"
              width={202}
              height={368}
              rx={29}
              transform="translate(149 66)"
              fill="#d5d5d5"
            />
            <Rect
              data-name="Rectangle 30"
              width={187}
              height={353}
              rx={22}
              transform="translate(156 74)"
              fill="url(#prefix__b)"
            />
          </G>
          <Rect
            data-name="Rectangle 31"
            width={84}
            height={18}
            rx={9}
            transform="translate(208 66)"
            fill="#d5d5d5"
          />
        </G>
        <G
          data-name="Mask Group 10"
          transform="translate(185.893 182.39)"
          clipPath="url(#prefix__c)">
          <G data-name="Group 32">
            <Path
              data-name="Path 24"
              d="M106.777 42.856h-7.524v-9.575c0-18.486-15.752-33.525-35.114-33.525S29.025 14.795 29.025 33.281v9.575H21.5a2.452 2.452 0 00-2.508 2.4v59.867a9.823 9.823 0 0010.033 9.578h70.229a9.823 9.823 0 0010.032-9.579V45.256a2.452 2.452 0 00-2.509-2.4zM71.649 92.884a2.331 2.331 0 01-.625 1.862 2.563 2.563 0 01-1.869.8H59.123a2.563 2.563 0 01-1.869-.8 2.329 2.329 0 01-.625-1.862L58.211 79.3a9.345 9.345 0 01-4.105-7.7 10.043 10.043 0 0120.065 0 9.345 9.345 0 01-4.105 7.7zm12.555-50.028h-40.13v-9.575c0-10.563 9-19.157 20.065-19.157s20.065 8.594 20.065 19.157z"
              fill="#404040"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default Mobile;
