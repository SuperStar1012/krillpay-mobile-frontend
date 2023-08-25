import React from 'react';
import Svg, {
  Circle,
  Defs,
  G,
  Rect,
  ClipPath,
  ForeignObject,
} from 'react-native-svg';
import { View, Text } from 'components';

export default function RewardsBanner({ primary = '#5d48f8' }) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" height={174} width={'100%'}>
      <Defs>
        <ClipPath id="clip-Rewards-bg">
          <Rect width="390" height="174" />
        </ClipPath>
      </Defs>
      <G id="Rewards-bg" clipPath="url(#clip-Rewards-bg)">
        <Rect width="390" height="174" fill="#fff" />
        <Rect id="primary" width="390" height="174" fill={primary} />
        <G
          id="Ellipse_1138"
          data-name="Ellipse 1138"
          transform="translate(-67 -85)"
          fill="none"
          stroke="#fff"
          strokeWidth="1"
          opacity="0.752">
          <Circle cx="90" cy="90" r="90" stroke="none" />
          <Circle cx="90" cy="90" r="89.5" fill="none" />
        </G>
        <ForeignObject x={0} y={'38%'}>
          <View aI="center">
            <Text c="#ffffff" s={18} fW="bold">
              Rewards
            </Text>
            <Text c="#ffffff" style={{ marginTop: 4 }}>
              Earn points while earing rewards
            </Text>
          </View>
        </ForeignObject>
        <Circle
          id="Ellipse_1139"
          data-name="Ellipse 1139"
          cx="90"
          cy="90"
          r="90"
          transform="translate(300 71)"
          fill="#fff"
          opacity="0.2"
        />
      </G>
    </Svg>
  );
}
