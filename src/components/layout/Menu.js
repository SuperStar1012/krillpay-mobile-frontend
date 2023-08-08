import React from 'react';
import { View } from './View';
import { Pressable } from 'react-native';
import Text from 'components/outputs/Text';

export default function Menu(props) {
  const { visible, setVisible, items } = props;

  if (visible)
    return (
      <View style={{ position: 'relative' }}>
        <View
          p={1}
          bR={10}
          w={150}
          style={{
            position: 'absolute',
            right: 0,
            shadowColor: '#00000021',
            shadowOffset: { width: 1, height: 1 },
            overflow: 'none',
            shadowOpacity: 0.9,
            shadowRadius: 5,
            elevation: 10,
            backgroundColor: 'white',
          }}>
          {items?.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => {
                setVisible(false);
                item.onPress();
              }}>
              <View mb={index === items.length - 1 ? 0 : 1}>
                <Text
                  c={item.selected ? 'primary' : 'font'}
                  fW={item.selected ? '700' : '400'}
                  s={16}>
                  {item?.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    );
  return null;
}
