import React from 'react';
import { useTheme } from 'components/context';
import Header from 'components/layout/header';
import { View, Text } from 'components';
import { addCommas } from 'utility/general';
import { getCurrencyCode } from '../util/rates';

const WalletListHeader = props => {
  const { rates, title, totalBalance } = props;
  const { colors, design } = useTheme();
  const { headerColor = 'font' } = design.wallets;

  const balanceString =
    (rates.displayCurrency ? rates.displayCurrency.symbol : '') +
    (totalBalance
      ? addCommas(totalBalance)
      : rates.totalBalance
      ? addCommas(rates.totalBalance)
      : '0.00');

  return (
    <React.Fragment>
      <View
        pv={title ? 0.5 : 1}
        pb={0.5}
        bC={design.app.surface ? 'transparent' : colors.header}>
        <View pb={0.5}>
          <Text
            s={10}
            t="o"
            id={(title ? 'account' : 'total') + '_balance'}
            capitalize
          />
        </View>
        <View fD="row">
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            s={
              balanceString.length > 15
                ? 21
                : balanceString.length > 10
                ? 24
                : 30
            }
            fW="400"
            c={headerColor}>
            {balanceString}
          </Text>
          <View mh={0.3} mv={0.2}>
            <Text c={headerColor} s={16} fW={'500'}>
              {getCurrencyCode(rates.displayCurrency)}
            </Text>
          </View>
        </View>
      </View>
    </React.Fragment>
  );
};

export default WalletListHeader;
