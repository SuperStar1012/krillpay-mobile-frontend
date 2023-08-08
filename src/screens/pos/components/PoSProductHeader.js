import React from 'react';

import { Text, View } from 'components';
import { calculateInvoiceTotal } from 'utility/general';
import { formatAmountString } from 'utility/rates';
import { Pressable } from 'react-native';
import { Icon } from 'components/outputs/Icon';
import { calculateHasItems } from '../util/cart';

export default function PoSCartHeader(props) {
  const { setState, context, items, setError } = props;
  const {
    business: { currency },
  } = context;

  const request_amount = calculateInvoiceTotal(items, currency?.divisibility);
  const amountString = formatAmountString(request_amount, currency, true);
  const itemLength = items?.length ?? 0;
  const hasItems = calculateHasItems(items);

  function handleCheckout() {
    if (!hasItems) setError('Incomplete products');
    else setState('checkout');
  }

  const color = !hasItems ? 'fontLight' : 'primary';

  return (
    <Pressable onPress={handleCheckout}>
      <View fD="row" aI="center">
        <>
          <Text w="auto" c={color} s={15} fW="700">
            {amountString}
          </Text>
          <View
            bC={color}
            bR={200}
            h={22}
            w={22}
            aI="center"
            jC="center"
            ml={0.5}>
            <Text w="auto" c="white" s={12} lH={15} fW="700" lS={0}>
              {itemLength.toString()}
            </Text>
          </View>
        </>
        <View p={0.5}>
          {hasItems && (
            <View
              pos="absolute"
              bR={20}
              h={8}
              w={8}
              bC="#FF4C6F"
              style={{ top: 12, right: 12, zIndex: 100 }}></View>
          )}
          <Icon
            name="product"
            set="Custom"
            color={color}
            contained={false}
            size={28}
            padded
          />
        </View>
      </View>
    </Pressable>
  );
}
