import React from 'react';
import { Dimensions, View } from 'react-native';

import Account from './no-account.svg';
import Currency from './no-currency.svg';
import Address from './no-address.svg';
import Bank from './no-bank.svg';
import Crypto from './no-crypto.svg';
import Email from './no-email.svg';
import Mobile from './no-mobile.svg';
import Notification from './no-notification.svg';
import Order from './no-order.svg';
import Product from './no-product.svg';
import Transaction from './no-transaction.svg';
import Reward from './no-reward.svg';
import Document from './no-document.svg';
import Voucher from './no-voucher.svg';
import Generic from './generic.svg';
import Internet from './no-internet.svg';

import Text from '../../Text';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function EmptyListPlaceholderImage(props) {
  const { id } = props;
  const {
    width = SCREEN_WIDTH / 2,
    height = SCREEN_WIDTH / 2,
    name = id,
    text = id + '_empty',
    children,
  } = props;

  const imageProps = { width, height };
  const images = {
    voucher: <Voucher {...imageProps} />,
    order: <Order {...imageProps} />,
    product: <Product {...imageProps} />,
    transaction: <Transaction {...imageProps} />,
    reward: <Reward {...imageProps} />,
    campaign: <Reward {...imageProps} />,
    notification: <Notification {...imageProps} />,
    mobile: <Mobile {...imageProps} />,
    email: <Email {...imageProps} />,
    cryptoAccounts: <Crypto {...imageProps} />,
    bank: <Bank {...imageProps} />,
    address: <Address {...imageProps} />,
    document: <Document {...imageProps} />,
    account: <Account {...imageProps} />,
    currency: <Currency {...imageProps} />,
    internet: <Internet {...imageProps} />,
    generic: <Generic {...imageProps} />,
  };

  return (
    <View style={styles.container}>
      {images[name]}
      <View style={styles.viewStyleBox}>
        <Text style={[styles.textStyle]} id={text}>
          {children}
        </Text>
      </View>
    </View>
  );
}

const styles = {
  container: {
    width: '100%',
    // height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewStyleBox: {
    flexDirection: 'column',
    padding: 16,
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 18,
    fontWeight: 'normal',
  },
};
