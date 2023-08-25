import React from 'react';

import WalletBalance from './WalletBalance';
import { useSelector } from 'react-redux';
import { conversionRatesSelector } from '../redux/reducer';
import { View, Carousel, Text } from 'components';
import { useTheme } from 'components/context';
import { configSettingsSelector } from '@redux/rehive/selectors';

const WalletBalanceList = props => {
  const { currencies, multipleAccounts, loading, scrollY, setIndex } = props;
  const { colors, design } = useTheme();
  const rates = useSelector(conversionRatesSelector);
  const settingsConfig = useSelector(configSettingsSelector);

  function onSnapToItem(slideIndex) {
    setIndex(slideIndex);
  }

  // const height = scrollY.interpolate({
  //   inputRange: [0, HEADER_SCROLL_DISTANCE,
  //   outputRange: [160, 100],
  //   extrapolate: 'clamp',
  // });
  // const paddingTop = scrollY.interpolate({
  //   inputRange: [0, HEADER_SCROLL_DISTANCE],
  //   outputRange: [24, 8],
  //   extrapolate: 'clamp',
  // });
  // const paddingBottom = scrollY.interpolate({
  //   inputRange: [0, HEADER_SCROLL_DISTANCE],
  //   outputRange: [24, 16],
  //   extrapolate: 'clamp',
  // });

  // const interpolateValues = { height, paddingTop, paddingBottom };

  return (
    <View pv={0.5} bC={design.app.surface ? 'transparent' : 'header'} h={196}>
      {currencies.length > 0 || loading ? (
        <Carousel
          data={currencies.length > 0 ? currencies : [false, false]}
          horizontal
          renderItem={({ item }) => (
            <WalletBalance
              multipleAccounts={multipleAccounts}
              rates={rates}
              navigation={props.navigation}
              currency={item}
              single={currencies.length === 1}
              // interpolateValues={interpolateValues}
            />
          )}
          loop={settingsConfig?.loopCurrencies ?? true}
          keyExtractor={item => item.account + ':' + item.currency.code}
          onSnapToItem={onSnapToItem}
        />
      ) : (
        <Text tA="center" c={colors.headerContrast} p={1}>
          No accounts available
        </Text>
      )}
    </View>
  );
};

export default WalletBalanceList;
