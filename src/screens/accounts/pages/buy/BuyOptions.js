import React from 'react';
import { useSelector } from 'react-redux';
import { View, Text } from 'components';
import { conversionPairsSelector } from '../../redux/reducer';
import { getCurrencyCode } from 'utility/rates';
import SimpleBalanceList from 'screens/accounts/components/SimpleBalanceList';
import { useWyreCurrencies } from 'extensions/wyre/hooks';
import { checkWyreService } from 'extensions/wyre/util';

export default function BuyOptions(props) {
  const {
    navigation,
    form,
    context: { wallets, wallet, services, tier },
    onNext,
  } = props;

  const { wyreCurrencies } = useWyreCurrencies();

  const conversionPairs = useSelector(conversionPairsSelector);

  const { limits = [] } = tier?.items?.[0] ?? {};
  const blockedSellCodes = limits
    ?.filter(item => item.subtype === 'sell' && item.value === 0)
    .map(item => item?.currency);

  const fromCodes = conversionPairs.items
    .filter(
      pair =>
        pair.key.split(':')[1] === wallet.currency.code &&
        !blockedSellCodes.includes(pair.key.split(':')[0]),
    )
    .map(item => item.key.split(':')[0]);

  function handleCurrencySelect(item) {
    form.setValue('fromWallet', item?.wallet);
    onNext();
  }

  let items = [];
  if (
    checkWyreService(services) &&
    wyreCurrencies?.[wallet?.currency?.code]?.is_crypto
  )
    items.push({
      id: 'wyre',
      title: 'Wyre',
      subtitle: 'third_party_provider',
      image: 'wyre-icon',
      onPress: () => navigation.navigate('Wyre', { currency: wallet }),
    });

  if (fromCodes.length > 0) {
    wallets.data
      .filter(wallet => fromCodes.includes(wallet?.currency?.code))
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
      <Text>
        <Text tA={'center'} s={18} p={0.25} id="how_do_you_want_to_buy"></Text>
        <Text s={18} fW={'700'}>
          {wallet?.currency?.description ?? getCurrencyCode(wallet)}
        </Text>
        ?
      </Text>
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
