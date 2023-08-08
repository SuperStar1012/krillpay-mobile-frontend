import React from 'react';
// import PropTypes from 'prop-types';
import { Button } from '../inputs/Button';
import { View } from './View';

export default function PaginationListFooter(props) {
  const { next, loading, getNext } = props;

  if (!next) {
    return null;
  }

  return (
    <View w={'100%'} aI={'center'}>
      <Button
        type={'text'}
        color={'primary'}
        label={'SHOW MORE'}
        loading={loading}
        onPress={getNext}
      />
    </View>
  );
}

/*
TODO:
This should be under another component such as "List" or "DataList"

*/
