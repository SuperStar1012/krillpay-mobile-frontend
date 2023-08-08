import React from 'react';
import { addCommas } from '../../utility/general';

import CurrencyBadge from 'components/outputs/CurrencyBadge';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../components/context';
import { Card, View, Text } from '../../components';
import { calculateAccountTotal } from 'screens/accounts/util/accounts';
import { getCurrencyCode } from 'screens/accounts/util/rates';

const AccountsCard = props => {
  const { item, rates, onPress, disabled } = props;
  const { design } = useTheme();
  const {
    viewStyleContainer,
    viewStyleBadge,
    viewStyleContent,
    textStyleAccount,
  } = styles;

  if (!item) {
    return null;
  }

  let totalBalance = calculateAccountTotal(item, rates);

  const title = item?.metadata?.name ?? item?.account_name ?? item?.name ?? '';

  return (
    <Card
      onPressContentDisabled={disabled}
      onPressContent={() => onPress(item)}
      design={design.wallets}
      noPadding
      wrapperStyle={{
        marginHorizontal: 0,
        padding: 17,
        paddingHorizontal: 9,
      }}>
      <View style={viewStyleContainer}>
        <View style={viewStyleBadge}>
          <CurrencyBadge text={title} radius={24} account />
        </View>
        <View style={viewStyleContent}>
          <Text s={12} o={0.87} tA={'right'} style={textStyleAccount}>
            {title.toUpperCase()}
          </Text>
          {totalBalance ? (
            <Text s={20} fW="700" tA={'right'} c={'primary'}>
              {addCommas(totalBalance) +
                ' ' +
                getCurrencyCode(rates.displayCurrency)}
            </Text>
          ) : null}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  viewStyleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // flex: 1,
    // padding: 16,
  },
  viewStyleBadge: {
    paddingRight: 16,
    justifyContent: 'center',
  },
  viewStyleContent: {
    alignItems: 'flex-end',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  textStyleAccount: {
    paddingBottom: 4,
  },
});

export default AccountsCard;
