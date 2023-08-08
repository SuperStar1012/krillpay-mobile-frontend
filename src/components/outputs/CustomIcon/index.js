import React from 'react';
import { createIconSet } from '@expo/vector-icons';
import { View, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../context';

const glyphMap = {
  merchant: '',
  supplier: '',
  user: '',
  customer: '',
  'cold-storage': '',
  locker: '',
  'hot-wallet': '',
  investments: '',
  default: '',
  lending: '',
  operational: '',
  rewards: '',
  sales: '',
  savings: '',
  shared: '',
  spending: '',
  'warm-storage': '',
  withdraw: '',
  transfer: '',
  send: '',
  sent: '',
  deposit: '',
  exchange: '',
  general: '',
  teller: '',
  history: '',
  'mass-send': '',
  more: '',
  'receive-payment': '',
  receive: '',
  received: '',
  scan: '',
  redeem_voucher: '',
  scan_to_pay: '',
  settings: '',
  wallet: '',
  'wallet-filled': '',
  reward: '',
  'reward-filled': '',
  product: '',
  'product-filled': '',
  profile: '',
  'profile-filled': '',
  home: '',
  'home-filled': '',
  'rewards-birthday': '',
  'rewards-recurring': '',
  test: '',
  sale: '',
  failed: '',
  fund: '',
  pending: '',
  purchase: '',
  add: '',
  exit: '',
  close: '',
  burger: '',
  back: '',
  card: '',
  bank: '',
  prepaid: '',
  apple: '',
  ios: '',
  android: '',
  laptop: '',
  desktop: '',
  voucher: '',
  redeem_voucher: '',
  topup: '',
  limit: '',
  pin: '',
  customers: '',
  delete: '',
  developers: '',
  export: '',
  invoices: '',
  payments: '',
  search: '',
  membership: '',
  sell_credit: '',
  request: '',
  support: '',
  chat: '',
  help: '',
  information: '',
  trophy: '',
  pos: '',
};

const customGlyphMap = { error: '' };

const expoAssetId = require('../../../../assets/fonts/icons.ttf');
export const IconSet = createIconSet(glyphMap, 'FontName', expoAssetId);

const expoAssetIdCustom = require('../../../../assets/fonts/customIcons.ttf');
export const CustomIconSet = createIconSet(
  customGlyphMap,
  'FontName',
  expoAssetIdCustom,
);

const icons = [
  'pos',
  'close',
  'merchant',
  'supplier',
  'user',
  'customer',
  'cold-storage',
  'locker',
  'default',
  'hot-wallet',
  'investments',
  'lending',
  'operational',
  'rewards',
  'sales',
  'savings',
  'shared',
  'spending',
  'warm-storage',
  'withdraw',
  'transfer',
  'send',
  'sent',
  'deposit',
  'exchange',
  'general',
  'teller',
  'history',
  'mass-send',
  'more',
  'receive-payment',
  'receive',
  'received',
  'scan_to_pay',
  'scan',
  'settings',
  'wallet',
  'wallet-filled',
  'home',
  'home-filled',
  'reward',
  'reward-filled',
  'product',
  'product-filled',
  'profile',
  'profile-filled',
  'rewards-birthday',
  'rewards-recurring',
  'sale',
  'failed',
  'fund',
  'pending',
  'purchase',
  'add',
  'exit',
  'test',
  'burger',
  'back',
  'bank',
  'card',
  'prepaid',
  'apple',
  'ios',
  'android',
  'laptop',
  'desktop',
  'voucher',
  'redeem_voucher',
  'topup',
  'limit',
  'sell_credit',
  'pin',
  'customers',
  'delete',
  'developers',
  'export',
  'invoices',
  'payments',
  'search',
  'membership',
  'request',
  'support',
  'chat',
  'information',
  'help',
  'trophy',
];

const customIcons = ['error'];

const CustomIcon = props => {
  let {
    name = '',
    size = 24,
    color = 'primary',
    contained = true,
    padded,
    padding,
    iconColor,
  } = props;
  const { colors } = useTheme();
  const isUrl = name.includes('http');
  if (isUrl) {
    return (
      <Image
        progressiveRenderingEnabled
        style={{ width: size, height: size }}
        source={{ uri: name }}
      />
    );
  }

  const { iconStyle } = styles(props, colors);
  let tempColor = colors[color + (contained ? 'Contrast' : '')];
  if (!tempColor && color) {
    tempColor = color;
  }
  if (contained && !tempColor) {
    tempColor = '#FFF';
  }
  if (contained && !tempColor) {
    tempColor = '#FFF';
  }
  name = name.toLowerCase();

  if (customIcons.includes(name)) {
    return (
      <View style={iconStyle}>
        <CustomIconSet
          name={name}
          size={size - (contained ? 14 : 0) - (padded ? padding ?? 8 : 0)}
          color={iconColor || tempColor}
        />
      </View>
    );
  }

  if (icons.includes(name)) {
    return (
      <View style={iconStyle}>
        <IconSet
          name={name}
          size={size - (contained ? 14 : 0) - (padded ? padding ?? 8 : 0)}
          color={iconColor || tempColor}
        />
      </View>
    );
  }
  return null;
};

export { CustomIcon, icons };

function styles(props, colors) {
  const {
    contained = true,
    color = 'primary',
    size = 24,
    width,
    padded,
  } = props;

  return StyleSheet.create({
    iconStyle: {
      padding: (contained ? 7 : 0) + (padded ? 4 : 0),
      height: size,
      width: width ? width : size,
      backgroundColor: contained
        ? colors[color]
          ? colors[color]
          : color
        : 'transparent',
      borderRadius: size,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
