import React from 'react';
import { Pressable } from 'react-native';
import { View } from '../layout/View';
import { Icon } from './Icon';
import Text from './Text';

export default function Alert(props) {
  const { variant, message, children, onPress } = props;

  const colorMap = () => {
    switch (variant) {
      case 'success':
        return {
          background: '#DEF5EC',
          fill: '#24A070',
          icon: 'check-circle',
          title: 'Success',
        };
      case 'warning':
        return {
          background: '#fff0e3',
          fill: '#fe7000',
          icon: 'warning',
          title: 'Warning',
        };
      case 'error':
        return {
          background: '#f9e3e6',
          fill: '#CC2538',
          icon: 'error',
          title: 'Error',
        };
      case 'info':
      default:
        return {
          background: '#e1f6ff',
          fill: '#0078b1',
          icon: 'info',
          title: 'Info',
        };
    }
  };

  const config = colorMap();

  const content = (
    <View
      bR={10}
      bC={config.background}
      p={1}
      f={1}
      b={1}
      fD={'row'}
      aI={'flex-start'}
      style={{
        borderWidth: 1,
        borderColor: config.fill,
      }}>
      <Icon
        name={config.icon}
        set={'MaterialIcons'}
        color={config.fill}
        size={25}
      />
      <View ml={0.5} pr={1.5}>
        <Text lH={25}>
          <Text s={17} fW={'700'} c={config.fill}>
            {`${config.title}: `}
          </Text>
          {children ?? <Text s={17} c={config.fill} id={message} />}
        </Text>
      </View>
    </View>
  );

  return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content;
}
