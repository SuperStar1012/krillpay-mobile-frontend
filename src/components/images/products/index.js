import React from 'react';
import Image from 'components/outputs/Image';
import Clothes from './Clothes';
import Data from './Data';
import Discounts from './Discounts';
import Ecom from './Ecom';
import Events from './Events';
import Food from './Food';
import Gaming from './Gaming';
import Homeware from './Homeware';
import Phone from './Phone';
import Transport from './Transport';
import Travel from './Travel';
import Voucher from './Voucher';
import Tee from './Tee';
import Ticket from './Ticket';
import Order from './Order';
import Product from './Product';
import ProductPadded from './ProductPadded';
import Coffee from './Coffee';
import Plant from './Plant';
import { useTheme } from 'contexts/ThemeContext';

export const images = {
  clothes: Clothes,
  clothing: Clothes,
  data: Data,
  ecom: Ecom,
  discounts: Discounts,
  events: Events,
  food: Food,
  gaming: Gaming,
  homeware: Homeware,
  phone: Phone,
  airtime: Phone,
  transport: Transport,
  travel: Travel,
  voucher: Voucher,
  tee: Tee,
  ticket: Ticket,
  order: Order,
  product: Product,
  productPadded: ProductPadded,
  coffee: Coffee,
  plant: Plant,
};

import { View } from 'components/layout/View';

export default function Images(props) {
  let { width, height, size, card, rem, padded, name } = props;
  if (size && !height) height = size;
  if (size && !width) width = size;

  const { colors } = useTheme();

  function renderSVG() {
    const w = padded ? width - 2 * rem * padded : width;
    const h = height ? height : card ? w / 2.5 : w;

    const imageProps = { width: w, height: h, colors };

    const Component = images?.[name];
    return Component ? (
      <Component {...imageProps} />
    ) : (
      <Image width={w} height={h} src={name} />
    );
  }

  return (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          maxHeight: width,
        },
        props.containerStyle,
      ]}>
      {renderSVG()}
    </View>
  );
}
