import React, { useState } from 'react';
import SelectFilter from './SelectFilter';
import CountryFilter from './CountryFilter';
import CategoryFilter from './CategoryFilter';
import { View } from '../layout/View';
import Text from '../outputs/Text';
import ButtonList from 'components/inputs/ButtonList';
import DateFilter from './DateFilter';
import SelectorFilter from './SelectorFilter';
import NumberFilter from './NumberFilter';
import TextFilter from './TextFilter';
import { clearFilters } from 'utility/filters';

export default function Filter(props) {
  const {
    variant,
    type = variant,
    options,
    filters,
    setFilters,
    id,
    onDismiss,
    currency,
  } = props;

  const [tempFilters, setTempFilters] = useState(filters);

  function handleClear() {
    const newFilters = clearFilters(filters, id);
    setFilters(newFilters);
    setTempFilters(newFilters);
    onDismiss();
  }

  function handleApply() {
    setFilters(tempFilters);
    onDismiss();
  }

  function handleDisabled() {
    if (id === 'account' && tempFilters?.[id]?.length !== 10) {
      return true;
    }
    return false;
  }

  const buttons = [
    { id: 'apply', onPress: handleApply, disabled: handleDisabled() },
    { id: 'clear', type: 'text', onPress: handleClear },
  ];

  const filterProps = {
    items: options,
    id,
    filters: tempFilters,
    setFilters: setTempFilters,
  };

  return (
    <View>
      {type === 'select' ? (
        <SelectFilter {...filterProps} />
      ) : type === 'selector' ? (
        <SelectorFilter {...filterProps} />
      ) : type === 'number' ? (
        <NumberFilter {...filterProps} currency={currency} />
      ) : type === 'date' ? (
        <DateFilter {...filterProps} />
      ) : type === 'category' ? (
        <CategoryFilter {...filterProps} />
      ) : type === 'country' ? (
        <CountryFilter {...filterProps} />
      ) : type === 'text' ? (
        <TextFilter {...filterProps} />
      ) : (
        <View>
          <Text>Unknown filter type</Text>
        </View>
      )}
      <ButtonList pt={1} items={buttons} />
    </View>
  );
}
