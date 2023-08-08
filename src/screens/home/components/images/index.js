import React from 'react';
import Image from 'components/outputs/Image';
import ProductPadded from './ProductPadded';
import { View } from 'components/layout/View';
import { useTheme } from 'contexts/ThemeContext';

export const images = {
  productPadded: ProductPadded,
};

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
