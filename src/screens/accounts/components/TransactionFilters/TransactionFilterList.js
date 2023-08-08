import React from 'react';
import { View, Text } from 'components';
import { objectToArray } from 'utility/general';
import { Pressable } from 'react-native';

export default function TransactionFilterList(props) {
  const { filterConfig, setFilters, onDismiss } = props;
  const configArray = objectToArray(filterConfig, 'id');

  function handleClearAll() {
    setFilters({});
    onDismiss();
  }

  return (
    <View f={1} aI="center" pb={1}>
      {configArray.map(item => (
        <TransactionFilterListItem key={item?.id} {...props} item={item} />
      ))}
      <Pressable onPress={handleClearAll}>
        <Text s={14} c="primary" id="clear_all" ns="accounts" />
      </Pressable>
    </View>
  );
}

function hasFilter(filters, id) {
  switch (id) {
    case 'date':
      return !!(
        filters?.created ||
        filters?.created__gt ||
        filters?.created__lt ||
        filters?.created__gte ||
        filters?.created__gte
      );
    case 'amount':
      return !!(
        filters?.amount ||
        filters?.amount__abs ||
        filters?.amount__abs__gt ||
        filters?.amount__abs__lt ||
        filters?.amount__abs__gte
      );
    default:
      return filters?.[id];
  }
}

function TransactionFilterListItem(props) {
  const { filters, item, setId } = props;

  const selected = hasFilter(filters, item?.id);

  return (
    <Pressable onPress={() => setId(item?.id)}>
      <View mb={1.5}>
        <Text
          tA="center"
          s={20}
          id={item?.title ?? item?.id}
          ns="accounts"
          fW={selected ? '500' : '400'}
          c={selected ? 'primary' : 'font'}
        />
      </View>
    </Pressable>
  );
}
