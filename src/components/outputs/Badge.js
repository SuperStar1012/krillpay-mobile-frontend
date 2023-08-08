import React from 'react';
import { View, Text } from 'react-native';

export default function Badge({
  color,
  backgroundColor = '#bdbdbd',
  fontSize = 16,
  radius = 16,
  title = 'A',
  containerStyle = {},
}) {
  return (
    <View
      style={{
        height: radius * 2,
        width: radius * 2,
        borderRadius: radius,
        backgroundColor: backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        ...containerStyle,
      }}>
      <Text
        style={{
          fontSize: fontSize,
          color: color,
          fontWeight: 'bold',
          textAlignVertical: 'center',
          textAlign: 'center',
        }}>
        {title && title.substr(0, 1).toUpperCase()}
      </Text>
    </View>
  );
}
