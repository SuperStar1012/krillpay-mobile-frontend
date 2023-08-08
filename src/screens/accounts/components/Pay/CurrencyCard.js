import React from 'react';
import { View, Card, Text } from 'components';
import CurrencyBadge from 'components/outputs/CurrencyBadge';
import { calculateRate } from '../util/rates';
import context from 'components/context';
import Overlays from './Overlays';
import { getCurrencyCode } from '../../util/rates';
import { displayFormatDivisibility, formatDivisibility } from 'utility/general';

const _CurrencyCard = props => {
  const { item, design, rates, onPressContent, overlay, ...otherProps } = props;
  if (!item) {
    return null;
  }
  const { currency, account_name, available_balance } = item;

  const available = formatDivisibility(
    available_balance,
    currency.divisibility,
  );

  const convRate = rates
    ? calculateRate(item.currency.code, rates.displayCurrency.code, rates.rates)
    : 0;

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
    <Card
      onPressContent={() => onPressContent()}
      design={design.wallets}
      {...otherProps}>
      {overlay && <Overlays variant={'cardSmall'} />}
      <View
        fD={'row'}
        jC={'flex-start'}
        bC={overlay ? 'primary' : 'transparent'}>
        <View jC={'center'} style={{ paddingRight: 16 }}>
          <CurrencyBadge
            text={item.currency.code}
            currency={item.currency}
            radius={24}
          />
        </View>
        <View jC={'space-between'} aI={'center'} fD={'row'} f={1}>
          <View fD={'column'}>
            <Text s={20} fW={'500'}>
              {getCurrencyCode(currency)}
            </Text>
            <Text s={14} fW={'400'}>
              {account_name}
            </Text>
          </View>
          <View fD={'column'} aI={'flex-end'}>
            <Text s={20} fW={'500'} c="primary">
              {displayFormatDivisibility(
                available_balance,
                currency.divisibility,
              )}
            </Text>
            <Text s={14} fW={'400'}>
              {Boolean(convRate)
                ? convAvailable + ' ' + getCurrencyCode(rates.displayCurrency)
                : ''}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const CurrencyCard = context(_CurrencyCard);

export { CurrencyCard };
