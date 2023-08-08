import React, { useContext, useEffect, useState } from 'react';

import {
  createOrder,
  createOrderItemNew,
  updateOrderItem,
  deleteOrderItem,
  getOrdersNew as getOrders,
  getOrderItemsNew as getOrderItems,
  deleteOrder,
} from 'utility/rehive';
import { useRehiveContext } from 'contexts/RehiveContext';
import { useToast } from 'contexts/ToastContext';

import { useQueryClient, useQuery } from 'react-query';
import { primaryCurrenciesSelector } from 'screens/accounts/redux/reducer';
import { useSelector } from 'react-redux';
import { useToggle } from 'utility/hooks';

const CartContext = React.createContext({
  cart: null,
  items: [],
  error: '',
  loading: false,
});

function CartProvider({ children }) {
  const {
    config: { productConfig },
  } = useRehiveContext();
  const primaryCurrencies = useSelector(primaryCurrenciesSelector);

  const {
    methods: { showToast },
  } = useToast();

  const { defaultCurrency } = productConfig;
  const temp = productConfig?.currencies?.[0];

  const initialCurrency = primaryCurrencies?.items.find(
    item => item?.currency?.code === temp,
  );

  let [currency, setCurrency] = useState(
    productConfig?.currencies?.length > 0
      ? initialCurrency?.currency
      : primaryCurrencies?.primary?.currency ??
          primaryCurrencies?.items?.[0]?.currency,
  );
  if (productConfig?.currencies?.length === 1)
    currency = initialCurrency?.currency;
  // const navigation = useNavigation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingItem, setLoadingItem] = useState('');
  const [filters, setFilters] = useState({});

  const queryClient = useQueryClient();
  const enabled = !!currency?.code;
  const query = useQuery(
    ['cart', currency?.code],
    () => getOrders('currency=' + currency?.code + '&status=pending'),
    {
      enabled,
    },
  );

  const cartTemp = query?.data?.results?.[0] ?? { currency };
  const cart =
    cartTemp?.currency?.code === currency?.code ? cartTemp : { currency };
  const cartID = cart?.id ?? '';
  const itemsEnabled = enabled && Boolean(cartID);
  const queryItems = useQuery(
    ['cartItems', cartID],
    () => getOrderItems(cartID),
    null,
    {
      enabled: itemsEnabled,
    },
  );
  const isLoading = query?.isLoading || queryItems?.isLoading;

  useEffect(() => {
    if (!queryItems?.isFetching) {
      setLoadingItem(false);
    }
  }, [queryItems?.isFetching]);
  const items = cartID ? queryItems?.data?.results ?? [] : [];

  function refresh() {
    queryClient.invalidateQueries('cart');
    query.refetch();
    queryItems.refetch();
  }
  useEffect(() => {
    // setLoading(true);
    refresh();
  }, [cartID, currency?.code]);

  async function resetCart() {
    setLoading(true);
    try {
      refresh();
    } catch (e) {
      setError(e?.message);
    }
    setLoading(false);
  }

  async function clearCart() {
    setLoadingCart(true);
    try {
      const resp = await deleteOrder(cart?.id);
      if (resp?.status === 'success') {
        queryClient.setQueryData(['cart', currency?.code], null);
        queryClient.setQueryData(['cart', cart?.id], []);
        refresh(); // mutation
      }
    } catch (e) {
      setError(e?.message);
    }
    setLoadingCart(false);
    return true;
  }

  useEffect(() => {
    if (defaultCurrency) {
      const temp = primaryCurrencies?.items?.find(
        currency => currency?.currency?.code === defaultCurrency,
      );
      if (temp?.currency) {
        setCurrency(temp?.currency);
      }
    } else {
      setCurrency(
        primaryCurrencies?.primary?.currency ??
          primaryCurrencies?.items?.[0]?.currency,
      );
    }
  }, []);

  function handleCurrencyChange(currency) {
    setCurrency(currency);
  }

  async function addToCart(product, variantId, quantity = 1, navigation) {
    let resp = null;
    const productId = product?.id;
    setLoading(productId);
    setLoadingItem(productId);

    let data = {
      quantity,
      product: productId ? productId : product.id,
    };
    if (variantId) {
      data.variant = variantId;
    }

    try {
      if (!cartID) {
        resp = await createOrder(currency?.code);
        queryClient.setQueryData(['cart', currency?.code], { results: [resp] });
        if (resp.status === 'success') {
          resp = await createOrderItemNew(resp?.data?.id, data);
          queryClient.setQueryData(['cart', resp?.data?.id], {
            results: [resp],
          });
        } else {
          setError(resp?.message);
        }
      } else {
        const cartItem = items.find(
          item =>
            item.product === productId &&
            (variantId ? item?.variant?.id === variantId : true),
        );
        if (cartItem) {
          resp = await updateCartItemQuantity(
            cartItem.id,
            cartItem.quantity + quantity,
          );
        } else {
          resp = await createOrderItemNew(cartID, data);
        }
      }
      refresh();
      if (resp?.status === 'success') {
        showToast({
          title: product.name ?? 'Product',
          subtitle: 'added_to_cart',
          actionLabel: 'view_cart',
          actionOnPress: () => navigation?.navigate('Checkout', { cart }) ?? {},
          duration: 3000,
        });
        // fetchCart();
      } else {
        setError(resp?.message);
        showToast({
          text:
            'Unable to add product to cart' +
            (resp?.message ? ': ' + resp.message : ''),
          variant: 'error',
        });
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
      showToast({
        title:
          'Unable to add product to cart' +
          (resp.message ? ': ' + resp.message : ''),
        variant: 'error',
      });
    }
    setLoadingItem('');
  }

  async function updateCartItemQuantity(itemID, quantity) {
    setLoadingItem(itemID);
    try {
      const resp = await updateOrderItem(cartID, itemID, quantity);
      if (resp.status === 'error') {
        setError(resp?.message);
      } else {
        refresh();
        return resp;
      }
    } catch (e) {
      console.log('updateCartItemQuantity -> e', e);
      setError(e?.message);
    }
    setLoadingItem('');
    setLoading(false);
  }

  async function removeFromCart(cartID, itemID) {
    setLoadingItem(itemID);
    try {
      if (items.length === 1) {
        const resp = await clearCart();
        if (resp) {
          showToast({
            text: 'Product item successfully removed from cart',
            duration: 3000,
          });
        }
      } else {
        const resp = await deleteOrderItem(cartID, itemID);
        if (resp.status === 'error') {
          setError(resp?.message);
          setLoadingItem('');
        } else {
          showToast({
            text: 'Product item successfully removed from cart',
            duration: 3000,
          });
          refresh();
          // fetchCart();
        }
      }
    } catch (e) {}
    setLoadingItem('');
  }

  const {
    setFalse: hideDrawer,
    setTrue: openDrawer,
    value: drawerOpen,
  } = useToggle();

  const functions = {
    setCurrency: handleCurrencyChange,
    switchCart: handleCurrencyChange,
    addToCart,
    // fetchCart,
    // fetchCartItems,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    resetCart,
    hideDrawer,
    openDrawer,
    // setLoading, setLoadingItem,
  };

  return (
    <CartContext.Provider
      value={{
        currency,
        cart,
        items,
        error,
        loading: isLoading,
        loadingCart,
        loadingItem,
        loadingItems: queryItems?.isLoading,
        drawerOpen,
        filters,
        setFilters,
        ...functions,
      }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export { CartContext, CartProvider, useCart };
