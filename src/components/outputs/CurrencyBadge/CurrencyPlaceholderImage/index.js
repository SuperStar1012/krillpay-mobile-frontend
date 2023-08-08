import React from 'react';

import BNB from './crypto/bnb.svg';
import XBT from './crypto/xbt.svg';
import ETH from './crypto/eth.svg';
import XLM from './crypto/xlm.svg';
import AUD from './fiat/aud.svg';
import CAD from './fiat/cad.svg';
import EUR from './fiat/eur.svg';
import GBP from './fiat/gbp.svg';
import USD from './fiat/usd.svg';
import USDC from './fiat/usdc.svg';
import ZAR from './fiat/zar.svg';
import Amex from './cards/amex.svg';
import Visa from './cards/visa.svg';
import Mastercard from './cards/mastercard.svg';
import { View } from 'components/layout/View';
import { Text } from 'components/outputs/Text';

import Cash from './pos/cash.svg';
import Credit from './pos/credit.svg';
import Pin from './pos/pin.svg';
import Custom from './pos/custom.svg';
import Products from './pos/products.svg';
import Pull from './pos/pull.svg';
import QR from './pos/qr.svg';
import WyreIcon from 'components/images/wyre-icon.svg';
import { standardizeString } from 'utility/general';

export const images = {
  BNB,
  ETH,
  TETH: ETH,
  XBT,
  TXBT: XBT,
  bitcoin: XBT,
  CAD,
  XLM,
  TXLM: XLM,
  stellar: XLM,
  AUD,
  EUR,
  GBP,
  USD,
  USDC,
  ZAR,
  amex: Amex,
  visa: Visa,
  mastercard: Mastercard,
  cash: Cash,
  credit: Credit,
  custom: Custom,
  pin: Pin,
  products: Products,
  pull: Pull,
  qr: QR,
  'wyre-icon': WyreIcon,
};

export default function CurrencyPlaceholderImage(props) {
  let { showLabel, width, height, name, label } = props;
  if (!width) {
    width = height;
  }

  const imageProps = { width, height };
  const images = {
    BNB: <BNB {...imageProps} />,
    ETH: <ETH {...imageProps} />,
    TETH: <ETH {...imageProps} />,
    XBT: <XBT {...imageProps} />,
    TXBT: <XBT {...imageProps} />,
    bitcoin: <XBT {...imageProps} />,
    CAD: <CAD {...imageProps} />,
    XLM: <XLM {...imageProps} />,
    TXLM: <XLM {...imageProps} />,
    stellar: <XLM {...imageProps} />,
    AUD: <AUD {...imageProps} />,
    EUR: <EUR {...imageProps} />,
    GBP: <GBP {...imageProps} />,
    USD: <USD {...imageProps} />,
    USDC: <USDC {...imageProps} />,
    ZAR: <ZAR {...imageProps} />,
    amex: <Amex {...imageProps} />,
    visa: <Visa {...imageProps} />,
    mastercard: <Mastercard {...imageProps} />,
    cash: <Cash {...imageProps} />,
    credit: <Credit {...imageProps} />,
    custom: <Custom {...imageProps} />,
    pin: <Pin {...imageProps} />,
    products: <Products {...imageProps} />,
    pull: <Pull {...imageProps} />,
    qr: <QR {...imageProps} />,
    'wyre-icon': <WyreIcon {...imageProps} />,
  };
  if (showLabel) {
    return (
      <View>
        <View style={styles.container}>{images[name]}</View>
        <Text tA="center">{label ? label : standardizeString(name)}</Text>
      </View>
    );
  }
  return <View style={styles.container}>{images[name]}</View>;
}

const styles = {
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
