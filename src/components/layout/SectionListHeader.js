import React from 'react';
import { View } from './View';
import Text from '../outputs/Text';
import { useTheme } from 'contexts/ThemeContext';

const SectionListHeader = ({ children, fontSize = 10, ...props }) => {
  const { colors } = useTheme();

  return (
    <View
      pv={0.5}
      style={{
        paddingRight: 0,
        paddingLeft: 0,
        paddingBottom: 0,
        backgroundColor: colors.authScreen,
      }}>
      <Text
        tA="left"
        id={children}
        s={fontSize}
        style={{
          paddingVertical: 4,
          color: colors.font,
          fontWeight: 'bold',
        }}
      />
    </View>
  );
};

export { SectionListHeader };
