import React from 'react';
import { useSelector } from 'react-redux';
import { formatDivisibility, addCommas } from '../../utility/general';
import { configAccountsSelector } from '@redux/rehive/selectors';
import CurrencyBadge from '../outputs/CurrencyBadge';
import { calculateRate, getCurrencyCode } from '../../utility/rates';
import { View, Card, Text } from '../../components';
import { useTheme } from '../../components/context';
import Skeleton from './CardsSkeleton';
import CardGradient from './CardGradient';

export default function WalletCard(props) {
  const {
    item,
    rates,
    onPress,
    onPressContent,
    noBorder,
    onPressContentDisabled,
    loading,
    label,
  } = props;
  const { design } = useTheme();

  const accountsConfig = useSelector(configAccountsSelector);

  if (!item) return null;

  const { currency, account_name, available_balance } = item;

  const available = formatDivisibility(
    available_balance,
    currency.divisibility,
  );

  const convRate = calculateRate(
    currency.code,
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
  const newDesign = true;

  const balance = `${addCommas(available)}${
    accountsConfig?.convertedBalances ? ` ${getCurrencyCode(currency)}` : ''
  }`;
  const convertedBalance = `${
    convRate ? addCommas(convAvailable) : 'N/A'
  } ${getCurrencyCode(rates.displayCurrency)}`;

  return loading || (rates.rates && !convRate) ? (
    <Skeleton {...props} />
  ) : (
    <Card
      onPressContentDisabled={onPressContentDisabled}
      onPressContent={() =>
        onPressContent ? onPressContent(item) : onPress(item)
      }
      label={label}
      design={design.wallets}
      noPadding
      noBorder={noBorder}
      wrapperStyle={{
        marginHorizontal: 0,
        padding: noBorder ? 8 : 17,
        paddingHorizontal: noBorder ? 0 : 9,
      }}>
      <View fD={'row'}>
        <View jC={'center'} style={{ marginRight: 16 }}>
          <CurrencyBadge text={currency.code} currency={currency} radius={24} />
        </View>
        <View jC={'space-between'} aI={'center'} fD={'row'} f={1}>
          <View fD={'column'} f={1} pr={2}>
            <Text
              s={16}
              fW={'500'}
              style={{ marginBottom: 6 }}
              numberOfLines={1}
              ellipsizeMode="clip">
              {newDesign ? currency.description : getCurrencyCode(currency)}
            </Text>
            <Text s={13} fW={'400'} c={'fontLight'}>
              {newDesign ? getCurrencyCode(currency) : account_name}
            </Text>
            <CardGradient />
          </View>
          <View fD={'column'} aI={'flex-end'}>
            <Text s={16} fW={'500'} style={{ marginBottom: 6 }} c="primary">
              {accountsConfig?.convertedBalances ? convertedBalance : balance}
            </Text>
            {rates && rates.rates ? (
              <Text s={13} fW={'400'} c={'fontLight'}>
                {!accountsConfig?.convertedBalances
                  ? convertedBalance
                  : balance}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </Card>
  );
}
