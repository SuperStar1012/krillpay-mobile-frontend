import Text from 'components/outputs/Text';
import React from 'react';
import { Pressable } from 'react-native';
import { View } from '../View';

const TabBarItem = React.forwardRef((props, ref) => {
  const { item, onItemPress, selected } = props;

  return (
    <Pressable ref={ref} onPress={onItemPress}>
      <View p={1} pb={0.75}>
        <Text
          id={item?.label ?? item?.key}
          s={16}
          c={selected ? 'primary' : 'fontDark'}
          fW={selected ? 'bold' : 'normal'}
        />
      </View>
    </Pressable>
  );
});

export default TabBarItem;
