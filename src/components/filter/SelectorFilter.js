import React from 'react';
import Selector from 'components/inputs/Selector';
import { View } from 'components/layout/View';

export default function SelectorFilter(props) {
  const { label, items = [], id, filters, setFilters } = props;

  const value = filters?.[id];
  const setValue = newValue => {
    if (newValue) {
      setFilters({
        ...filters,
        [id]: newValue,
      });
    } else {
      const tempFilters = { ...filters };
      delete tempFilters[id];
      setFilters(tempFilters);
    }
  };

  return (
    <View>
      <Selector
        label={label}
        items={items}
        value={value}
        placeholder="Please select subtype"
        onValueChange={value => setValue(value)}
      />
    </View>
  );
}
