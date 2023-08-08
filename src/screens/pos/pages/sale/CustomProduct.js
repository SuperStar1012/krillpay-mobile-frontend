import React from 'react';
import { View, Text } from 'components';
import { Pressable } from 'react-native';
import Input from 'components/inputs';

export default function CustomProduct(props) {
  const { onClear, index, onChange, item, context, error } = props;
  const { currency } = context;
  function handleClear() {
    onClear();
  }

  function handlePriceUpdate(value) {
    let temp = value.replace(',', '.');
    const split = (temp ?? '').split('.');
    if (split?.length === 1 || split[1].length <= currency.divisibility) {
      onChange('price', temp);
    }
  }

  return (
    <View ph={1.5} pt={1} pb={0.5}>
      <View fD="row" w="100%">
        <View f={1}>
          <Text>
            <Text fW="500" id="product" ns="pos"></Text>
            <Text fW="500"> {index + 1}</Text>
          </Text>
        </View>
        <Pressable onPress={handleClear}>
          <Text fW="500" tA="right" c="primary" id="clear" ns="pos" />
        </Pressable>
      </View>
      <Input
        config={{ label: 'Product name' }}
        value={item?.name}
        error={error && !item?.name && 'Name is required'}
        onChangeText={value => onChange('name', value)}
      />
      {/* <View fD="row" f={1}> */}
      {/* <View f={1} mr={1}> */}
      <Input
        config={{ label: 'Quantity', type: 'number' }}
        value={item?.quantity}
        error={error && !item?.quantity && 'Quantity is required'}
        onChangeText={value => onChange('quantity', value)}
      />
      {/* </View> */}
      {/* <View f={1}> */}
      <Input
        config={{ label: 'Price', type: 'number' }}
        value={item?.price}
        error={error && !item?.price && 'Price is required'}
        onChangeText={handlePriceUpdate}
      />
      {/* </View> */}
      {/* </View> */}
    </View>
  );
}
