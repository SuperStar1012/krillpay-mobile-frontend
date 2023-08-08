import React from 'react';
import { get } from 'lodash';

import { displayFormatDivisibility, formatDivisibility } from 'utility/general';

import { useConversion, getCurrencyCode } from '../util/rates';
import { conversionRatesSelector } from '../redux/reducer';
import { useSelector } from 'react-redux';
import { StyleSheet, I18nManager } from 'react-native';
import { View, Text } from 'components';
import Header from 'components/layout/header';

const CurrencyDetailHeader = props => {
  const { item, navigation, noBack, simple, dwollaBalance } = props;
  const rates = useSelector(conversionRatesSelector);

  const {
    viewStyleBalance,
    viewStyleBalanceAmount,
    textStyleBalance,
    textStyleCode,
  } = styles;

  if (!item) {
    return null;
  }
  const { currency, account_name, available_balance } = item;

  const available = formatDivisibility(
    available_balance,
    currency.divisibility,
  );

  const { convAvailable } = useConversion(
    dwollaBalance,
    rates,
    currency,
    I18nManager.isRTL,
  );

  const title = get(item, ['currency', 'description']);
  const showTitle = Boolean(title);

  return (
    <View style={{ backgroundColor: 'transparent' }}>
      {showTitle && (
        <Header
          transparent
          color="#FFF"
          back={!noBack}
          title={!simple && title}
          noPadding
          navigation={navigation}
          noShadow
        />
      )}

      <View
        style={[
          viewStyleBalance,
          {
            backgroundColor: 'transparent',
            minHeight: simple ? 60 : 100,
            paddingBottom: simple ? 20 : 0,
          },
        ]}>
        <View style={viewStyleBalanceAmount}>
          <Text
            style={textStyleBalance}
            adjustsFontSizeToFit
            numberOfLines={1}
            c={'header'}>
            {displayFormatDivisibility(
              available_balance,
              currency?.divisibility,
            )}
            {/* {dwollaBalance} */}
          </Text>
          <Text fW={'bold'} s={16} c={'header'}>
            {getCurrencyCode(currency)}
          </Text>
        </View>
        {Boolean(convAvailable) && (
          <Text s={14} c={'header'}>
            {convAvailable}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyleBalance: {
    // height: 49,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  viewStyleBalanceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 4,
  },
  textStyleBalance: {
    fontSize: 35,
    fontWeight: '700',
    [I18nManager.isRTL ? 'paddingLeft' : 'paddingRight']: 8,
    maxWidth: '70%',
    fontFamily: 'Roboto_700Bold',
  },
});

export default CurrencyDetailHeader;
