import React from 'react';

import config from './config';
import { createStackNavigator } from '@react-navigation/stack';
import { CartProvider } from './util/contexts/CartContext';

const Stack = createStackNavigator();

export default function ProductsNavigator(props) {
  const { pages } = config;

  return (
    <CartProvider>
      <Stack.Navigator
        initialRouteName="Products"
        backBehavior="initialRoute"
        screenOptions={{ headerShown: false }}>
        {Object.keys(pages).map(key => (
          <Stack.Screen key={key} name={key} component={pages?.[key]} />
        ))}
      </Stack.Navigator>
    </CartProvider>
  );
}

// const {
//   config: { productConfig },
// } = useRehiveContext();
// const primaryCurrencies = useSelector(primaryCurrenciesSelector);

// async function fetchCategories() {
//   setLoading('categories');
//   const resp = await getProductCategories();
//   console.log('fetchCategories -> resp', resp);
//   const results = resp?.data?.results ?? [];

//   setCategories(results);
//   setLoading(false);
// }

// const showCategories = true;
// useEffect(() => {
//   setLoading(true);
//   if (showCategories) {
//     fetchCategories();
//   } else {
//     setLoading(false);
//   }
// }, [showCategories]); //productConfig.layout]);

// const context = {
//   primaryCurrencies,
//   productConfig,
//   // categories,
//   // categoriesLoading: loading === 'categories',
// };
