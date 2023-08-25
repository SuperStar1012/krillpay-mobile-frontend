import React from 'react';
import { View } from 'react-native';

import { useTheme } from 'components/context';

export default function Corner(props) {
  const { color } = props;
  const { colors } = useTheme();

  return (
    <View>
      <View
        style={{
          position: 'absolute',
          backgroundColor: colors[color] ? colors[color] : color,
          left: 0,
          top: 0,
          width: 40,
          height: 40,
        }}>
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            left: 0,
            top: 0,
            width: 80,
            height: 80,
            borderRadius: 40,
          }}
        />
      </View>
    </View>
  );
}
