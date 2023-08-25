import React from 'react';
import { View } from '../layout/View';
import RadioSelector from '../inputs/RadioSelector';

export default function SelectFilter(props) {
  const { id, filters, items, setFilters } = props;
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
      <RadioSelector
        altStyle
        items={items}
        value={value}
        handleChange={setValue}
        nullable
      />
    </View>
  );
}
