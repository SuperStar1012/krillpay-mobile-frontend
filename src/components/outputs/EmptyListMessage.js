import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { useTheme } from 'contexts/ThemeContext';

export default function EmptyListMessage(props) {
  const { text, id, idOveride, children, ...restProps } = props;
  const { viewStyleContainer, viewStyleBox, textStyle } = styles;
  const { colors } = useTheme();
  return (
    <View style={viewStyleContainer}>
      <View style={viewStyleBox} {...restProps}>
        <Text
          style={[textStyle, { color: colors.grey3, textAlign: 'center' }]}
          id={Boolean(idOveride) ? idOveride : Boolean(id) && id + '_empty'}>
          {text ? text : children}
        </Text>
      </View>
    </View>
  );
}

const styles = {
  viewStyleContainer: {
    // flex: 1,
    padding: 8,
  },
  viewStyleBox: {
    flexDirection: 'column',
    // backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 16,
    fontWeight: 'normal',
  },
};

export { EmptyListMessage };
