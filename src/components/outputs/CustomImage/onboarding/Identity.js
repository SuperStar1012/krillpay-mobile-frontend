import React from 'react';
import Svg, { Path, Defs, ClipPath, G, Rect } from 'react-native-svg';

const Identity = props => {
  const { width = 150, height = 150 } = props;

  return (
    <Svg width={width} height={height} viewBox="0 0 150 150" {...props}>
      <Defs>
        <ClipPath id="prefix__a">
          <Path
            data-name="Rectangle 590"
            transform="translate(113 96)"
            fill="#fff"
            stroke="#707070"
            d="M0 0h150v150H0z"
          />
        </ClipPath>
        <ClipPath id="prefix__b">
          <Path
            data-name="Rectangle 1186"
            fill="#fff"
            stroke="#707070"
            strokeWidth={1.485}
            d="M369.802 259.901h59.406v59.406h-59.406z"
          />
        </ClipPath>
      </Defs>
      <G
        data-name="Mask Group 472"
        transform="translate(-113 -96)"
        clipPath="url(#prefix__a)">
        <G data-name="Group 835" transform="translate(-246.406 -118.604)">
          <Rect
            data-name="Rectangle 1183"
            width={150}
            height={100.99}
            rx={14.851}
            transform="translate(359.406 239.109)"
            fill="#e6e6e6"
          />
          <Path
            data-name="Intersection 2"
            d="M433.663 340.099v-100.99h60.892a14.852 14.852 0 0114.852 14.852v71.291a14.852 14.852 0 01-14.852 14.852z"
            fill="#d9d9d9"
          />
          <G data-name="Mask Group 471" clipPath="url(#prefix__b)">
            <Path
              data-name="user-solid (1)"
              d="M399.505 289.601a14.851 14.851 0 10-14.851-14.849 14.851 14.851 0 0014.851 14.849zm10.4 3.713h-1.935a20.2 20.2 0 01-16.917 0h-1.944a15.594 15.594 0 00-15.594 15.597v4.827a5.571 5.571 0 005.569 5.569h40.842a5.571 5.571 0 005.569-5.569v-4.827a15.594 15.594 0 00-15.594-15.594z"
              fill="#19d4e3"
            />
          </G>
          <Rect
            data-name="Rectangle 1189"
            width={29.703}
            height={8.911}
            rx={4.455}
            transform="translate(442.574 302.97)"
            fill="#434343"
          />
          <Rect
            data-name="Rectangle 1190"
            width={54.95}
            height={8.911}
            rx={4.455}
            transform="translate(442.574 285.149)"
            fill="#434343"
          />
          <Rect
            data-name="Rectangle 1191"
            width={54.95}
            height={8.911}
            rx={4.455}
            transform="translate(442.574 267.327)"
            fill="#434343"
          />
        </G>
      </G>
    </Svg>
  );
};

export default Identity;
