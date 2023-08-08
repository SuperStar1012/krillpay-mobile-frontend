import React from 'react';
import { View, Card, Text } from 'components';
import CurrencyBadge from '../outputs/CurrencyBadge';
import { getCurrencyCode } from 'utility/rates';
import Overlays from 'screens/accounts/components/Overlays';
import CardGradient from './CardGradient';

export default function BalanceCard(props) {
  const { item, design, onPressContent, overlay, disabled, ...otherProps } =
    props;
  const { currency, account_name } = item;

  if (!item) return null;

  const newDesign = true;

  return (
    <Card
      onPressContentDisabled={disabled}
      onPressContent={onPressContent}
      design={design?.wallets}
      noPadding
      wrapperStyle={{
        marginHorizontal: 0,
        padding: 17,
        paddingHorizontal: 9,
      }}
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
        <View fD={'column'} f={1}>
          <View jC={'space-between'} aI={'center'} fD={'row'} f={1}>
            <View fD={'column'} f={1} pr={2}>
              <Text s={16} fW={'500'} numberOfLines={1} ellipsizeMode="clip">
                {newDesign ? currency.description : getCurrencyCode(currency)}
              </Text>
              <CardGradient />
            </View>
          </View>
          <View jC={'space-between'} aI={'center'} fD={'row'} f={1}>
            <View fD={'column'} f={1} pr={2}>
              <Text s={13} fW={'400'}>
                {newDesign ? getCurrencyCode(currency) : account_name}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}
