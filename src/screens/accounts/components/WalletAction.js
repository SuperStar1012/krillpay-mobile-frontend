import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CustomIcon, Button, Text } from 'components';
import { Icon } from 'components/outputs/Icon';

import { useTheme } from 'contexts/ThemeContext';

export default function WalletAction(props) {
  const {
    name,
    iconSet,
    inverted,
    id,
    onPress,
    variant,
    ...otherProps
  } = props;
  const { viewStyleContainer, textStyleLabel, viewStyleIcon } = styles;

  const { colors } = useTheme();

  const backgroundColor = inverted ? colors.header : colors.headerContrast;
  const color = inverted ? 'headerContrast' : 'header';
  const fontColor = inverted ? 'header' : 'font';

  switch (variant) {
    case 'text':
      return (
        <Button
          onPress={onPress}
          id={id === 'more' ? '• • •' : id}
          size="small"
          wide
          containerStyle={{ flex: 1 }}
          {...otherProps}
        />
      );
    default:
      return (
        <TouchableOpacity onPress={onPress}>
          <View style={viewStyleContainer}>
            <View style={[viewStyleIcon, { backgroundColor }]}>
              {iconSet ? (
                <Icon set={iconSet} name={name} color={color} size={28} />
              ) : (
                <CustomIcon
                  name={name}
                  size={name === 'more' ? 36 : 24}
                  color={color}
                  contained={false}
                />
              )}
            </View>
            <Text
              s={12}
              fW={'500'}
              c={fontColor}
              tA="center"
              style={textStyleLabel}
              id={id}
            />
          </View>
        </TouchableOpacity>
      );
  }
}

const styles = {
  viewStyleContainer: {
    paddingBottom: 8,
    paddingTop: 8,
    paddingVertical: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    maxWidth: 72,
  },
  viewStyleIcon: {
    height: 55,
    width: 55,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyleLabel: {
    paddingTop: 6,
  },
};
