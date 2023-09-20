import React from 'react';
import SkeletonPlaceholder from 'expo-react-native-skeleton-placeholder';
import { Pressable } from 'react-native';
import { View, Text } from 'components';
import { displayFormatDivisibility } from 'utility/general';
import RewardPlaceholderImage from 'screens/rewards/components/images';

export default function FeaturedRewardCard(props) {
  const { loading, item, navigation } = props;
  const { name, amount, currency, percentage, fixed_amount, type } = item;

  const skeleton = (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item width={'100%'} height={150} borderRadius={10} />
    </SkeletonPlaceholder>
  );

  const amountString =
    currency?.symbol +
    displayFormatDivisibility(fixed_amount, currency?.divisibility);
  const percentageString = parseFloat(percentage).toString() + '%';

  const isPercentage = type === 'percentage';

  return loading ? (
    skeleton
  ) : (
    <Pressable onPress={() => navigation.navigate('CampaignDetail', { item })}>
      <View bC="#F8F8F8" bR={15} pb={1} style={{ minHeight: 190 }}>
        <RewardPlaceholderImage rewardName={name} height={120} />
        <View ph={1}>
          {isPercentage ? (
            <React.Fragment>
              <Text s={14}>{name}</Text>
              <View fD="row" aI="flex-end" pt={0.25}>
                <Text c="primary" fW="700" s={18} lH={30} t="h3">
                  {'Earn ' + percentageString}
                </Text>
              </View>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Text s={14}>{name}</Text>
              <View h={4} />
              <Text s={18} c="primary" fW="700">
                {amountString}
              </Text>
            </React.Fragment>
          )}
        </View>
      </View>
    </Pressable>
  );
}
