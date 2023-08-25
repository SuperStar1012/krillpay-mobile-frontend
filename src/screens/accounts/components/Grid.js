import React from 'react';
import { View, StyleSheet } from 'react-native';
import { chunk } from 'lodash';
import { EmptyListMessage } from 'components';

export default function Grid(props) {
  const {
    items = [],
    amountPerRow = 3,
    renderItem,
    containerStyle,
    emptyListMessage,
  } = props;
  const { viewStyleRow, viewStyleContainer, viewStyleRowSingle } = styles;

  const chunks = chunk(items, amountPerRow);

  if (!items.length && emptyListMessage) {
    return <EmptyListMessage>{emptyListMessage}</EmptyListMessage>;
  }

  return (
    <View style={[viewStyleContainer, containerStyle]}>
      {chunks.map((row, index) => (
        <View
          key={index}
          style={amountPerRow === 1 ? viewStyleRowSingle : viewStyleRow}>
          {row.map(item => renderItem(item))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyleContainer: {
    // height: 50,
    width: '100%',
    // padding: 16,
    // paddingBottom: 0,
  },
  viewStyleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  viewStyleRowSingle: {
    width: '100%',
  },
});
