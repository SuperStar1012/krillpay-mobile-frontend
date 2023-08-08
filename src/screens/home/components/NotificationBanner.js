import React from 'react';
import { TouchableOpacity } from 'react-native';
import { CustomImage, View, Text } from 'components';

export default function NotificationBanner(props) {
  const { item = {} } = props;
  const { onPress, title, subtitle, actionText, rightSlot, image, type } = item;

  const config = {
    success: {
      backgroundColor: '#DEF5EC',
      actionTextColor: '#24a070',
    },
    error: {
      backgroundColor: '#F5DEDE',
      actionTextColor: '#cc2538',
    },
    default: {
      backgroundColor: '#F8F8F8',
      actionTextColor: '#848484',
    },
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        p={1}
        bC={config[type ?? 'default'].backgroundColor}
        bR={10}
        fD={'row'}
        aI={'center'}
        jC={'space-between'}>
        <View style={{ flexShrink: 1 }}>
          <Text s={17} fW={'700'}>
            {title}
          </Text>
          {subtitle && (
            <View mt={0.25}>
              <Text s={14} c={'#848484'}>
                {subtitle}
              </Text>
            </View>
          )}
          {actionText && (
            <View mt={0.25}>
              <Text s={14} c={config[type ?? 'default'].actionTextColor}>
                {actionText}
              </Text>
            </View>
          )}
        </View>
        {image && (
          <CustomImage
            name={image}
            width={50}
            height={50}
            containerStyle={{ backgroundColor: 'transparent' }}
          />
        )}
        {rightSlot}
      </View>
    </TouchableOpacity>
  );
}
