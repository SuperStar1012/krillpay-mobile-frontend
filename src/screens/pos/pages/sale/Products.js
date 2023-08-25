import React from 'react';
import { View } from 'components';
import HeaderNew from 'components/layout/HeaderNew';
import ProductList from 'screens/pos/components/ProductList';
import { getProducts } from 'utility/rehive';
import ProductCard from 'screens/pos/components/ProductCard';
import PoSCheckout from 'screens/pos//components/PoSCheckout';
import PoSCartHeader from 'screens/pos/components/PoSProductHeader';
import { usePoS } from 'screens/pos/util/hooks';

const config = {
  props: { numColumns: 2 },
  variant: 'list',
  type: 'product',
  fetchData: getProducts,
  showCategories: true,
  gaurd: ({ filters }) => filters?.currency, //&& (cart?.seller?.id&& !)
  renderItem: ProductCard,
  // renderHeaderFixed: PoSProductHeader,
  emptyListMessage: 'No available products in this currency',
  component: ProductList,
};

export default function PoSProducts(props) {
  const { navigation } = props;
  const pageProps = usePoS();

  if (pageProps?.state) return <PoSCheckout {...props} {...pageProps} />;

  return (
    <View w="100%" screen f={1}>
      <HeaderNew
        navigation={navigation}
        // handleBack={() => navigation.replace('Private', { screen: 'Home' })}
        actions={<PoSCartHeader {...pageProps} />}
        backIcon={{
          set: 'SimpleLineIcons',
          name: 'grid',
          size: 20,
          color: 'primary',
          style: { padding: 4 },
        }}
      />
      <ProductList {...pageProps} config={config} navigation={navigation} />
    </View>
  );
}
