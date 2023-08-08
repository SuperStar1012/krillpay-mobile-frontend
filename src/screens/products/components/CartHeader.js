import React from 'react';

// import PropTypes from 'prop-types';
import {
  Text,
  View,
  Button,
  PopUpGeneral,
  Spinner,
  ButtonList,
} from 'components';
import { displayFormatDivisibility } from 'utility/general';
import { Icon } from 'components/outputs/Icon';
import IconButton from 'components/inputs/IconButton';
import { getCurrencyCode } from 'utility/rates';
import CurrencyBadge from 'components/outputs/CurrencyBadge';
import { useModal } from 'utility/hooks';
import { useCart } from '../util/contexts/CartContext';
// import { useNavigation } from '@react-navigation/native';
import Images from './images';
import { primaryCurrenciesSelector } from 'screens/accounts/redux/reducer';
import { useSelector } from 'react-redux';
import { configProductSelector } from '@redux/rehive/selectors';
import { useQuery } from 'react-query';
import { useRehiveContext } from 'contexts';
import { getProductCategories } from 'utility/rehive';

export default function CartHeader(props) {
  const { navigation, setDrawerOpen } = props;

  const cartContext = useCart();
  const { company } = useRehiveContext();
  const { data, isLoading } = useQuery(
    [company?.id, 'product-categories'],
    getProductCategories,
    { enabled: true },
  );
  const {
    cart,
    items,
    currency,
    setCurrency,
    loading,
    loadingCart,
    clearCart,
    filters,
  } = cartContext;

  const priceString =
    currency && cart
      ? displayFormatDivisibility(cart?.total_price, currency.divisibility)
      : displayFormatDivisibility(0, currency?.divisibility);

  const itemLength = items?.length ?? 0;

  const productConfig = useSelector(configProductSelector);
  const primaryCurrencies = useSelector(primaryCurrenciesSelector);
  let currencyOptions = primaryCurrencies?.items?.map(item => {
    return {
      key: item.currency.code,
      label: getCurrencyCode(item.currency),
      value: item,
    };
  });
  if (productConfig?.currencies?.length > 0)
    currencyOptions = currencyOptions.filter(
      item =>
        productConfig?.currencies.findIndex(curr => curr === item.key) !== -1,
    );

  const selectorDisabled = currencyOptions?.length === 1;

  const { modalVisible, hideModal, showModal } = useModal();

  return (
    <>
      <View mh={1} pr={0.25} pt={0} fD="row">
        {isLoading ? (
          <Spinner size="small" style={{ maxHeight: 24, marginLeft: -8 }} />
        ) : data?.results?.length > 0 ? (
          <View mr={0.5} w="auto" fD="row" aI="center">
            {/* {Boolean(category) && (
            <Button onPress={() => setFilters({ ...filters, categories: [] })}>
              <View mr={0.5} fD="row" aI="center" style={{ left: -8 }}>
                <Icon
                  name="chevron-left"
                  color="primary"
                  size={24}
                  set={'MaterialIcons'}
                />
                <Text p={0.125} s={16} lH={18} c="primary" w="auto">
                  {category?.name}
                </Text>
              </View>
            </Button>
          )} */}
            <Button onPress={setDrawerOpen}>
              <Icon
                name="list"
                color={filters?.categories?.length ? 'primary' : 'fontLight'}
                size={24}
                set={'MaterialIcons'}
              />
            </Button>
          </View>
        ) : null}

        {Boolean(cart?.seller?.id) && (
          <Button onPress={() => showModal('clear')}>
            <View bR={20} ph={0.5} c="primary" w="auto" fD="row" aI="center">
              <Text p={0.125} s={12} lH={16} c="primary" w="auto">
                <Text id="filtered_by_seller" s={12} lH={16} c="primary" />
                {': ' + cart?.seller?.name}
              </Text>
              <Icon
                style={{ paddingLeft: 8 }}
                name="close"
                color="primary"
                size={16}
                set={'MaterialIcons'}
              />
            </View>
          </Button>
        )}
        {/* <View f={1} aI="flex-end">
          <Icon
            name="filter-list"
            color="fontLight"
            size={24}
            set={'MaterialIcons'}
          />
        </View> */}
        {/* <View f={1} bC="orange" w="100%" /> */}
      </View>
      <View
        fD={'row'}
        aI={'center'}
        jC={'flex-start'}
        w="100%"
        pl={0.5}
        pv={0.25}
        pr={1}>
        <Button
          containerStyle={{ margin: 0 }}
          buttonStyle={{ paddingLeft: 8, justifyContent: 'flex-start' }}
          // type={'text'}
          color={'white'}
          disabled={selectorDisabled}
          onPress={() => showModal('currency')}>
          <View fD={'row'} ph={0.5} fW={'600'} aI="center">
            <CurrencyBadge
              length={1}
              size={20}
              text={currency?.code}
              currency={currency}
            />
            <Text style={{ paddingLeft: 8 }} fW="semd-bold">
              {cart?.currency ?? currency ? getCurrencyCode(currency) : '---'}
            </Text>
            {!selectorDisabled && (
              <Icon
                name="chevron-down"
                size={20}
                set={'MaterialCommunityIcons'}
              />
            )}
          </View>
        </Button>
        <View f={1} jC="flex-end" fD="row" aI="center" w="auto" h={30}>
          {loading ? (
            <Spinner size="small" />
          ) : (
            <>
              <Text w="auto" c="primary" s={15} fW="700">
                {priceString}
              </Text>
              <View
                bC="primary"
                bR={200}
                h={22}
                w={22}
                aI="center"
                jC="center"
                m={0.25}>
                <Text w="auto" c="white" s={12} lH={15} fW="700" lS={0}>
                  {itemLength.toString()}
                </Text>
              </View>
            </>
          )}
          <IconButton
            icon="product"
            contained={false}
            size={20}
            padded={false}
            onPress={() => navigation.navigate('Checkout', { cart })}
          />
        </View>
      </View>
      <PopUpGeneral
        visible={modalVisible === 'currency'}
        scrollView
        onDismiss={hideModal}
        docked>
        {currencyOptions?.map(item => (
          <View mb={0.5} key={item.key} f={1}>
            <Button
              label={item.label}
              wide
              onPress={() => {
                setCurrency(item?.value?.currency);
                hideModal();
              }}
            />
          </View>
        ))}
        <Button label={'Close'} type="text" wide onPress={hideModal} />
      </PopUpGeneral>
      <PopUpGeneral
        visible={modalVisible === 'clear'}
        scrollView
        iconTitleRight="close"
        onPressTitleRight={hideModal}
        onDismiss={hideModal}>
        <View ph={1}>
          <Images name="product" size={95} />
          <Text
            tA="center"
            p={0.5}
            t="h5"
            c="primary"
            fW="bold"
            id="clear_cart_title"
          />
          <View pb={1}>
            <Text
              p={0.5}
              tA="center"
              id="clear_cart_description"
              context={{ seller: cart?.seller?.name ?? 'a seller' }}
            />
          </View>
          <ButtonList
            items={[
              {
                id: 'checkout',
                onPress: () => {
                  hideModal();
                  navigation.navigate('Checkout', { cart });
                },
              },
              {
                id: 'clear_cart',
                type: 'text',
                wide: true,
                loading: loadingCart,
                onPress: async () => {
                  await clearCart();
                  hideModal();
                },
              },
            ]}
          />
        </View>
      </PopUpGeneral>
    </>
  );
}
