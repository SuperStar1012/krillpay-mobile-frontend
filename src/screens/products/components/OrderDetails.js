import React from 'react';
import { Text, View, Button } from 'components';
import { formatAmountString } from 'utility/rates';
import { mapItemNameString } from '../util/products';

import { isEmpty } from 'lodash';
import Output from 'components/outputs/OutputNew';

export default function OrderDetails(props) {
  const { item, items, loading, setShowItems, hideId } = props;

  if (!item || loading) return null;
  const { total_price, currency, billing_address, shipping_address, id } = item;

  const priceString = formatAmountString(total_price, currency, true);

  const simpleLayout = items?.length < 2;

  return (
    <>
      <View fD="column" w="100%" mb={1}>
        <View fD="row" jC="space-between">
          <Text fW="bold" id="order_summary" />
          {!simpleLayout && typeof setShowItems === 'function' && (
            <Button onPress={() => setShowItems(true)}>
              <Text c="primary" fW="bold" id="view_items" />
            </Button>
          )}
        </View>
        {!hideId && (
          <Output
            copy
            wrap
            valueColor
            horizontal
            label="ID"
            value={id}
            fontSize={14}
          />
        )}
        <View fD="column" pt={hideId ? 0.5 : 0}>
          {items.map(item => (
            <View key={item?.id} fD="row" jC="space-between" pb={0.5}>
              <Text style={{ flex: 1 }}>{mapItemNameString(item)}</Text>
              <Text>
                {formatAmountString(item?.total_price, currency, true)}
              </Text>
            </View>
          ))}
        </View>

        <View fD="row" w="100%">
          <Text fW="bold" id="total_" />
          <Text fW="bold" f={1} tA="right">
            {priceString}
          </Text>
        </View>
      </View>
      {!isEmpty(shipping_address) && (
        <View fD="column" w="100%" mb={1}>
          <Text fW="bold" id="shippingAddress" />
          <Text lH={26}>{shipping_address}</Text>
        </View>
      )}
      {!isEmpty(billing_address) && (
        <View fD="column" w="100%" mb={1}>
          <Text fW="bold" id="billingAddress" />
          <Text lH={26}>{billing_address}</Text>
        </View>
      )}
    </>
  );
}
