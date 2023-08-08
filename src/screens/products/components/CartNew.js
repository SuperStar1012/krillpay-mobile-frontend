import React from 'react';
// import PropTypes from 'prop-types';

import CartList from './CartList';
import { View, Text, Button } from 'components';
import { formatAmountString } from 'utility/rates';

export default function Cart(props) {
  const { cart, currency, items, onSuccess, onCancel } = props;
  const priceString = formatAmountString(cart?.total_price, currency, true);

  return (
    <React.Fragment>
      <CartList {...props} />

      <View w={'100%'} fD="row" jC="space-between" ph={1.5} pt={0.5}>
        <Text s={20} fW="bold" id="total" />
        <Text c="primary" s={20} fW="bold" tA="right">
          {priceString}
        </Text>
      </View>
      <View p={1.5}>
        <Button
          color={'primary'}
          id={'continue'}
          wide
          disabled={!items?.length > 0}
          onPress={onSuccess}
        />
        <Button wide type={'text'} id={'cancel'} onPress={onCancel} />
      </View>
    </React.Fragment>
  );
}
