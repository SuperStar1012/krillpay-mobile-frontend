import React from 'react';
import Svg, { G, Rect, Path, ForeignObject } from 'react-native-svg';
import { View, Text } from 'components';
import ReferRewardsBanner from './refer-rewards-banner.svg';
import { Dimensions, Pressable } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ReferRewardBanner({ navigation, color = '#5d48f8' }) {
  console.log('ReferRewardBanner -> color', color);
  return (
    <Pressable onPress={() => navigation.navigate('Referral')}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        height={85}
        width={SCREEN_WIDTH - 25}>
        <G
          id="Group_11116"
          data-name="Group 11116"
          transform="translate(-762 -12150)">
          <Path
            id="primary"
            d={`M15,0H${
              SCREEN_WIDTH - 50
            }a15,15,0,0,1,15,15V68a15,15,0,0,1-15,15H15A15,15,0,0,1,0,68V15A15,15,0,0,1,15,0Z`}
            transform="translate(762 12150)"
            fill={color}
          />
          <G id="refer-overlay" transform="translate(763 12151)">
            {/* there is a bug in ForeignObject to re-render image inside it. to solve that using key which change every time and re-render again */}
            <ForeignObject x={0} y={0} key={Math.random()}>
              <View fD="row" jC="center" h="100%" ph={1}>
                <View w="45%" jC="center">
                  <Text c="#ffffff" lH={20}>
                    <Text c="#ffffff" fW="bold" id="refer_a_friend" />
                    <Text c="#ffffff" id="and_earn_rewards" />
                  </Text>
                </View>
                <View w="55%" jC="center">
                  <ReferRewardsBanner />
                </View>
              </View>
            </ForeignObject>
            <Rect
              id="Rectangle_2892"
              data-name="Rectangle 2892"
              width={SCREEN_WIDTH - 25}
              height="82"
              fill="none"
            />
            <G
              id="Group_1757"
              data-name="Group 1757"
              transform="translate(219.489 0)">
              <Path
                id="Intersection_4"
                data-name="Intersection 4"
                d="M0,46C7.047,19.565,32.329,0,62.436,0s55.39,19.565,62.437,46Z"
                transform="translate(0 36)"
                fill="#fff"
                opacity="0.1"
              />
              <Path
                id="Intersection_3"
                data-name="Intersection 3"
                d="M7.561,82A54.348,54.348,0,0,1,53.942,0h.872Q57.439.02,60,.285V82Z"
                transform="translate(69.51)"
                fill="#fff"
                opacity="0.2"
              />
            </G>
          </G>
        </G>
      </Svg>
    </Pressable>
  );
}
