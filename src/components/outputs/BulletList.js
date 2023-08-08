import React from 'react';

import Text from './Text';
import { View } from '../layout/View';

const Logo = props => {
  const { items } = props;

  return (
    <View p={0.5} ph={1}>
      {items.map((bullet, index) => (
        <View key={index} fD={'row'} p={0.5} f={1}>
          <View pr={1}>
            <Text>{'\u25CF'}</Text>
          </View>
          <View f={1}>
            <Text>{bullet}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default Logo;
