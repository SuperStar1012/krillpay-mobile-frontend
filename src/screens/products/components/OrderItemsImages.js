import React from 'react';
import { Text, View, Button, PopUpGeneral } from 'components';

import SkeletonPlaceholder from 'expo-react-native-skeleton-placeholder';
import { Dimensions, ScrollView } from 'react-native';
import ProductCardHeader from './ProductCardHeader';
import Image from 'components/outputs/Image';
import { formatVariantsString } from '../util';
import { formatAmountString } from 'utility/rates';
import Images from './images';
import { useModal } from 'utility/hooks';
import VoucherOutput from './VoucherOutput';
import { mapItemNameString } from '../util/products';
import { usePolling } from 'hooks/data';
import { getOrderItem } from 'utility/rehive';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = SCREEN_WIDTH / 4 - 24;

export default function OrderItemsImages(props) {
  const {
    item = {},
    items,
    orderId,
    order = item,
    color = 'font',
    showDetail,
    poll = false,
  } = props;
  const firstItem = items?.[0] ?? {};
  const { currency } = order;

  let images = items.map(item => item?.image); //.filter(item => item);
  const coverImage = images.shift();
  const width = IMAGE_SIZE;

  const simpleLayout = items?.length < 2;

  const id = firstItem?.id;

  const data = usePolling({
    queryId: ['orderItem', id],
    queryFn: () => getOrderItem(orderId, id, true),
    refetchInterval: 5000,
    timeout: 30000,
    enabled:
      !!id &&
      poll &&
      !!firstItem?.voucher_schema &&
      firstItem?.vouchers?.length < 1,
    successFn: item => item?.vouchers?.length > 0,
  });

  let {
    name,
    price,
    total_price,
    prices,
    quantity,
    status,
    variant,
    vouchers,
  } = data?.id ? data : firstItem;

  if (!price && prices && currency) {
    price = prices.find(price => price.currency.code === currency.code);
  }

  let priceString = '';
  if (showDetail && currency && (price || total_price)) {
    priceString = formatAmountString(price ?? total_price, currency, true);
  }

  const showVouchers = vouchers?.length > 0;

  const { modalVisible, showModal, hideModal } = useModal();

  return (
    <View fD="row" aI="center">
      <View mr={1} bC="white">
        <ProductCardHeader width={width} items={[coverImage]} />
      </View>
      {simpleLayout ? (
        <View fD="row" jC="space-between" aI="center">
          <View jC="center" f={1}>
            <Text s={18} c={color}>
              {mapItemNameString(firstItem)}
            </Text>
            {showDetail && (
              <>
                {Boolean(variant) && (
                  <Text s={14} c={color} o={0.67}>
                    {formatVariantsString(variant?.options)}
                  </Text>
                )}
                <Text s={18} c={color} fW="bold">
                  {priceString}
                </Text>
              </>
            )}
            {showVouchers && (
              <Button onPress={showModal}>
                <View pt={0.25}>
                  <Text
                    s={14}
                    c={color !== 'font' ? color : 'primary'}
                    fW="bold">
                    Show voucher
                  </Text>
                </View>
              </Button>
            )}
          </View>
          {showDetail && (
            <Text s={25} c="primary" fW="bold">
              {quantity}
            </Text>
          )}
        </View>
      ) : (
        <ScrollView horizontal style={{ maxHeight: IMAGE_SIZE }}>
          <View fD="row" f={1}>
            {images?.map(image =>
              image ? (
                <Image
                  key={image?.file ?? image}
                  src={image?.file ?? image}
                  resizeMode={'cover'}
                  style={{
                    height: width,
                    width,
                    maxHeight: width,
                    maxWidth: width,
                    marginRight: 16,
                  }}
                />
              ) : (
                <View bC="white">
                  <Images size={width} name="productPadded" />
                </View>
              ),
            )}
          </View>
        </ScrollView>
      )}

      <PopUpGeneral visible={modalVisible} onDismiss={hideModal} docked>
        <VoucherOutput item={{ ...vouchers?.[0], item: firstItem, order }} />
      </PopUpGeneral>
    </View>
  );
}

function Skeleton() {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item flexDirection="row" width="100%">
        <SkeletonPlaceholder.Item
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          // borderRadius={50}
          marginRight={16}
        />
        <SkeletonPlaceholder.Item
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          // borderRadius={50}
          marginRight={16}
        />
        <SkeletonPlaceholder.Item
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          // borderRadius={50}
          marginRight={16}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
}

export { Skeleton };
