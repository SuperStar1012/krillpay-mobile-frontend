import React from 'react';

import Filter from './Filter';
// import { TabsWithIndicator } from '../layout/Tabs';
import { View } from '../layout/View';
import { ModalFullscreen } from '../modals/ModalFullscreen';

const FilterContainer = ({
  filters,
  tempFilters,
  filterConfig,
  setFilters,
  applyFilters,
  setShowFilters,
  clearAndApply,
  showFilters,
}) => {
  const action2 = {
    id: 'clear',
    containerStyle: { margin: 0 },
    onPress: () => {
      clearAndApply('all');
      setShowFilters(false);
    },
  };
  const action = {
    id: 'apply',
    containerStyle: { margin: 0 },
    onPress: () => {
      applyFilters();
      setShowFilters(false);
    },
  };
  const filterKeys = Object.keys(filterConfig);
  const activeTabs = Object.keys(tempFilters).map(item =>
    filterKeys.findIndex(key => key === item),
  );

  const onDismiss = () => {
    setFilters(filters);
    setShowFilters(false);
  };
  if (!showFilters) return null;

  return (
    <ModalFullscreen
      noPadding
      visible={showFilters}
      onDismiss={onDismiss}
      action={action}
      action2={action2}>
      <View h={'100%'}>
        {/* <TabsWithIndicator noFilter activeTabs={activeTabs}> */}
        {filterKeys.map(filter => (
          <Filter
            key={filter}
            tabLabel={filterConfig[filter].label}
            id={filter}
            filters={tempFilters}
            // value={filters[filter]}
            {...filterConfig[filter]}
            setFilters={setFilters}
          />
        ))}
        {/* </TabsWithIndicator> */}
      </View>
    </ModalFullscreen>
  );
};

export default FilterContainer;
