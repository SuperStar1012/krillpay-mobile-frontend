import React from 'react';

// import PropTypes from 'prop-types';
import { Text, View, Button, Spinner } from '../../../components';
import { Icon } from '../../../components/outputs/Icon';
import ErrorOutput from '../../../components/outputs/ErrorOutput';

export default function QuantityEdit(props) {
  const {
    quantityHook = {},
    cart,
    loading,
    item,
    removeFromCart,
    updateCartItemQuantity,
  } = props;
  const { value = item?.quantity, set = () => {} } = quantityHook;
  if (!item) {
    return null;
  }

  function handlePositive() {
    updateCartItemQuantity(item?.id, value + 1);
  }

  function handleNegative() {
    if (value > 1) {
      updateCartItemQuantity(item?.id, value - 1);
    } else {
      removeFromCart(cart?.id, item?.id);
    }
  }

  return (
    <View fD={'column'} jC={'center'} aI={'center'}>
      {loading ? (
        <Spinner size="small" />
      ) : (
        <>
          <Button onPress={handlePositive}>
            <Icon size={24} name={'ios-add-circle-outline'} color={'grey3'} />
          </Button>
          <View pv={0.25}>
            <Text c="primary" fW="700" s={25}>
              {value}
            </Text>
          </View>
          <Button onPress={handleNegative}>
            <Icon
              size={24}
              name={'ios-remove-circle-outline'}
              color={'grey3'}
            />
          </Button>
        </>
      )}
    </View>
  );
}
