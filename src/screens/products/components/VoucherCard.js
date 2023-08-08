import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, CustomIcon } from 'components';
import { formatAmountString } from 'utility/rates';
import Images from './images';
import { formatTime } from 'utility/general';

export default function VoucherCard(props) {
  const { item, showModal } = props;

  if (!item) return null;

  const { product, order } = item;
  const { currency, updated } = order;
  let voucher = product ?? item.item;

  if (!voucher) return null;

  voucher = { ...voucher, value: item.item.price };

  const { name } = voucher;

  const date = formatTime(updated, 'lll');

  const status =
    item.status === 'pending' || item.status === 'purchased'
      ? 'Available'
      : item.status === 'redeemed'
      ? 'Redeemed'
      : '';

  const priceString = formatAmountString(item.item.price, currency, true);

  return (
    <React.Fragment>
      <TouchableOpacity
        // onPress={() => navigation.navigate('VoucherDetail', { item })}
        onPress={() => showModal({ id: 'voucher', props: { item } })}>
        <View fD="row" aI={'center'} mt={0.75} mb={0.25} mh={1}>
          <View>
            <Images size={75} name="voucher" />
          </View>
          <View style={{ zIndex: 10 }} f={1} fD="column" pl={1}>
            <Text c="primary" fW="bold" s={20}>
              {priceString}
            </Text>
            <View mv={0.25}>
              <Text s={18}>{name}</Text>
            </View>
            {/* <View> */}
            <Text s={14}>{date}</Text>
            <View mt={0.25}>
              <Text
                s={14}
                c={status === 'Available' ? 'positive' : 'lightFont'}>
                {status}
              </Text>
            </View>
            {/* </View> */}
          </View>
          <CustomIcon
            name={'scan'}
            size={30}
            color={'primary'}
            contained={false}
          />
        </View>
      </TouchableOpacity>
    </React.Fragment>
  );
}
