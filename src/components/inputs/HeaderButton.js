import React from 'react';
import { Pressable, Text } from 'react-native';
import context from '../context';
import { Icon } from '../outputs/Icon';

const _HeaderButton = ({
  onPress,
  icon,
  text,
  color,
  colors,
  size,
  surface,
  design,
  set,
  right,
  children,
  containerStyle,
}) => {
  const tempColor = color
    ? color.charAt(0) === '#'
      ? color
      : colors[color]
    : design.app.surface && surface
    ? colors.primary
    : colors.headerContrast;

  return (
    <Pressable
      onPress={onPress}
      style={{ ...styles._containerStyle, ...containerStyle }}>
      {icon ? (
        <Icon
          set={set ? set : 'MaterialIcons'}
          style={{ alignItems: 'flex-start' }}
          name={icon}
          size={size ? size : 20}
          color={tempColor}
        />
      ) : (
        <Text
          s={size ? size : 18}
          style={{
            color: tempColor,
            padding: 8,
            alignItems: right ? 'flex-end' : 'flex-start',
          }}>
          {text}
        </Text>
      )}
      {children}
    </Pressable>
  );
};

const styles = {
  _containerStyle: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 10,
    // marginLeft: -10,
    // paddingTop: 1,
    elevation: 3,
    zIndex: 5,
  },
};

const HeaderButton = context(_HeaderButton);

export { HeaderButton };
/*
TODO:
Rethink / remove


*/
