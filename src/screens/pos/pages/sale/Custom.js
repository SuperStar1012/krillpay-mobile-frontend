import React, { useState } from 'react';
import { View, Text, ButtonList } from 'components';
import HeaderNew from 'components/layout/HeaderNew';
import PoSCheckout from 'screens/pos/components/PoSCheckout';
import PoSCartHeader from 'screens/pos/components/PoSProductHeader';
import { usePoS } from 'screens/pos/util/hooks';
import { uuidv4 } from 'utility/general';
import { calculateHasItems } from 'screens/pos/util/cart';
import CustomProduct from './CustomProduct';
import { useToast } from 'contexts/ToastContext';
import { Keyboard } from 'react-native';

const empty = () => ({
  name: '',
  quantity: '',
  price: '',
  id: uuidv4(),
});
export default function PoSCustom(props) {
  const { navigation } = props;

  const pageProps = usePoS();
  const { setItems, setState, state, context, error, setError, items } =
    pageProps;

  const [item, setItem] = useState(empty());

  const { showToast } = useToast();

  if (state) return <PoSCheckout {...props} {...pageProps} id="custom" />;

  function handleAdd() {
    Keyboard.dismiss();
    let temp = [...items];
    temp.push(item);
    setError('');
    setItems(temp);
    setItem(empty());
    showToast({
      text: item?.quantity + 'x' + item?.name + ' added to cart',
      subtitle: 'Added to cart',
      actionLabel: 'View cart',
      actionOnPress: () => setState('checkout'),
    });
  }

  function handleClear() {
    setItem(empty);
  }

  function handleChange(field, value) {
    try {
      const temp = { ...item, [field]: value };
      setItem(temp);
    } catch (e) {
      console.log('handleEdit -> e', e);
    }
  }
  // const { control, register } = useForm();

  function handleCheckout() {
    if (!calculateHasItems(items)) setError('Incomplete products');
    else setState('checkout');
  }

  let buttons = [
    {
      label: 'ADD TO CART',
      disabled: !calculateHasItems([item]),
      onPress: handleAdd,
    },
    {
      label: 'View cart',
      type: 'text',
      onPress: handleCheckout,
    },
  ];

  return (
    <View w="100%" screen f={1}>
      <HeaderNew
        // navigation={props.navigation}
        handleBack={() => navigation.pop(2)}
        back
        actions={<PoSCartHeader {...pageProps} items={items} />}
        backIcon={{
          set: 'SimpleLineIcons',
          name: 'grid',
          size: 20,
          color: 'primary',
          style: { padding: 4 },
        }}
      />
      <Text
        tA="center"
        s={18}
        c="fontDark"
        fW="500"
        id="custom_sale"
        ns="pos"
        paragraph
      />
      <View scrollView dismiss keyboardAvoiding>
        {/* <View ph={1}>
          <Text
            tA="center"
            s={16}
            id={
              hasItems ? 'custom_sale_description' : 'empty_custom_pos_products'
            }
            p={0.5}
            c="fontLight"
          />
        </View> */}
        <CustomProduct
          context={context}
          item={item}
          onClear={handleClear}
          onChange={handleChange}
          error={error}
          index={items?.length}
        />
        <ButtonList items={buttons} ph={1.5} pt={1} />
      </View>
    </View>
  );
}
