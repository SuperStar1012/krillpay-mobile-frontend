import React from 'react';
import { View, Text } from 'components';
import { getCurrencyCode } from 'utility/rates';
import { useSelector } from 'react-redux';
import { conversionPairsSelector } from 'screens/accounts/redux/reducer';
import SimpleBalanceList from 'screens/accounts/components/SimpleBalanceList';

export default function SellOptions(props) {
  const {
    form,
    context: { wallets, wallet, tier },
    onNext,
    navigation,
  } = props;

  const conversionPairs = useSelector(conversionPairsSelector);
  const { limits = [] } = tier?.items?.[0] ?? {};
  const blockedBuyCodes = limits
    ?.filter(item => item.subtype === 'buy' && item.value === 0)
    .map(item => item?.currency);

  const toCodes = conversionPairs.items
    .filter(
      pair =>
        pair.key.split(':')[0] === wallet.currency.code &&
        !blockedBuyCodes.includes(pair.key.split(':')[1]),
    )
    .map(item => item.key.split(':')[1]);

  function handleCurrencySelect(item) {
    form.setValue('toWallet', item?.wallet);
    onNext();
  }

  let items = [];

  if (toCodes.length > 0) {
    wallets.data
      .filter(wallet => toCodes.includes(wallet?.currency?.code))
      .map(wallet =>
        items.push({
          id: wallet?.account + '.' + wallet?.currency?.code,
          wallet,
          onPress: handleCurrencySelect,
        }),
      );
  }

  return (
    <View p={1} scrollView>
      <Text
        tA={'center'}
        s={18}
        p={0.25}
        id="sell_options_description"
        context={{
          fromCurrency:
            wallet?.currency?.description ?? getCurrencyCode(wallet),
        }}
      />
      <View pv={1}>
        <SimpleBalanceList
          items={items}
          multipleAccounts={wallets?.multipleAccounts}
          navigation={navigation}
        />
      </View>
    </View>
  );
}
