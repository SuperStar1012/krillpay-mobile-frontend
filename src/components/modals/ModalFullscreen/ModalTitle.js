import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../../layout/View';
import { Text } from '../../outputs/Text';
import { useTheme } from 'contexts/ThemeContext';

export default function ModalTitle(props) {
  const { viewStyleContainer, textStyleTitle, textStyleSubtitle } = styles;

  let { title, subtitle, colorTitleText } = props;
  const { colors } = useTheme();
  if (!title && !subtitle) {
    return null;
  }

  return (
    <View style={viewStyleContainer}>
      {title ? (
        <Text
          s={20}
          fW="500"
          style={[
            textStyleTitle,
            {
              color: colorTitleText ? colorTitleText : colors.font,
            },
          ]}>
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text
          style={[
            textStyleSubtitle,
            {
              color: colorTitleText ? colorTitleText : colors.font,
            },
          ]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyleContainer: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  textStyleTitle: {
    flexShrink: 1,
    flexWrap: 'wrap',
    // fontWeight: 'bold',
    // fontSize: 20,
  },
  textStyleSubtitle: {
    opacity: 0.8,
    fontSize: 12,
  },
});
