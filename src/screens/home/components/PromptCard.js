import React from 'react';
import { Pressable } from 'react-native';
import { View, Text, CustomImage } from 'components';

export default function PromptCard(props) {
  const {
    colorVariant,
    title,
    description,
    actionText,
    image,
    rightSlot,
    onPress,
    titleColor = 'font',
    backgroundColor,
  } = props;

  const colorConfig = {
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
      actionTextColor: 'primary',
    },
  };

  const content = (
    <View
      p={1}
      bC={
        backgroundColor ??
        colorConfig?.[colorVariant ?? 'default']?.backgroundColor
      }
      bR={10}
      fD={'row'}
      aI={'center'}
      jC={'space-between'}>
      <View style={{ flexShrink: 1 }}>
        <Text s={17} fW={'700'} id={title} c={titleColor} />
        {Boolean(description) && (
          <View mt={0.25}>
            <Text s={14} c={'#848484'} lH={18} id={description} />
          </View>
        )}
        {Boolean(actionText) && (
          <View mt={0.25}>
            <Text
              s={14}
              c={colorConfig[colorVariant ?? 'default'].actionTextColor}
              id={actionText}></Text>
          </View>
        )}
      </View>
      {Boolean(image) && (
        <View ml={0.5}>
          <CustomImage
            name={image}
            width={50}
            height={50}
            containerStyle={{ backgroundColor: 'transparent' }}
          />
        </View>
      )}
      {rightSlot}
    </View>
  );

  return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content;
}
