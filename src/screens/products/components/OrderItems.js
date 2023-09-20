import React from 'react';
import { Text, View } from 'components';
import { formatAmountString } from 'utility/rates';

import SkeletonPlaceholder from 'expo-react-native-skeleton-placeholder';
import OrderItemsImages from './OrderItemsImages';

export default function OrderItems(props) {
  const { item, items, loading, color = 'font', poll } = props;

  if (!item || loading) return null;
  const { total_price, currency } = item;

  const priceString = formatAmountString(total_price, currency, true);

  const count = items?.length;
  return (
    <>
      <View mv={0.5} fD="row" w="100%">
        {loading ? (
          <OrderItemsImages.Skeleton />
        ) : (
          <OrderItemsImages {...props} orderId={item?.id} />
        )}
      </View>
      <View fD="row" w="100%">
        {loading ? (
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              // marginTop={8}
              width={80}
              height={14}
              borderRadius={10}
            />
          </SkeletonPlaceholder>
        ) : (
          <Text
            t="b2"
            c={color}
            id={count === 1 ? 'item_count_one' : 'item_count_other'}
            context={{ count }}
          />
        )}
        <View fD="row" f={1} c={color}>
          <View fD="row" f={1} pr={0.25}>
            <Text t="b2" tA="right" f={1} c={color} id="total_"></Text>
          </View>
          <Text fW="bold" c={color}>
            {priceString}
          </Text>
        </View>
      </View>
    </>
  );
}
