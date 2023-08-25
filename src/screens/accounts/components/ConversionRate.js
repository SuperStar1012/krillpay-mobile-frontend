import React from 'react';
import { StyleSheet } from 'react-native';

import { View, Text } from 'components';
import { useTheme } from 'contexts/ThemeContext';

const ConversionRate = ({ children, textStyle = {} }) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View
        style={[styles.innerContainer, { borderColor: theme.colors.primary }]}>
        <Text width="auto" t="b2" tA="center" style={textStyle}>
          {children}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  innerContainer: {
    width: 'auto',
    borderWidth: 1,
    borderRadius: 100,
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
});

export default ConversionRate;
