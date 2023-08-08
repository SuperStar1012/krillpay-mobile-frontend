import React from 'react';
import { get } from 'lodash';

import WalletActionList from './WalletActionList';
import TransactionList from './TransactionList';
import { formatDivisibility } from 'utility/general';

import { calculateRate } from '../util/rates';
import {
  conversionRatesSelector,
  currenciesSelector,
  conversionPairsSelector,
} from '../redux/reducer';
import { useSelector } from 'react-redux';
import { companyBankAccountsSelector } from '@redux/rehive/reducer';
import CurrencyDetailHeader from './CurrencyDetailHeader';
import { cryptoSelector } from '@redux/selectors';
import { View } from 'components';
import { useTheme } from 'components/context';
import Overlays from './Overlays';
import { useRehiveContext } from 'contexts/RehiveContext';
import { useAccounts } from 'contexts';
import { Text } from 'react-native';

export default function CurrencyDetailPage(props) {
  let { navigation, route, currencyCode, dwollaBalance, accountRef, nested } =
    props;

  const {
    context: { wallets, rates, crypto },
    // refresh: fetchAccounts,
  } = useAccounts();

  const { colors } = useTheme();
  const {
    context: { services },
    config: { actionsConfig: actionsConfigCompany, accountsConfig },
  } = useRehiveContext();
  const { simpleWalletDetail } = accountsConfig ?? {};

  //TODO: delete these and move into action component
  const companyBankAccounts = useSelector(companyBankAccountsSelector);
  const conversionPairs = useSelector(conversionPairsSelector);

  if (!nested) {
    ({ currencyCode, dwollaBalance, accountRef } = route?.params ?? {});
  }

  const { accounts } = wallets;
  const account = accounts[accountRef];
  const item = get(account, ['currencies', currencyCode]);

  if (!item) {
    return null;
  }
  const { currency, account_name, available_balance } = item;

  const available = formatDivisibility(
    available_balance,
    currency.divisibility,
  );

  const convRate = calculateRate(
    item.currency.code,
    rates.displayCurrency.code,
    rates.rates,
  );

  let convAvailable = available * convRate;
  const diff =
    convAvailable.toString().length -
    Math.floor(convAvailable).toString().length;
  if (diff < 3) {
    convAvailable = convAvailable.toFixed(2);
  } else if (diff > rates.displayCurrency.divisibility) {
    convAvailable = convAvailable.toFixed(rates.displayCurrency.divisibility);
  }

  return (
    <View screen bC={'primary'}>
      <Overlays variant={'detail'} />
      <View style={{ zIndex: 10, flex: 1 }}>
        <CurrencyDetailHeader
          item={item}
          navigation={navigation}
          noBack={false}
          simple={simpleWalletDetail}
          dwollaBalance={dwollaBalance}
        />

        {!simpleWalletDetail && (
          <WalletActionList
            crypto={crypto}
            colors={colors}
            actionsConfigCompany={actionsConfigCompany}
            conversionPairs={conversionPairs}
            companyBankAccounts={companyBankAccounts}
            services={services}
            navigation={navigation}
            currency={item}
            currencies={wallets}
            type={'wallet'}
          />
        )}

        {/* <Text>---{dwollaBalance}</Text> */}

        <TransactionList
          showFilters
          navigation={navigation}
          services={services}
          rates={rates}
          wallet={item}
        />
      </View>
    </View>
  );
}

// const styles = StyleSheet.create({
//   tab: {
//     height: 49,
//     alignItems: 'center',
//     // justifyContent: 'center',
//     flexDirection: 'row',
//     paddingLeft: 12,
//     paddingRight: 12,
//   },
// });
