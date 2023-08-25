import React from 'react';
import { View, Text } from 'components';
import ProductCardHeader from './ProductCardHeader';
import { Dimensions, Pressable } from 'react-native';
import { formatPriceString } from 'screens/products/util/products';
import ProductCardOverlay from './ProductCardOverlay';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ProductCard(props) {
  const { item, context = {}, setSelected, selected } = props;
  const { currency } = context;

  if (!item) {
    return null;
  }

  const { name, images = [] } = item ?? {};
  // console.log('ProductCard -> item', item);

  // console.log('ProductCard -> variantOptions', variantOptions);
  const priceString = formatPriceString(item, currency);

  function handlePress() {
    if (selected === item?.id) setSelected(null);
    else setSelected(item?.id);
  }

  return (
    <Pressable key={item?.id} onPress={handlePress}>
      <View
        fD="column"
        style={{
          marginRight: 16, //index % 2 === 0 ? 16 : 12,
          marginLeft: 16, //index % 2 === 0 ? 12 : 16,
          marginBottom: 8,
        }}
        w={SCREEN_WIDTH / 2 - 40}>
        <ProductCardOverlay {...props} />
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
