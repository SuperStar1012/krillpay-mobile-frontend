import React from 'react';

import { formatAmountString } from '../../util/rates';

import { View, Text } from 'components';

import LottieImage from 'components/outputs/LottieImage';
import { useTheme } from 'contexts/ThemeContext';

export default function PayInitiated(props) {
  const { business, quote = {} } = props;
  let { name } = business;

  const { colors } = useTheme();
  const { amount, currency } = quote;

  let sentenceString =
    amount && currency && formatAmountString(amount, currency, true);

  return (
    <View p={1} pt={2}>
      <View
        h={200}
        // w={200}
        // bC="primary"
        // bR="500"
        aI="center"
        jC="center"
        pb={1}>
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
      <Text fW="500" t="h5" s={26} tA={'center'}>
        Payment intiated
      </Text>
      <View pv={2}>
        <Text tA={'center'}>
          {'Payment of '}
          {sentenceString && (
            <Text fW={'bold'} c={'primary'}>
              {sentenceString}
            </Text>
          )}
          {name && ' to '}
          {name && (
            <Text fW={'bold'} c={'primary'}>
              {name}
            </Text>
          )}
          {' initiated'}
        </Text>
      </View>
    </View>
  );
}
