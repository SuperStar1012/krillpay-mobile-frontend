import React from 'react';

import WalletBalance from './WalletBalance';
import { conversionRatesSelector } from '../redux/reducer';
import { View, Carousel, Text } from 'components';
import { useTheme } from 'components/context';
import { configSettingsSelector } from '@redux/rehive/selectors';
import { useSelector } from 'react-redux';
import { userProfileSelector } from '@redux/rehive/reducer';
import { getUserCountryFromMSISDN } from 'utility/general';

const WalletBalanceList = props => {
  const { currencies, multipleAccounts, loading, scrollY, setIndex } = props;
  const { colors, design } = useTheme();
  const rates = useSelector(conversionRatesSelector);
  const settingsConfig = useSelector(configSettingsSelector);
  const profile = useSelector(userProfileSelector);
  const user = profile?.data?.[0];
  // console.log(user.mobile?);
  // console.log(typeof(user.mobile));

  function onSnapToItem(slideIndex) {
    setIndex(slideIndex);
  }

  const optionsUSD = currencies.map(item => {
    if (item.currency.code == 'USD') {
      return {
        value: item,
        key: item.account + ':' + item.currency.code,
      };
    }
  });

  const filteredOptionsUSD = optionsUSD.filter(function (el) {
    return el != null;
  });

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
      {/*getUserCountryFromMSISDN(user.mobile) =="NG" ? currencies[0] : currencies[1] */}
      {currencies.length > 0 || loading ? (
        <>
          {user?.mobile && getUserCountryFromMSISDN(user?.mobile) == 'US' ? (
            <WalletBalance
              multipleAccounts={multipleAccounts}
              rates={rates}
              navigation={props.navigation}
              currency={filteredOptionsUSD[0].value}
              single={currencies.length === 1}
              // interpolateValues={interpolateValues}
            />
          ) : (
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
          )}
        </>
      ) : (
        <Text tA="center" c={colors.headerContrast} p={1}>
          No accounts available
        </Text>
      )}
    </View>
  );
};

export default WalletBalanceList;
