import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'components';

const HomeLists = props => {
  const { viewStyleContainer } = styles;
  return (
    <View scrollView style={viewStyleContainer}>
      <View bC={'orange'} h={200} />
      <View bC={'purple'} h={200} />
      <View bC={'red'} h={200} />
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyleContainer: {
    // flex: 1,
    paddingTop: 300,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // overflow: 'hidden',
  },
});

export default HomeLists;
