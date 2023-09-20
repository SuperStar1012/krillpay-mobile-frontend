import React, { useRef } from 'react';
import { View, Text, Spinner } from 'components';

import { Image, Animated, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'expo-react-native-skeleton-placeholder';

import Swipeable from 'react-native-gesture-handler/Swipeable';

import { RectButton } from 'react-native-gesture-handler';

import { MaterialIcons as Icon } from '@expo/vector-icons';
import Images from 'components/images';
import Stepper from 'components/inputs/Stepper';
import { formatAmountString } from 'utility/rates';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default function CartListItem(props) {
  let { item, context, loadingItem, setItems, index, id: pageId } = props;
  const items = [...(props?.items ?? [])];
  const { currency } = context;

  function handleQuantity(value) {
    if (value === 0) handleRemove();
    else {
      items[index].quantity = value;
      setItems(items);
    }
  }

  function handleRemove() {
    items.splice(index, 1);
    setItems(items);
  }

  let { name, price, prices, variant, image, id, quantity } = item;
  const updateRef = useRef();

  if (!price && prices && currency) {
    price = prices.find(price => price.currency.code === currency.code);
  }
  const priceString = formatAmountString(price, currency);

  const isLoading = loadingItem === id;

  function renderRemove(progress, dragX) {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <RectButton style={[styles.rectButton]} onPress={handleRemove}>
        {isLoading ? (
          <Spinner color="white" />
        ) : (
          <>
            <AnimatedIcon
              name="delete-forever"
              size={30}
              color="#fff"
              style={[styles.actionIcon, { transform: [{ scale }] }]}
            />
            <Animated.Text
              style={[
                styles.actionText,
                {
                  transform: [{ translateX: scale }],
                },
              ]}>
              Remove
            </Animated.Text>
          </>
        )}
      </RectButton>
    );
  }

  return (
    <View pv={0.5}>
      <Swipeable
        renderRightActions={renderRemove}
        ref={updateRef}
        enableTrackpadTwoFingerGesture>
        <View fD="row" w={'100%'} ph={1.5} bC="white">
          {pageId !== 'custom' && (
            <View style={{ position: 'relative' }} w={95}>
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item width={95} height={95} />
              </SkeletonPlaceholder>
              <View pos="absolute" bC="white">
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{ height: 95, width: 95, minHeight: 95 }}
                  />
                ) : (
                  <Images name="product" height={95} width={95} />
                )}
              </View>
            </View>
          )}
          <View ph={pageId !== 'custom' ? 0.5 : 0} jC={'center'} f={1}>
            <Text s={18} style={{ paddingBottom: 4 }}>
              {name}
            </Text>
            {Boolean(variant) && (
              <Text s={14} o={0.87}>
                {variant.label}
              </Text> // ? variant.label: formatVariantsString(variant.options)
            )}

            <Text s={18} fW="700">
              {priceString}
            </Text>
          </View>
          <Stepper
            value={quantity}
            setValue={handleQuantity}
            loading={isLoading}
          />
        </View>
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  rectButton: {
    width: 100,
    height: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#CC2538',
  },
  actionText: { color: 'white' },

  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
  fromText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  messageText: {
    color: '#999',
    backgroundColor: 'transparent',
  },
  dateText: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 20,
    top: 10,
    color: '#999',
    fontWeight: 'bold',
  },
  container: {
    // width: '100%',
    // flex: 1,
    // height: 50,
  },
  title: {
    // width: '100%',
    // flex: 1,
    paddingBottom: 2,
  },
  subtitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: '100%',
    // height: 50,
  },
});
