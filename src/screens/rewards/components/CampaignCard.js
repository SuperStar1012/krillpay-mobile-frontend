import React from 'react';
// import PropTypes from 'prop-types';
import { View, Text } from 'components';
import { displayFormatDivisibility } from 'utility/general';
import RewardPlaceholderImage from './images';
import { TouchableOpacity, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CampaignCard(props) {
  const { item, navigation, altStyle } = props;
  if (!item) {
    return null;
  }
  const { currency, fixed_amount, name, type, percentage } = item;

  const amountString =
    currency?.symbol +
    displayFormatDivisibility(fixed_amount, currency?.divisibility);
  const percentageString = parseFloat(percentage).toString() + '%';

  const isPercentage = type === 'percentage';

  if (altStyle) {
    return (
      <TouchableOpacity
        disabled={altStyle}
        onPress={() => navigation.navigate('CampaignDetail', { item })}>
        <View
          p={1}
          bC="#F8F8F8"
          bR={15}
          fD={'row'}
          aI={'center'}
          jC="center"
          w={'100%'}>
          <View aI="center" pr={1}>
            <RewardPlaceholderImage
              rewardName={name}
              height={100}
              width={100}
            />
          </View>
          <View style={{ zIndex: 10, minHeight: 60 }}>
            {isPercentage ? (
              <React.Fragment>
                <View fD="row" aI="flex-end" pb={0.5}>
                  <Text c="primary" fW="700" s={20} lH={30} t="h3">
                    {'Earn ' + percentageString}
                  </Text>
                </View>

                <Text s={14}>{name}</Text>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Text s={20} c="primary" fW="700">
                  {amountString}
                </Text>
                <View h={8} />
                <Text s={14}>{name}</Text>
              </React.Fragment>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      disabled={altStyle}
      onPress={() => navigation.navigate('CampaignDetail', { item })}>
      <View
        p={1}
        bC="#F8F8F8"
        bR={15}
        fD={'column'}
        style={{
          margin: 16, //index % 2 === 0 ? 16 : 12,
          // marginLeft: 16, //index % 2 === 0 ? 12 : 16,
        }}
        w={SCREEN_WIDTH / 2 - 32}>
        <View h={SCREEN_WIDTH / 4} aI="center" w={'100%'}>
          <RewardPlaceholderImage rewardName={name} height={100} width={100} />
        </View>
        <View style={{ zIndex: 10, minHeight: 65 }}>
          {isPercentage ? (
            <React.Fragment>
              <View fD="row" aI="flex-end" pb={0.5}>
                <Text c="primary" fW="700" s={20} lH={30} t="h3">
                  {'Earn ' + percentageString}
                </Text>
              </View>

              <Text s={14}>{name}</Text>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Text s={20} c="primary" fW="700">
                {amountString}
              </Text>
              <View h={8} />
              <Text s={14}>{name}</Text>
            </React.Fragment>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
