import React from 'react';
import { View, Text } from 'components';
import { CustomIcon } from 'components/outputs/CustomIcon';
import { displayFormatDivisibility } from 'utility/general';
import { formatAmountString, useConversion } from '../util/rates';

const TransferConfirmHeader = props => {
  const { fromAccount, toAccount, amount, bC, colors, rates } = props;

  const amountString = formatAmountString(amount, fromAccount.currency, false);

  const { hasConversion, convAvailable } = useConversion(
    amount,
    rates,
    fromAccount.currency,
  );

  return (
    <View
      p={1.25}
      bC={bC || 'primary'}
      style={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}>
      <View>
        <Text c="white" fW="700">
          TRANSFER
        </Text>
        <Text c="white" fW="700" s={28}>
          {amountString}
        </Text>
        {hasConversion && (
          <Text c="white" s={14}>
            {convAvailable}
          </Text>
        )}
      </View>
      <View mt={1}>
        <Text fW="bold" c="#ffffff">
          FROM
        </Text>
        <View fD="row" aI="center" jC="space-between" mt={0.5}>
          <View w="50%">
            <CustomIcon
              contained={true}
              name={fromAccount.account_name}
              size={32}
              color={'#ffffff'}
              iconColor={colors.primary}
            />
          </View>
          <View>
            <Text
              tA="right"
              c="#ffffff"
              s={12}
              fW="500"
              style={{ textTransform: 'uppercase' }}>
              {fromAccount.account_name}
            </Text>
            <Text tA="right" c="#ffffff" fW="500">
              {`${displayFormatDivisibility(
                fromAccount.available_balance,
                fromAccount.currency.divisibility,
              )} ${fromAccount.currency.display_code}`}
            </Text>
          </View>
        </View>
      </View>
      <View mt={1}>
        <Text fW="bold" c="#ffffff">
          TO
        </Text>
        <View fD="row" aI="center" jC="space-between" mt={0.5}>
          <View w="50%">
            <CustomIcon
              contained={true}
              name={toAccount.account_name}
              size={32}
              color={'#ffffff'}
              iconColor={colors.primary}
            />
          </View>
          <View>
            <Text
              tA="right"
              c="#ffffff"
              s={12}
              fW="500"
              style={{ textTransform: 'uppercase' }}>
              {toAccount.account_name}
            </Text>
            <Text tA="right" c="#ffffff" fW="500">
              {`${displayFormatDivisibility(
                toAccount.available_balance,
                toAccount.currency.divisibility,
              )} ${toAccount.currency.display_code}`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TransferConfirmHeader;
