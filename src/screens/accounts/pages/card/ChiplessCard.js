import React from 'react';
import { Dimensions } from 'react-native';
import moment from 'moment';

import { View, Card, Text } from 'components';
import Overlays from '../../components/Overlays';
import { get } from 'lodash';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ChiplessCard(props) {
  const { item, currency } = props;

  const { id, account, created } = item;

  const height = ((SCREEN_WIDTH - 72) / 330) * 180;

  return (
    <Card onPressContentDisabled noPadding>
      <Overlays variant={'chiplessCard'} width={SCREEN_WIDTH} />
      <View p={1} bC="primary" h={height} jC="space-between">
        <Text c="primaryContrast" fW="600">
          {get(currency, ['currency', 'code'])}
        </Text>
        <Text s="25" c="primaryContrast" fW="700" style={{ paddingTop: 16 }}>
          {account}
        </Text>
        <View>
          <Text c="primaryContrast" tA="right">
            Created
          </Text>
          <Text s="17" c="primaryContrast" fW="500" tA="right">
            {moment(created).format('YY/MM/DD')}
          </Text>
        </View>
      </View>
    </Card>
  );
}
