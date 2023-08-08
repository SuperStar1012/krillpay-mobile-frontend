import React from 'react';
import { ProductFilterConfig } from '../config/filters';
import FilterContainer from 'components/filter/FilterContainer';

const ProductFilters = props => {
  return <FilterContainer {...props} filterConfig={ProductFilterConfig} />;
};

export default ProductFilters;
