import React from 'react';
import { View, Text, Output } from 'components';
import { displayFormatDivisibility, formatTime } from 'utility/general';

import RewardPlaceholderImage from '../components/images';

import Markdown from 'components/outputs/Markdown';
import HeaderNew from 'components/layout/HeaderNew';

export default function RewardDetail(props) {
  const { route, navigation } = props;
  const { item } = route?.params ?? {};

  if (!item) {
    return null;
  }
  const { campaign = {}, amount, currency, created, status } = item;
  const { name = '', description = '' } = campaign ? campaign : {};
  console.log('RewardDetail -> created', created);
  const color =
    status === 'accept' || status === 'accepted'
      ? 'positive'
      : status === 'reject' || status === 'rejected'
      ? 'negative'
      : 'font';

  const amountString =
    currency.symbol + displayFormatDivisibility(amount, currency.divisibility);

  return (
    <View screen>
      <HeaderNew title="" navigation={navigation} />
      <View p={0.5} ph={1.5}>
        <View p={0.75} bC="#F8F8F8" bR={15} aI="center">
          <RewardPlaceholderImage rewardName={name} height={140} width={140} />
        </View>

        <View pt={1}>
          <Text fW="500" s={17}>
            {name}
          </Text>
          <View pt={1} pb={0.5}>
            <Text t="h3" c="primary" fW="bold">
              {amountString}
            </Text>
          </View>
          <Markdown>{description}</Markdown>
        </View>
        <View pt={0.5}>
          <Output
            label="date_claimed"
            value={formatTime(created, 'lll')}
            horizontal
          />
          <View pt={0.5}>
            <Text c={color} id={status} options={{ standardize: true }} />
          </View>
        </View>
      </View>
    </View>
  );
}
