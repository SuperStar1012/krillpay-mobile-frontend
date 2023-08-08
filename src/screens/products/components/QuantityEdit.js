import React from 'react';

// import PropTypes from 'prop-types';
import { Text, View, Button } from 'components';
import { Icon } from 'components/outputs/Icon';
import ErrorOutput from 'components/outputs/ErrorOutput';

const QuantityEdit = props => {
  const {
    quantityHook,
    loading,
    item,
    removeFromCart,
    removeLoading,
    updateCartItemQuantity,
    error,
  } = props;
  const { value, set } = quantityHook;
  if (!item) {
    return null;
  }

  return (
    <View>
      <View fD={'row'} jC={'center'} aI={'center'}>
        <Button onPress={() => set(value - 1)} disabled={value < 2}>
          <Icon
            name={'ios-remove-circle-outline'}
            color={value < 2 ? 'grey2' : 'font'}
          />
        </Button>
        <Text p={1}>{value}</Text>
        <Button onPress={() => set(value + 1)}>
          <Icon name={'ios-add-circle-outline'} color={'font'} />
        </Button>
      </View>
      <ErrorOutput>{error}</ErrorOutput>

      <View>
        <Button
          color={'primary'}
          label={'UPDATE'}
          wide
          loading={loading}
          disabled={loading || item.quantity === value}
          onPress={() => updateCartItemQuantity(item.id, value)}
        />
        <Button
          wide
          color={'error'}
          loading={removeLoading}
          type={'text'}
          label={'Remove'}
          onPress={() => removeFromCart(item)}
        />
      </View>
    </View>
  );
};

export default QuantityEdit;
// const CartFooter = context(_CartFooter);

// export { CartFooter };
