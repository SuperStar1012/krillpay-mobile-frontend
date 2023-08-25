import React from 'react';
import { View } from '../layout/View';
import { Checkbox } from '../inputs/Checkbox';
import { PopUpGeneral } from '../layout/PopUpGeneral';

const Filters = props => {
  const { items, showFilters, toggleFilters } = props;

  return (
    <PopUpGeneral
      title={'Filters'}
      visible={showFilters}
      onDismiss={toggleFilters}>
      {items && items.length && items.length > 0
        ? items.map(item => (
            <Checkbox
              key={item.label}
              description={item.label}
              toggleValue={item.onClick}
              value={item.value}
            />
          ))
        : null}
    </PopUpGeneral>
  );
};

export default Filters;
