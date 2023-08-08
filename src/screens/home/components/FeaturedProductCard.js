import React from 'react';
import { useSelector } from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Image from 'components/outputs/Image';
import { TouchableOpacity, Dimensions } from 'react-native';
import { View, Text } from 'components';
import { displayCurrencySelector } from 'screens/accounts/redux/reducer';
import Images from './images';
import { formatPriceString } from 'screens/products/util/products';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function FeaturedProductCard(props) {
  const { loading, navigation, item, layout, wallet } = props;
  const { name, images } = item;

  const displayCurrency = useSelector(displayCurrencySelector);

  const priceString = formatPriceString(
    item,
    wallet ? wallet?.currency : displayCurrency,
    true,
  );

  const skeleton = (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item width={'100%'} height={150} borderRadius={10} />
    </SkeletonPlaceholder>
  );

  return loading ? (
    skeleton
  ) : (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Products', { state: 'ProductDetail', item })
      }>
      <View fD={layout ?? 'column'} aI={layout ? 'center' : 'flex-start'}>
        <View>
          {!!images?.length ? (
            <View mb={layout ? 0 : 0.75}>
              <Image
                src={images?.[0]?.file}
                resizeMode={'cover'}
                height={layout ? SCREEN_WIDTH / 3 : 150}
                width={layout ? SCREEN_WIDTH / 3 : '100%'}
                style={{ borderRadius: 10 }}
              />
            </View>
          ) : (
            <Images
              size={layout ? SCREEN_WIDTH / 3 : 150}
              name="productPadded"
            />
          )}
        </View>

        <View ml={layout ? 1 : 0}>
          <View mb={layout ? 0.25 : 0}>
            <Text s={layout ? 18 : 16} id={name} />
          </View>
          <Text s={layout ? 14 : 16} c={'primary'} fW={'500'}>
            {priceString}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
