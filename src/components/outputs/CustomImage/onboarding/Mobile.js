import React from 'react';
import Svg, {
  Path,
  Defs,
  ClipPath,
  G,
  LinearGradient,
  Ellipse,
  Stop,
  Rect,
} from 'react-native-svg';

const Mobile = props => {
  const { width = 150, height = 150 } = props;

  return (
    <Svg width={width} height={height} viewBox="0 0 100 100" {...props}>
      <Defs>
        <ClipPath id="prefix__a">
          <Path
            data-name="Rectangle 464"
            fill="#fff"
            stroke="#707070"
            d="M0 0h100v100H0z"
          />
        </ClipPath>
        <ClipPath id="prefix__b">
          <Path data-name="Rectangle 465" d="M0 0h100v100H0z" />
        </ClipPath>
        <LinearGradient
          id="prefix__c"
          x1={0.5}
          x2={0.5}
          y2={1.34}
          gradientUnits="objectBoundingBox">
          <Stop offset={0} stopColor="#80f1fa" />
          <Stop offset={1} stopColor="#fff" />
        </LinearGradient>
      </Defs>
      <G data-name="Mask Group 263" clipPath="url(#prefix__a)">
        <G clipPath="url(#prefix__b)">
          <G data-name="Group 45" transform="translate(29.8 13.2)">
            <G data-name="Group 44">
              <Rect
                data-name="Rectangle 29"
                width={40.4}
                height={73.6}
                rx={6}
                fill="#d5d5d5"
              />
              <Rect
                data-name="Rectangle 30"
                width={37.4}
                height={70.6}
                rx={5}
                transform="translate(1.4 1.6)"
                fill="url(#prefix__c)"
              />
            </G>
            <Rect
              data-name="Rectangle 31"
              width={16.8}
              height={3.6}
              rx={1.8}
              transform="translate(11.8)"
              fill="#d5d5d5"
            />
          </G>
        </G>
      </G>
      <G data-name="Group 535" transform="translate(37.046 37.783)">
        <Ellipse
          data-name="Ellipse 178"
          cx={12.868}
          cy={11.83}
          rx={12.868}
          ry={11.83}
          transform="translate(0 -1)"
          fill="#fff"
        />
        <Path
          data-name="Path 1"
          d="M5.926 10.841l4.62 3.99 8.862-7.715"
          fill="none"
          stroke="#5de058"
          strokeWidth={2}
        />
      </G>
    </Svg>
  );
};

export default Mobile;
