import React from 'react';
import { Platform, Animated, I18nManager } from 'react-native';
import { get } from 'lodash';

import {
  formatDivisibility,
  addCommas,
  standardizeString,
  displayFormatDivisibility,
} from 'utility/general';
import CurrencyBadge from 'components/outputs/CurrencyBadge';
import { useConversion, getCurrencyCode } from '../util/rates';
import Overlays from './Overlays';
import { Card, View, Text, Spinner } from 'components';
import { useTheme } from 'components/context';

const WalletBalance = props => {
  const {
    currency,
    forceDetail,
    rates,
    navigation,
    interpolateValues,
    single,
    multipleAccounts,
  } = props;
  const { design, colors } = useTheme();

  if (!currency) {
    return (
      <Card
        containerStyle={{
          backgroundColor: colors.primary,
          marginHorizontal: 12,
        }}
        design={design.wallets}
        noPadding>
        <View
          style={[
            {
              padding: 24,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              height: 160,
            },
          ]}>
          <Overlays variant={'card'} />
          <Spinner color="primaryContast" size="large" />
        </View>
      </Card>
    );
  }

  // console.log('interpolateValues', interpolateValues);
  const balance = formatDivisibility(
    currency.available_balance,
    currency.currency.divisibility,
  );

  const { hasConversion, convAvailable } = useConversion(
    balance,
    rates,
    currency.currency,
    I18nManager.isRTL,
  );
  const displayBalance = displayFormatDivisibility(
    currency.available_balance,
    currency.currency.divisibility,
  );

  const accName = multipleAccounts && standardizeString(currency.account_name);

  function handleNavigate() {
    navigation.navigate(
      single ? 'Wallets' : 'CurrencyDetail',
      single
        ? { currency }
        : {
            currencyCode: get(currency, ['currency', 'code']),
            accountRef: get(currency, 'account'),
          },
    );
  }

  return (
    <Card
      removeDefaultContainerStyle
      containerStyle={{
        backgroundColor: colors.primary,
        marginHorizontal: 12,
      }}
      noPadding
      design={design.wallets}
      onPressContentDisabled={forceDetail}
      onPressContent={handleNavigate}>
      <Animated.View
        style={[
          {
            paddingVertical: 24,
            paddingHorizontal: 28,
            backgroundColor: colors.primary,
            justifyContent: 'flex-end',
            height: 170,
            // ...interpolateValues,
          },
          // {
          //   transform: [
          //     // scaleX, scaleY, scale, theres plenty more options you can find online for this.
          //     { scaleX: interpolateValues.height }, // this would be the result of the animation code below and is just a number.
          //   ],
          // },
        ]}>
        <Overlays variant={'card'} />
        <View pos="absolute" style={{ top: 20, right: 28, zIndex: 1000 }}>
          <CurrencyBadge
            inverted
            text={currency.currency.code}
            currency={currency.currency}
            size={56}
          />
        </View>
        <Text
          fW={'bold'}
          c={'primaryContrast'}
          s={18}
          style={{ zIndex: 90, paddingBottom: 4, marginRight: 64 }}>
          {currency.currency.description}
        </Text>
        <View fD="row" aI="center" pb={0.25}>
          <Text
            c={'primaryContrast'}
            style={{ zIndex: 90 }}
            fW={'700'}
            s={
              Platform.OS === 'android'
                ? displayBalance.length > 16
                  ? 16
                  : displayBalance.length > 13
                  ? 18
                  : displayBalance.length > 10
                  ? 20
                  : 26
                : 26
            }
            adjustsFontSizeToFit
            numberOfLines={1}>
            {addCommas(displayBalance)}
          </Text>
          <Text
            c={'primaryContrast'}
            style={{
              [I18nManager.isRTL ? 'paddingRight' : 'paddingLeft']: 8,
            }}
            fW={'700'}>
            {getCurrencyCode(currency.currency)}
          </Text>
        </View>
        {(hasConversion || accName) && (
          <View fD="row" jC="space-between">
            <Text c={'primaryContrast'} s={16} tA="right">
              {hasConversion && convAvailable}
            </Text>
            <Text c={'primaryContrast'} s={16}>
              {accName}
            </Text>
          </View>
        )}
      </Animated.View>
    </Card>
  );
};

export default WalletBalance;
