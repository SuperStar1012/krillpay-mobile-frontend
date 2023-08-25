import React from 'react';

import { Text, View, Spinner } from 'components';
import { formatDivisibility } from 'utility/general';
import IconButton from 'components/inputs/IconButton';
import { useCart } from '../util/contexts/CartContext';

export default function CartHeaderCounter(props) {
  const { navigation } = props;

  const cartContext = useCart();
  const { cart, items, currency, loading } = cartContext;

  const priceString =
    currency && cart
      ? formatDivisibility(cart?.total_price, currency.divisibility)
      : formatDivisibility(0, currency?.divisibility);

  const itemLength = items?.length ?? 0;

  return (
    <View
      fD={'row'}
      aI={'center'}
      jC={'flex-start'}
      w="100%"
      pl={0.5}
      pv={0.25}
      pr={1}>
      <View f={1} jC="flex-end" fD="row" aI="center" w="auto">
        {loading ? (
          <Spinner size="small" style={{ paddingBottom: 2 }} />
        ) : (
          <>
            <Text w="auto" c="primary" s={15} fW="700">
              {priceString}
            </Text>
            <View
              bC="primary"
              bR={200}
              h={22}
              w={22}
              aI="center"
              jC="center"
              m={0.5}>
              <Text w="auto" c="white" s={12} lH={15} fW="700" lS={0}>
                {itemLength.toString()}
              </Text>
            </View>
          </>
        )}
        <IconButton
          icon="product"
          contained={false}
          size={20}
          padded={false}
          // disabled={!cart || !cart?.total_price}
          onPress={() => navigation.navigate('Checkout', { cart })}
        />
      </View>
    </View>
  );
}
