import React from 'react';
import { View, Text } from 'components';
import ProductCardHeader from './ProductCardHeader';
import { Dimensions, Pressable } from 'react-native';
import { useCart } from '../util/contexts/CartContext';
import { formatPriceString } from '../util/products';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ProductCard(props) {
  const { item, navigation } = props;
  const { currency } = useCart();

  if (!item) {
    return null;
  }

  const { name, images = [] } = item ?? {};

  const priceString = formatPriceString(item, currency);

  return (
    <Pressable
      key={item?.id}
      onPress={() => navigation.navigate('ProductDetail', { item })}>
      <View
        fD="column"
        style={{
          marginRight: 16, //index % 2 === 0 ? 16 : 12,
          marginLeft: 16, //index % 2 === 0 ? 12 : 16,
          marginBottom: 8,
        }}
        w={SCREEN_WIDTH / 2 - 40}>
        <ProductCardHeader items={images} />

        <View style={{ zIndex: 10 }} pv={0.5}>
          <Text>{name}</Text>
          {Boolean(priceString) && (
            <>
              <View h={4} />
              <Text c="primary" fW="600" s={18}>
                {priceString}
              </Text>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}
