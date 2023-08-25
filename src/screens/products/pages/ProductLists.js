import React from 'react';

import { View } from 'components';
import ProductCard from '../components/ProductCard';
import ProductList from '../components/ProductList';
import VoucherCard from '../components/VoucherCard';
import OrderCard from '../components/OrderCard';
import { getOrder, getOrders, getVouchers, getProducts } from 'utility/rehive';
import Page from 'components/containers/Page';
import CartHeader from '../components/CartHeader';
import { useCart } from '../util/contexts/CartContext';
import BitrefillCard from '../components/Bitrefill/BitrefillCard';
import VoucherOutput from '../components/VoucherOutput';
import { useRehiveContext } from 'contexts/RehiveContext';
import CategoriesDrawer from '../components/CategoriesDrawer';

const config = {
  id: 'products',
  defaultPage: 'available',
  variant: 'tabs', // TODO: add isBusiness logic here
  pages: {
    products: {
      props: { numColumns: 2 },
      variant: 'list',
      type: 'product',
      fetchData: getProducts,
      // fetchItem: fetchProd,
      showCategories: true,
      gaurd: ({ filters }) => filters?.currency, //&& (cart?.seller?.id&& !)
      renderItem: ProductCard,
      renderHeader: BitrefillCard,
      renderHeaderFixed: CartHeader,
      emptyListMessage: 'No available products in this currency',
      component: ProductList,
    },
    vouchers: {
      variant: 'list',
      type: 'voucher',
      fetchData: () => getVouchers('status=purchased'),
      // fetchData: getVouchers,
      renderItem: VoucherCard,
      emptyListMessage: 'No available products',
      modals: {
        voucher: VoucherOutput,
      },
    },
    orders: {
      variant: 'list',
      type: 'order',
      fetchData: getOrders,
      fetchItem: getOrder,
      filter: order => order.status !== 'pending',
      renderItem: OrderCard,
      emptyListMessage: 'No available products',
    },
  },
};

const voucherAppConfig = {
  ...config,
  pages: {
    my_vouchers: { ...config?.pages?.vouchers },
    buy_vouchers: { ...config?.pages?.products },
    // orders: config?.pages?.orders,
  },
};

export default function ProductLists(props) {
  const { cart } = useCart();
  const context = useRehiveContext();
  const {
    config: { productConfig },
  } = context;

  const { voucherApp } = productConfig;

  return (
    <View screen hC="header">
      <CategoriesDrawer>
        <Page
          {...props}
          config={voucherApp ? voucherAppConfig : config}
          context={{ ...context, cart }}
        />
      </CategoriesDrawer>
    </View>
  );
}
