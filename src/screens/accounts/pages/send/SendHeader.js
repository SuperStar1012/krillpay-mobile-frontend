import React from 'react';
import { Text, View } from 'components';
import Recipient from '../../components/Recipient';
import { formatAmountString, useConversion } from 'utility/rates';
import { useRehiveContext } from 'contexts/RehiveContext';

export default function SendHeader(props) {
  const { wallet, form, result } = props;

  const {
    context: { services },
  } = useRehiveContext();
  const { currency } = wallet;

  const { recipient, memo, note, amount } = form.getValues();

  const amountString = amount
    ? formatAmountString(amount, currency, false)
    : 'Any amount';

  const { convAmount } = useConversion(amount, services, currency, false);

  const isTemp = result?.partner?.user?.temporary;

  return (
    <>
      <Text
        c="white"
        fW="700"
        s={16}
        id={isTemp ? 'send_initiated' : result ? 'sent' : 'send'}
        capitalize
      />
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
        <Text fW="bold" c="white" id="to" capitalize />
        <View fD="row" aI="center" pt={0.5} mr={3.5}>
          <Recipient wallet={wallet} value={recipient} />
        </View>
        {Boolean(memo) && (
          <View pt={1}>
            <Text fW="bold" c="white" id="memo" capitalize />
            <View pt={0.5}>
              <Text s={14} c="white">
                {memo}
              </Text>
            </View>
          </View>
        )}
        {Boolean(note) && (
          <View pt={1}>
            <Text
              fW="bold"
              c="white"
              id="note"
              options={{ capitalize: true }}
            />
            <View pt={0.5}>
              <Text s={14} c="white">
                {note}
              </Text>
            </View>
          </View>
        )}
      </View>
    </>
  );
}
