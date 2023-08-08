import React from 'react';
import { View } from '../layout/View';
import { Output } from './Output';
import { ListSeparator } from './ListItem';

const OutputList = props => {
  const { items, m, layout, p, vertical, outputProps, ...restProps } = props;

  if (!items || !items.length || items.length === 0) {
    return null;
  }

  return (
    <View
      fD={layout ? layout : 'column'}
      m={m ? m : 0}
      p={p ? p : 0}
      jC={'flex-start'}
      aI={'flex-start'}
      {...restProps}>
      {items.map(
        (item, index) =>
          item && (
            <View
              pb={index < items?.length - 1 ? 0.5 : 0}
              w={'100%'}
              key={
                item.id ? item.id : item.value ? item.label + item.value : index
              }>
              {item === 'divider' ? (
                <ListSeparator />
              ) : (
                <Output {...item} vertical={vertical} {...outputProps} />
              )}
            </View>
          ),
      )}
    </View>
  );
};

export default OutputList;

/*
TODO:
1. Move into Output and use import as "Output.List"??

*/
