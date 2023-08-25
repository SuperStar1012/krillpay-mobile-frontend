import React, { useState } from 'react';
import { View, Text, Button } from 'components';
import { formatVariantsString } from 'screens/products/util';
import { formatAmountString } from 'utility/rates';
import Stepper from 'components/inputs/Stepper';
import Selector from 'components/inputs/SelectorNew';
import { toDivisibility, fromDivisibility } from 'utility/general';

function useProductVariants(product) {
  const { variants } = product;

  const variantOptions = variants
    .map(item => {
      const { label, id, prices, options } = item;
      const { amount, currency } = prices?.[0] ?? {};
      return {
        label: label
          ? label + (' @ ' + formatAmountString(amount, currency, true))
          : formatVariantsString(options, { label: true }),
        value: item.id,
        amount,
      };
    })
    .sort(function (a, b) {
      return a.amount - b.amount;
    });
  const [variant, setVariant] = useState(variantOptions?.[0]?.value ?? null);
  return { variant, setVariant, variantOptions };
}

export default function ProductCardOverlay(props) {
  const {
    item,
    selected,
    setSelected,
    context = {},
    handleAddItem,
    showToast,
    setState,
  } = props;
  const { currency } = context;

  if (!item || selected !== item?.id) {
    return null;
  }

  const { name, variants, options, images, id } = item ?? {};

  const { variant, setVariant, variantOptions } = useProductVariants(item);

  const [quantity, setQuantity] = useState(1);

  const showVariants = variantOptions?.length > 1;
  function handleAdd() {
    const variantObj = variant
      ? variants.find(item => item.id === variant)
      : null;
    const tempName =
      name +
      (variantObj
        ? ' (' +
          (variantObj.label
            ? variantObj.label
            : formatVariantsString(options, { label: true })) +
          ')'
        : '');

    const prices = variantObj?.prices ?? item?.prices;
    const price = prices.find(item => item.currency?.code === currency?.code);
    const tempItem = {
      id,
      name: tempName,
      quantity,
      price: fromDivisibility(price?.amount, price?.currency),
      image: images?.[0]?.file ?? '',
    };

    showToast({
      text: tempName ?? 'Product',
      subtitle: 'Added to cart',
      actionLabel: 'View cart',
      actionOnPress: () => setState('checkout'),
    });
    handleAddItem(tempItem);
    setSelected(null);
  }

  return (
    <View
      h="100%"
      w="110%"
      pos="absolute"
      jC="center"
      bC="rgba(0,0,0,0.6)"
      style={{ zIndex: 1000 }}>
      <View bC="white" m={0.25} bR={10} p={0.25}>
        {showVariants ? (
          <View pt={0.75}>
            <View pb={0.5}>
              <Text id="please_select" s={14} tA="center" c="fontLight" />
            </View>
            <Selector
              value={variant}
              items={variantOptions}
              onValueChange={setVariant}
            />
          </View>
        ) : (
          <View />
        )}
        <Stepper
          value={quantity}
          setValue={setQuantity}
          fD={'row-reverse'}
          w="100%"
          jC="space-between"
          pv={0.5}
        />
        <Button
          buttonStyle={{ height: 20, padding: 0 }}
          size="small"
          id="add"
          onPress={handleAdd}
          wide
        />
      </View>
    </View>
  );
}
