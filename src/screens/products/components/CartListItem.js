import React, { useRef } from 'react';
import { View, Text, Spinner } from 'components';
import { formatDivisibility } from 'utility/general';
import { formatVariantsString } from '../util';
// import BlockPlaceholderSvg from './images/Block';
import { Image, Animated, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'expo-react-native-skeleton-placeholder';

import QuantityEdit from './QuantityEditNew';

import Swipeable from 'react-native-gesture-handler/Swipeable';

import { RectButton } from 'react-native-gesture-handler';

import { MaterialIcons as Icon } from '@expo/vector-icons';
import Images from './images';
import { formatAmountString } from 'utility/rates';
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default function CartListItem(props) {
  let { item, currency, removeFromCart, cart, loadingItem } = props;
  let { name, price, prices, quantity, status, variant, image, id } = item;
  const updateRef = useRef();

  if (!price && prices && currency) {
    price = prices.find(price => price.currency.code === currency.code);
  }
  const priceString = price
    ? formatAmountString(price?.amount ?? price, currency ?? {}, true)
    : 'N/A';

  const isLoading = loadingItem === id;

  function renderRemove(progress, dragX) {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <RectButton
        style={[
          styles.rectButton,
          // {
          //   transform: [{ translateX: scale }],
          // },
        ]}
        onPress={() => removeFromCart(cart?.id, id)}>
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
        // friction={2}
        // leftThreshold={80}
        enableTrackpadTwoFingerGesture
        // rightThreshold={40}
      >
        <View fD="row" w={'100%'} ph={1} bC="white">
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
          <View ph={0.5} jC={'center'} f={1}>
            <Text s={18} style={{ paddingBottom: 4 }}>
              {name}
            </Text>
            {Boolean(variant) && (
              <Text s={14} o={0.87}>
                {variant.label
                  ? variant.label
                  : formatVariantsString(variant.options)}
              </Text>
            )}

            <Text s={18} fW="700">
              {priceString}
            </Text>
          </View>
          <QuantityEdit {...props} loading={isLoading} />
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

// import React, { Component } from 'react';
// import { ListItem, View, Text } from 'components';
// import PropTypes from 'prop-types';
// import {
//   formatDivisibility,
//   formatTime,
//   standardizeString,
// } from 'utility/general';
// import { Icon } from 'components/outputs/Icon';
// import { formatVariantsString } from '../util';

// class OrderListItem extends Component {
//   render() {
//     let { item, currency, showModal, noEdit, profile } = this.props;
//     let { name, price, prices, quantity, status, variant } = item;

//     if (!price && prices && currency) {
//       price = prices.find(price => price.currency.code === currency.code);
//     }
//     const priceString = price
//       ? (price.amount
//           ? formatDivisibility(price.amount * quantity, currency.divisibility)
//           : formatDivisibility(price * quantity, currency.divisibility)
//         ).toString() +
//         ' ' +
//         currency.code
//       : 'N/A';

//     return (
//       <ListItem
//         noImage
//         noTitle
//         onPress={() => (noEdit ? null : showModal(item))}
//         disabled={noEdit}>
//         <View f={1} pv={0.5}>
//           <View fD="row" w={'100%'} style={styles.title} jC={'space-between'}>
//             <Text fW="500">
//               {name}
//               <Text>
//                 {variant
//                   ? ' - ' +
//                     (variant.label
//                       ? variant.label
//                       : formatVariantsString(variant.options))
//                   : ''}
//               </Text>
//             </Text>
//             {!noEdit ? (
//               <Icon
//                 name={'edit'}
//                 set={'MaterialIcons'}
//                 color={'font'}
//                 size={12}
//               />
//             ) : null}
//           </View>
//           <View style={{ marginRight: 4 }}>
//             <View w={'100%'} fD={'row'}>
//               <Text t={'s2'}>{'Qty: ' + quantity}</Text>
//               <View f={1}>
//                 <Text t={'s2'} tA={'right'}>
//                   {priceString}
//                 </Text>
//               </View>
//             </View>
//             {status && noEdit && (
//               <React.Fragment>
//                 <Text
//                   t={'s2'}
//                   c={
//                     status ? (status !== 'failed' ? 'positive' : 'error') : ''
//                   }>
//                   {standardizeString(status)}
//                 </Text>
//                 <Text t={'s2'} opacity={0.7}>
//                   {'Updated: ' +
//                     formatTime(item.updated, 'MMMM Do, YYYY', profile)}
//                 </Text>
//               </React.Fragment>
//             )}
//           </View>
//         </View>
//       </ListItem>
//     );
//   }
// }

// const styles = {
//   container: {
//     // width: '100%',
//     // flex: 1,
//     // height: 50,
//   },
//   title: {
//     // width: '100%',
//     // flex: 1,
//     paddingBottom: 2,
//   },
//   subtitle: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     // width: '100%',
//     // height: 50,
//   },
//   //
// };

// ListItem.propTypes = {
//   item: PropTypes.object, // Text displayed on button
//   currency: PropTypes.object, // Animation type
// };

// ListItem.defaultProps = {
//   item: {},
//   currency: {},
// };
