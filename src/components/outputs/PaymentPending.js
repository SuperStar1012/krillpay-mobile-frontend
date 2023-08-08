import React from 'react';
import { View, Text } from 'components';
import LottieImage from 'components/outputs/LottieImage';
import { useTheme } from 'contexts/ThemeContext';

export default function PaymentPending(props) {
  const { textComponent, ...restProps } = props;
  const { colors } = useTheme();
  return (
    <View f={1} w="100%" aI="center" ph={1} pt={3} {...restProps}>
      <View h={200} w={200} aI="center" jC="center" pl={1} pb={1}>
        <LottieImage
          loop
          size={200}
          name="payment"
          colorFilters={[
            {
              keypath: 'Yellow Outlines',
              color: colors?.primary,
            },
          ]}
        />
      </View>
      {textComponent ? (
        <View>{textComponent}</View>
      ) : (
        <Text
          p={0.5}
          tA="center"
          s={20}
          lH={30}
          fW="500"
          id="payment_processing"
        />
      )}
      <Text p={1} tA="center" lH={18} id="payment_processing_description" />
    </View>
  );
}
