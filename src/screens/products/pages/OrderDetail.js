import React, { useState } from 'react';
import { View, Text, Button } from 'components';
import { formatTime, standardizeString } from 'utility/general';
import OrderItemsImages from '../components/OrderItemsImages';
import HeaderNew from 'components/layout/HeaderNew';
import { useRehiveContext } from 'contexts/RehiveContext';
import OrderDetails from '../components/OrderDetails';
import OrderDetailItems from '../components/OrderDetailItems';

export default function OrderDetail(props) {
  const { route, navigation, loading } = props;
  const { item, items } = route?.params ?? {};

  const [showItems, setShowItems] = useState(false);

  if (!item || loading) return null;
  const { placed, status, id } = item;

  const {
    context: { user },
  } = useRehiveContext();

  const dateString = formatTime(placed, 'lll', user);
  const statusString = standardizeString();

  function handleBack() {
    if (showItems) {
      setShowItems(false);
    } else {
      navigation.goBack();
    }
  }

  const simpleLayout = items?.length < 2;

  return (
    <View screen>
      <HeaderNew title={'order_details'} handleBack={handleBack} />
      <View fD="row" w="100%" ph={1.5} p={0.5}>
        <Text t="b2" c="fontLight">
          {dateString}
        </Text>
        <Text t="b2" c="primary" fW="bold" tA="right" f={1} id={status} />
      </View>
      {showItems ? (
        <OrderDetailItems items={items} item={item} />
      ) : (
        <>
          <Button onPress={() => setShowItems(true)} disabled={simpleLayout}>
            <View mv={0.5} fD="row" w="100%" ph={1.5} mb={1}>
              {loading ? (
                <OrderItemsImages.Skeleton />
              ) : (
                <OrderItemsImages showDetail order={item} items={items} />
              )}
            </View>
          </Button>
          <View ph={1.5}>
            <OrderDetails
              item={item}
              items={items}
              loading={loading}
              setShowItems={setShowItems}
            />
          </View>
        </>
      )}
    </View>
  );
}
