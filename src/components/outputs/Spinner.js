import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from 'contexts/ThemeContext';

const Spinner = ({
  size,
  color = 'primary',
  backgroundColor,
  containerStyle,
  style,
}) => {
  let { colors = {} } = useTheme();

  return (
    <View
      style={[
        styles._containerStyle,
        {
          backgroundColor: colors[backgroundColor]
            ? colors[backgroundColor]
            : 'transparent',
        },
        containerStyle,
        style,
      ]}>
      <ActivityIndicator size={size || 'large'} color={colors[color]} />
    </View>
  );
};

const styles = {
  _containerStyle: {
    justifyContent: 'center',
    padding: 8,
    alignItems: 'center',
  },
};

export { Spinner };

/*
TODO:
1. Handle fullscreen spinner better?

*/
