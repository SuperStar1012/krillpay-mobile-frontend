import React, { useEffect, useState } from 'react';
import { Text, View, Button } from 'components';
import { formatTime, standardizeString } from 'utility/general';

import { getOrderItems } from 'utility/rehive';
import { useRehiveContext } from 'contexts/RehiveContext';
import OrderItems from './OrderItems';

export default function OrderCard(props) {
  const { item, navigation } = props;
  const {
    context: { user },
  } = useRehiveContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    const response = await getOrderItems(item?.id);
    if (response?.status === 'success') {
      setItems(response.data.results);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (item?.id) {
      fetchData();
    }
  }, [item]);

  if (!item || loading) return null;
  const { placed, status } = item;

  const dateString = formatTime(placed, 'll', user);
  const statusString = standardizeString(status);

  return (
    <Button onPress={() => navigation.navigate('OrderDetail', { item, items })}>
      <View pv={0.5} ph={1.5} bC="grey1" w="100%" mv={0.5}>
        <View fD="row" w="100%">
          <Text t="b2" c="fontLight">
            {dateString}
          </Text>
          <Text t="b2" c="primary" fW="bold" tA="right" f={1}>
            {statusString}
          </Text>
        </View>
        <OrderItems items={items} item={item} loading={loading} />
      </View>
    </Button>
  );
}
