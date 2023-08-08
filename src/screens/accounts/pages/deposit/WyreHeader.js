import React from 'react';
import { Text, View } from 'components';
import { formatAmountString, useConversion } from 'utility/rates';
import { useRehiveContext } from 'contexts/RehiveContext';
import { WyreAccountCardContent } from 'components/wyre/WyreAccountCard';
import AmountCurrencyLayout from 'screens/accounts/components/AmountCurrencyLayout';

export default function WyreHeader(props) {
  const { form, context } = props;
  const { wallet } = context;

  const {
    context: { services },
  } = useRehiveContext();
  const { currency } = wallet;

  const { account, amount } = form.getValues();

  const amountString = amount
    ? formatAmountString(amount, currency, false)
    : 'Any amount';

  const { convAmount } = useConversion(amount, services, currency, false);

  return (
    <>
      <Text c="white" fW="700" s={16} id={'deposit'} capitalize />
      {amount ? (
        <Text c="white" fW="700" s={34}>
          {amountString}
        </Text>
      ) : (
        <View pv={0.25}>
          <Text c="white" fW="400" s={20}>
            {amountString}
          </Text>
        </View>
      )}
      {Boolean(convAmount) && (
        <Text c="white" s={14}>
          {convAmount}
        </Text>
      )}
      <View pt={1}>
        <View pb={1}>
          <Text c="white" fW="700" s={16} id={'from'} capitalize paragraph />
          <WyreAccountCardContent
            item={account}
            color="white"
            context={context}
          />
        </View>

        <Text c="white" fW="700" s={16} id={'to'} capitalize />
        <AmountCurrencyLayout wallet={wallet} context={context} />
      </View>
    </>
  );
}
