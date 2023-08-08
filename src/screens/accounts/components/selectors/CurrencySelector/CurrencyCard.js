import React from 'react';
import { View, Card, Text } from 'components';
import { displayFormatDivisibility, formatDivisibility } from 'utility/general';

import { calculateRate, getCurrencyCode } from 'utility/rates';
import context from 'components/context';
import CurrencyBadge from 'components/outputs/CurrencyBadge';
import CardGradient from 'components/cards/CardGradient';

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
  const simple = false;

  return (
    <Card
      onPressContent={onPressContent}
      design={design.wallets}
      {...otherProps}>
      {/* {overlay && <Overlays variant={'cardSmall'} />} */}
      <View
        fD={'row'}
        jC={'flex-start'}
        bC={overlay ? 'primary' : 'transparent'}>
        <View
          f={1}
          fD={'row'}
          jC={'flex-start'}
          bC={overlay ? 'primary' : 'transparent'}>
          <View jC={'center'} style={{ paddingRight: 16 }}>
            <CurrencyBadge
              text={item.currency.code}
              currency={item.currency}
              radius={20}
            />
          </View>
          <View fD={'column'} f={1}>
            <View jC={'center'} aI={'center'} fD={'row'} f={1}>
              <View fD={'column'} f={1} pr={1.5}>
                <Text s={16} fW={'500'} numberOfLines={1} ellipsizeMode="clip">
                  {currency?.description
                    ? currency?.description
                    : getCurrencyCode(currency)}
                </Text>
                <CardGradient />
              </View>
              {!simple && (
                <View fD={'column'} aI={'flex-end'}>
                  <Text s={20} fW={'500'} c="primary">
                    {displayFormatDivisibility(
                      available_balance,
                      currency.divisibility,
                    )}
                  </Text>
                </View>
              )}
            </View>
            <View jC={'space-between'} aI={'center'} fD={'row'} f={1}>
              <View f={1} pr={2}>
                <Text s={13} lH={13} fW={'400'}>
                  {currency?.description ? getCurrencyCode(currency) : ''}
                </Text>
              </View>
              {!simple && (
                <View fD={'column'} aI={'flex-end'}>
                  {Boolean(convRate) && (
                    <Text s={14} fW={'400'}>
                      {convAvailable + ' ' + rates.displayCurrency.code}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

const CurrencyCard = context(_CurrencyCard);

export { CurrencyCard };
