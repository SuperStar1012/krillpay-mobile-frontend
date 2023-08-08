import React from 'react';
import { Text, Image } from 'react-native';
import { View, CustomIcon, icons } from '../../../components';
import { useTheme } from '../../../components/context';
import CurrencyPlaceholderImage, { images } from './CurrencyPlaceholderImage';

export default function CurrencyBadge(props) {
  let {
    text = '',
    color,
    size = 40,
    inverted,
    account,
    currency,
    image,
  } = props;
  const { colors } = useTheme();
  const { primary, primaryContrast } = colors;
  const { circle, textStyle } = styles;
  const height = size;
  const width = size;

  let radius = size / 2;

  const fontSize = (text?.length <= 2 ? 24 : 14) * (radius / 24);

  const textColor = inverted ? primary : primaryContrast;
  const backgroundColor = inverted ? primaryContrast : primary;

  if (currency?.icon || image)
    return (
      <Image
        source={{ uri: currency?.icon || image }}
        style={{ height, width, borderRadius: 100 }}
      />
    );
  else if (images?.[text])
    return (
      <CurrencyPlaceholderImage name={text} height={height} width={width} />
    );
  else if (icons.includes(text)) {
    return <CustomIcon name={text} size={width} padded />;
  } else if (account) {
    return <CustomIcon name={'general'} size={width} padded />;
  }

  return (
    <View
      bC={'primary'}
      style={[
        circle,
        {
          height: radius * 2,
          width: radius * 2,
          borderRadius: radius,
          // backgroundColor: active ? colors.focus : 'lightgrey',
          backgroundColor: color ? colors[color] : backgroundColor,
        },
      ]}>
      <Text
        style={[
          textStyle,
          {
            fontSize,
            color: textColor,
          },
        ]}>
        {text ? text.substr(0, 4).toUpperCase() : ''}
      </Text>
    </View>
  );
}

const styles = {
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontWeight: 'bold',
  },
};
