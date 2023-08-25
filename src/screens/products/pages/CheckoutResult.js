import React, { useState, useEffect } from 'react';

import { useCart } from '../util/contexts/CartContext';
import ResultPage from 'components/layout/ResultPageNew';
import OrderItems from '../components/OrderItems';
import OrderDetails from '../components/OrderDetails';
import { getOrder } from 'utility/rehive';
import { useRehiveContext } from 'contexts/RehiveContext';
import { CommonActions } from '@react-navigation/native';

export default function CheckoutResult(props) {
  const { navigation, route } = props;
  const { result, cart, items } = route?.params ?? {};
  const { currency } = useCart();
  const {
    config: { productConfig },
  } = useRehiveContext();

  const [item, setItem] = useState(cart);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    const response = await getOrder(cart?.id);
    if (response?.status === 'success') {
      setItem(response.data);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (cart?.id) {
      fetchData();
    }
  }, [cart]);

  function handleNavigationBack() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'ProductLists',
          },
        ],
      }),
    );
  }

  return (
    <ResultPage
      result={result}
      title="order_total"
      amount={result?.data?.amount}
      currency={currency}
      header={
        <OrderItems
          color="white"
          item={item}
          items={items}
          loading={false}
          poll
        />
      }
      detail={
        <OrderDetails
          item={item}
          items={items}
          loading={false}
          hideId
          currency={currency}
        />
      }
      primaryAction={{
        id: productConfig?.voucherApp ? 'view_vouchers' : 'view_order',
        disabled: loading,
        onPress: () =>
          productConfig?.voucherApp
            ? navigation.handleNavigationBack()
            : navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'ProductLists',
                    },
                    {
                      name: 'OrderDetail',
                      params: { item, items },
                    },
                  ],
                }),
              ),
      }}
      secondaryAction={{
        id: 'continue_shopping',
        onPress: handleNavigationBack,
      }}
    />
  );
}
