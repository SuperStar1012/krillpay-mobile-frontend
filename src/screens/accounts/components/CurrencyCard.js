import React from 'react';
import { View, Card, Text } from 'components';
import { displayFormatDivisibility, formatDivisibility } from 'utility/general';
import CurrencyBadge from 'components/outputs/CurrencyBadge';
import { calculateRate, getCurrencyCode, useConversion } from '../util/rates';
import context from 'components/context';
import Overlays from './Overlays';
import CardGradient from 'components/cards/CardGradient';

const _CurrencyCard = props => {
  const { item, design, rates, onPressContent, overlay, ...otherProps } = props;
  if (!item) {
    return null;
  }
  const { currency, account_name, available_balance } = item ?? {};

  const available = formatDivisibility(
    available_balance,
    currency?.divisibility,
  );

  let { convAvailable, convRate } = useConversion(available, rates, currency);
  const newDesign = true;

  return (
    <Card
      onPressContent={onPressContent}
      design={design?.wallets ?? {}}
      innerStyle={{ paddingVertical: 12 }}
      {...otherProps}>
      {overlay && <Overlays variant={'cardSmall'} />}
      <View
        fD={'row'}
        jC={'flex-start'}
        bC={overlay ? 'primary' : 'transparent'}>
        <View jC={'center'} style={{ paddingRight: 16 }}>
          <CurrencyBadge
            text={currency?.code}
            currency={currency}
            radius={24}
          />
        </View>
        <View jC={'space-between'} aI={'center'} fD={'row'} f={1}>
          <View fD={'column'} f={1} pr={2}>
            <Text s={16} fW={'500'} numberOfLines={1} ellipsizeMode="clip">
              {newDesign ? currency?.description : getCurrencyCode(currency)}
            </Text>
            <Text s={13} fW={'400'}>
              {newDesign ? getCurrencyCode(currency) : account_name}
            </Text>
            <CardGradient />
          </View>
          <View fD={'column'} aI={'flex-end'}>
            <Text s={20} fW={'500'} c="primary">
              {displayFormatDivisibility(
                available_balance,
                currency?.divisibility,
              )}
            </Text>
            {Boolean(convRate) && (
              <Text s={14} fW={'400'}>
                {convAvailable}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
};

const CurrencyCard = context(_CurrencyCard);

export { CurrencyCard };
