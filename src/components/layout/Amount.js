import React from 'react';
import { Text, View, Button } from 'components';
import { formatAmountString, renderRate } from 'utility/rates';
import { Icon } from 'components/outputs/Icon';
import ConversionRate from './ConversionRate';

export default function AmountLayout(props) {
  const {
    onEdit,
    amount,
    convAmount,
    convCurrency,
    currency,
    rate,
    hideRate,
  } = props;
  const showEdit = Boolean(onEdit);
  const showQuote = Boolean(convAmount);

  return (
    <>
      <View pb={showQuote ? 0.5 : 0}>
        <View fD="row" aI="center" pb={0.5} w="100%" jC="center">
          {showEdit && <View w={34} />}
          <Text tA="center" c="primary" t="h2" fW="bold" s={30}>
            {amount}
          </Text>
          {showEdit && (
            <Button onPress={onEdit}>
              <Icon
                set="MaterialIcons"
                name={'edit'}
                size={22}
                color={'primary'}
                style={{ paddingLeft: 12 }}
              />
            </Button>
          )}
        </View>
        {showQuote && (
          <Text s={14} style={{ opacity: 0.67 }} tA="center">
            {convAmount}
          </Text>
        )}
      </View>
      {Boolean(rate) && !hideRate && (
        <View pt={0.25} pb={0.5}>
          <ConversionRate>
            {renderRate({
              toCurrency: convCurrency,
              fromCurrency: currency,
              rate,
            })}
          </ConversionRate>
        </View>
      )}
    </>
  );
}
