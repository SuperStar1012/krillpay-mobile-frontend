import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button } from 'components';
import { OutlinedTextField } from 'rn-material-ui-textfield';
import { formatDivisibility, fromDivisibility } from 'utility/general';
import Gallery from 'components/outputs/Gallery';
import ProductCardHeader from '../components/ProductCardHeader';
import { Icon } from 'components/outputs/Icon';
import { formatAmountString, useConversion } from 'utility/rates';
import { formatVariantsString } from '../util';
import Selector from 'components/inputs/Selector';
import Markdown from 'components/outputs/Markdown';
import { useCart } from '../util/contexts/CartContext';
import HeaderNew from 'components/layout/HeaderNew';
import { currentCompanyServicesSelector } from 'screens/auth/redux/selectors';
import { useSelector } from 'react-redux';
import { conversionRatesSelector } from 'screens/accounts/redux/reducer';
import RadioSelector from 'components/inputs/RadioSelector';
import IconButton from 'components/inputs/IconButton';
import { useTranslation } from 'react-i18next';
import CartHeaderCounter from '../components/CartHeaderCounter';

export default function ProductDetail(props) {
  const { route, navigation } = props;
  const { item } = route?.params ?? {};
  const [cartQuantity, setCartQuantity] = useState('1');
  const quantityInputRef = useRef();
  const services = useSelector(currentCompanyServicesSelector);
  const rates = useSelector(conversionRatesSelector);

  const { currency, addToCart, loadingItem } = useCart();
  const loading = Boolean(loadingItem); //=== item?.id;

  if (!item || !currency) {
    navigation.goBack(); // TODO: fetch iteM?
  }

  const {
    type,
    description,
    name,
    quantity,
    prices = [],
    images = [],
    id,
    short_description,
    seller,
    tracked,
    variants = [],
    voucher_schema,
  } = item ?? {};

  const [init, setInit] = useState(false);

  useEffect(() => {
    setInit(true);
  }, []);

  useEffect(() => {
    if (init) navigation.goBack();
  }, [currency?.code]);

  const variantOptions = variants
    .map(item => {
      const { label, id, prices, options } = item;
      const { amount, currency } = prices?.[0] ?? {};
      return {
        label:
          (label ? label : formatVariantsString(options)) +
          (amount ? ' @ ' + formatAmountString(amount, currency, true) : ''),
        value: item.id,
        amount,
      };
    })
    .sort(function (a, b) {
      return a.amount - b.amount;
    });
  const [variant, setVariant] = useState(variantOptions?.[0]?.value ?? null);

  const code = currency?.code ?? '';

  const price = prices.find(price => price.currency.code === code);

  const priceMax = Math.max.apply(
    Math,
    variantOptions.map(function (o) {
      return o.amount;
    }),
  );
  const priceMin = Math.min.apply(
    Math,
    variantOptions.map(function (o) {
      return o.amount;
    }),
  );

  const priceString =
    variantOptions.length > 0 && priceMin && priceMax
      ? priceMin !== priceMax
        ? formatDivisibility(priceMin, currency.divisibility) +
          ' - ' +
          formatAmountString(priceMax, currency, true)
        : formatAmountString(priceMax, currency, true)
      : price
      ? (price.currency && price.currency.symbol) +
        (price.amount
          ? formatDivisibility(price.amount, price.currency.divisibility)
          : 'N/A'
        ).toString()
      : '';

  const { convRate, hasConversion } = useConversion(
    price?.amount ?? 0,
    services,
    currency,
  );

  let convPriceString = '';

  if (hasConversion && convRate) {
    convPriceString =
      '~' +
      (variantOptions.length > 0 && priceMin && priceMax
        ? priceMin !== priceMax
          ? parseFloat(fromDivisibility(priceMin, currency) * convRate).toFixed(
              rates?.displayCurrency?.divisibility,
            ) +
            ' - ' +
            formatAmountString(
              fromDivisibility(priceMax, currency) * convRate,
              rates?.displayCurrency,
            )
          : formatAmountString(
              fromDivisibility(priceMax, currency) * convRate,
              rates?.displayCurrency,
            )
        : price
        ? formatAmountString(
            fromDivisibility(price.amount, currency) * convRate,
            rates?.displayCurrency,
          )
        : '');
  }

  const actionOne = {
    id: 'add_to_cart',
    onPress: () => {
      addToCart(item, variant, parseInt(cartQuantity), navigation);
    },
    loading,
    wide: true,
    disabled: tracked && quantity === 0,
  };

  const QuantityComp =
    quantity < 10 && quantity !== null && tracked ? (
      <View w={'100%'} aI={'flex-end'}>
        <Text
          s={12}
          c={'error'}
          id={quantity === 0 ? 'out_of_stock' : 'stock_warning'}
          context={{ quantity }}
        />
      </View>
    ) : null;

  const { t } = useTranslation('common');

  return (
    <View w="100%" screen f={1}>
      <HeaderNew
        navigation={navigation}
        actions={
          <View ph={1} mt={0.25} mb={-0.25}>
            <CartHeaderCounter navigation={navigation} />
          </View>
        }
      />

      <View w="100%" ph={1.5} pt={0.5} scrollView>
        {images && images.length ? (
          <Gallery items={images} layout="horizontal" />
        ) : (
          <ProductCardHeader items={images} />
        )}

        <View
          // scrollView
          mt={0.25}
          style={{ borderBottomWidth: 0, borderColor: '#BEBEBE' }}>
          <View mb={0.75}>
            <Text s={18} fW="500">
              {name}
            </Text>
            {Boolean(seller?.id) && (
              <Text
                s={12}
                id="fulfilled_by"
                context={{ seller: seller?.name ?? seller?.id }}
              />
            )}
          </View>

          {Boolean(priceString) && (
            <View mb={0.25}>
              <Text s={20} c="primary" fW="500">
                {priceString}
              </Text>
              {hasConversion && (
                <View pt={0.5}>
                  <Text c="fontLight">{convPriceString}</Text>
                </View>
              )}
            </View>
          )}
        </View>
        {QuantityComp}

        {variants.length > 4 ? (
          <Selector
            label={'select_option'}
            items={variantOptions}
            value={variant}
            onValueChange={setVariant}
          />
        ) : variants.length > 1 ? (
          <RadioSelector
            label={'select_option'}
            items={variantOptions}
            value={variant}
            handleChange={setVariant}
          />
        ) : null}
        {type !== 'virtual' && (
          <View fD={'row'} jC={'center'} aI={'center'} mt={1}>
            <Button
              onPress={() => {
                const newQuantity = (parseInt(cartQuantity) - 1).toString();
                setCartQuantity(newQuantity);
                if (quantityInputRef) {
                  quantityInputRef.current.setValue(newQuantity);
                }
              }}
              disabled={cartQuantity < 2}>
              <Icon
                name={'ios-remove-circle-outline'}
                color={cartQuantity < 2 ? 'grey2' : 'font'}
              />
            </Button>
            <View ph={1} f={1}>
              <OutlinedTextField
                ref={quantityInputRef}
                label={t('quantity')}
                variant="outlined"
                keyboardType="numeric"
                value={cartQuantity}
                onChangeText={value => setCartQuantity(value)}
              />
            </View>
            <Button
              onPress={() => {
                const newQuantity = (parseInt(cartQuantity) + 1).toString();
                setCartQuantity(newQuantity);
                if (quantityInputRef) {
                  quantityInputRef.current.setValue(newQuantity);
                }
              }}
              //TODO: handle long press to fast change quantity
              disabled={
                typeof quantity === 'number' && cartQuantity >= quantity
              }>
              <Icon
                name={'ios-add-circle-outline'}
                color={
                  typeof quantity === 'number' && cartQuantity >= quantity
                    ? 'grey2'
                    : 'font'
                }
              />
            </Button>
          </View>
        )}
        <View mt={0.5} mb={0.25}>
          <Button {...actionOne} />
        </View>
        {description && (
          <View
            pv={0.5}
            mv={0.25}
            style={{ borderTopWidth: 0, borderColor: '#BEBEBE' }}>
            <Text fW="bold" id="description" />
            <Markdown>{description}</Markdown>
          </View>
        )}
      </View>
    </View>
  );
}
