import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Text from '../outputs/Text';
import { View } from '../layout/View';

import { useTheme } from 'contexts/ThemeContext';

export default function Checkbox(props) {
  const { onPress, value, name, label, error, containerStyle } = props;
  const {
    textStyleRequired,
    viewStyleContainer,
    viewStyleText,
    viewStyleCheckbox,
  } = styles;

  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[viewStyleContainer, containerStyle]}
      onPress={() => onPress(name, !value)}>
      <View style={viewStyleCheckbox}>
        <MaterialIcons
          name={value ? 'check-box' : 'check-box-outline-blank'}
          size={26}
          color={value ? colors.primary : colors.font}
        />
      </View>
      {label ? (
        <View style={viewStyleText}>
          <Text id={label} />
        </View>
      ) : null}

      {error ? (
        <View>
          <Text style={textStyleRequired}>{error}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = {
  viewStyleContainer: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
  },
  viewStyleCheckbox: {
    margin: 3,
    padding: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  viewStyleText: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 4,
  },
};
