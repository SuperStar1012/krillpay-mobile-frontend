import React from 'react';
import { View } from 'react-native';
import WalletBalanceList from 'screens/accounts/components/WalletBalanceList';
import WalletActionList from 'screens/accounts/components/WalletActionList';

export default function HomeBalanceHeader(props) {
  const {
    currencies,
    selectedCurrency,
    setSelectedCurrencyIndex,
    setHomeHeaderHeight,
  } = props;
  const { multipleAccounts, data, loading } = currencies;
  
  return (
    <View
      style={{ paddingTop: 12 }}
      onLayout={e => setHomeHeaderHeight(e?.nativeEvent?.layout.height)}>
      {/* <Animated.View
          style={[
            {
              zIndex: 1000,
              position: 'absolute',
              backgroundColor: '#DDD',
              top: 0,
              left: 0,
              right: 0,
              overflow: 'hidden',
              height,
            },
          ]}> */}
    {/* {
      selectedCurrency && multipleAccounts && setSelectedCurrencyIndex && data?.length > 0 &&( */}
        <WalletBalanceList
          currencies={data}
          loading={loading}
          activeCurrency={selectedCurrency}
          multipleAccounts={multipleAccounts}
          navigation={props.navigation}
          setIndex={setSelectedCurrencyIndex}
          // scrollY={scrollY}
          // HEADER_SCROLL_DISTANCE={HEADER_MID_SCROLL}
        />
      {/* )
    }
             */}
      {data?.length > 0 ? (
        <WalletActionList
          navigation={props.navigation}
          currency={selectedCurrency}
          
          currencies={currencies}
          isHome
        />  
      ) : (
        <View style={{ minHeight: 122 }} />
      )}
      {/* </Animated.View> */}
    </View>
  );
}
