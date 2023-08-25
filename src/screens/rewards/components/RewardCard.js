import React from 'react';
import moment from 'moment';
import { View, Text } from 'components';
import { displayFormatDivisibility } from 'utility/general';
import RewardPlaceholderImage from './images';
import { TouchableOpacity, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function RewardCard(props) {
  const { item, navigation } = props;

  if (!item) {
    return null;
  }
  const { campaign = {}, amount, currency, created, status } = item;
  const { name = '', description = '' } = campaign ?? {};
  const color =
    status === 'accept' || status === 'accepted'
      ? 'positive'
      : status === 'reject' || status === 'rejected'
      ? 'negative'
      : 'font';

  const amountString = currency
    ? currency?.symbol +
      displayFormatDivisibility(amount, currency?.divisibility)
    : '';

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('RewardDetail', { item })}>
      <View
        p={0.75}
        bC="#F8F8F8"
        bR={15}
        // mb={1}
        fD="column"
        style={{
          margin: 16,
          marginBottom: 0, //index % 2 === 0 ? 16 : 12,
          // marginLeft: 16, //index % 2 === 0 ? 12 : 16,
        }}
        w={SCREEN_WIDTH / 2 - 32}>
        <View aI="center" w="100%">
          <RewardPlaceholderImage rewardName={name} height={100} width={100} />
        </View>

        <View style={{ zIndex: 10, minHeight: 60 }}>
          <Text s={20} c="primary" fW="bold">
            {amountString}
          </Text>
          <View pt={0.25}>
            <Text fW={'400'}>{name}</Text>
          </View>
        </View>
        <View pt={0.5} jC={'space-between'}>
          <View>
            <Text s={12} fW={'400'}>
              {moment(created).format('lll')}
            </Text>
          </View>
          {/* <View pt={0.25}>
            <Text s={12} fW={'400'} c={color}>
              {standardizeString(status)}
            </Text>
          </View> */}
        </View>
      </View>
    </TouchableOpacity>
  );
}
