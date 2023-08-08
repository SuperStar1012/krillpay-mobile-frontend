import React from 'react';
import { View, Text } from 'components';
import { getCurrencyCode, formatAmountString } from 'utility/rates';
import { Pressable, FlatList } from 'react-native';
import CurrencyBadge from 'components/outputs/CurrencyBadge';

export default function SimpleBalanceList(props) {
  const { items, ...restProps } = props;

  return (
    <FlatList
      data={items}
      renderItem={({ item, index }) => (
        <SimpleBalanceListItem {...restProps} item={item} />
      )}
    />
  );
}

function SimpleBalanceListItem(props) {
  const { item, multipleAccounts } = props;
  const {
    wallet,
    image = wallet?.currency?.code,
    title,
    subtitle = wallet?.currency?.description ?? getCurrencyCode(wallet),
    onPress,
  } = item;

  function handlePress() {
    if (typeof onPress === 'function') onPress(item);
  }

  const isFiat = !wallet?.crypto && item?.id !== 'wyre';

  return (
    <View w="100%" ph={0.5} pv={0.75}>
      <Pressable onPress={handlePress}>
        <View fD="row" w="100%" aI="center" jC="space-between">
          <View fD="row" f={1} aI="center">
            <CurrencyBadge text={image} width={40} />
            <View fD="column" pl={1}>
              <View fD="row" pb={0.25}>
                {!!title ? (
                  <Text s={16} fW="500" id={title} />
                ) : (
                  <Text>
                    <Text
                      s={16}
                      fW="500"
                      options={{ standardize: true }}
                      id={multipleAccounts ? wallet?.account_name : 'balance'}
                    />
                    <Text s={16} fW="500" text={': '}></Text>
                    <Text s={16} fW="500" c="primary">
                      {formatAmountString(
                        wallet?.available_balance,
                        wallet?.currency,
                        true,
                      )}
                    </Text>
                  </Text>
                )}
              </View>
              <Text s={13} c="fontLight" id={subtitle}></Text>
            </View>
          </View>
          {isFiat && <TopUpButton {...props} />}
        </View>
      </Pressable>
    </View>
  );
}

function TopUpButton(props) {
  const {
    item: { wallet },
    navigation,
  } = props;
  return (
    <Pressable
      onPress={() => navigation.navigate('Deposit', { currency: wallet })}>
      <View h={26} bR={4}>
        <View
          bR={4}
          pos="absolute"
          o={0.1}
          f={1}
          w="100%"
          h="100%"
          bC="primary"
        />
        <View pt={0.1} ph={0.25} jC="center" f={1}>
          <Text s={11} c="primary" fW="700" id="top_up" capitalize />
        </View>
      </View>
    </Pressable>
  );
}
