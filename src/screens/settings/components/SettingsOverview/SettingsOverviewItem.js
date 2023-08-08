import React from 'react';
import { Pressable } from 'react-native';
import { View, Text } from 'components';

export default function SettingsOverviewItem(props) {
  const { id, navigation, showModal } = props;

  const { viewStyleContainer, viewStyleLabel, textStyleLabel } = styles;

  function handleOnPress() {
    if (id === 'logout') {
      showModal('logout');
    } else {
      navigation.navigate('SettingsPage', props);
    }
  }

  return (
    <Pressable
      underlayColor="lightgrey"
      style={viewStyleContainer}
      onPress={handleOnPress}>
      <View style={viewStyleLabel}>
        <Text id={id} style={textStyleLabel} />
      </View>
    </Pressable>
  );
}

const styles = {
  viewStyleContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginVertical: 8,
    borderRadius: 3,
  },
  viewStyleLabel: {
    flexDirection: 'row',
  },
  viewStyleValue: {
    flexDirection: 'row',
  },
  textStyleLabel: {
    fontWeight: 'normal',
    fontSize: 16,
    paddingBottom: 4,
  },
  textStyleValue: {
    fontSize: 14,
    color: 'black',
    opacity: 0.8,
  },
};
