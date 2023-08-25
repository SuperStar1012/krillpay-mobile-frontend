import React from 'react';
import EmptyTransactions from './EmptyTransactions';
import EmptyProducts from './EmptyProducts';
import EmptyRewards from './EmptyRewards';
import EmptyNotifications from './EmptyNotifications';
import { useTheme } from 'contexts/ThemeContext';

export const images = {
  transactions: EmptyTransactions,
  products: EmptyProducts,
  notifications: EmptyNotifications,
  rewards: EmptyRewards,
};

import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';

export default function EmptyListPlaceholder(props) {
  let { width, height, size, card, rem, padded, name, text } = props;
  if (size && !height) height = size;
  if (size && !width) width = size;

  const { colors } = useTheme();

  function renderSVG() {
    const w = padded ? width - 2 * rem * padded : width;
    const h = height ? height : card ? w / 2.5 : w;

    const imageProps = { width: w, height: h, colors };

    const Component = images?.[name];
    return Component ? <Component {...imageProps} /> : null;
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
      <Text style={{}} id={text}></Text>
    </View>
  );
}
