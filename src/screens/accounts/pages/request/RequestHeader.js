import React from 'react';
import { Text, View } from 'components';
import Recipient from '../../components/Recipient';
import {
  convertAmount,
  formatAmountString,
  useConversion,
} from 'utility/rates';
import { useRehiveContext } from 'contexts/RehiveContext';
import { concatName } from 'utility/general';

export default function RequestHeader(props) {
  const { wallet, form, result, variant, context } = props;

  let values = form.getValues();
  let { recipient, note } = values;
  const {
    context: { services },
  } = useRehiveContext();

  if (!recipient) recipient = concatName(result?.data?.user);
  if (!recipient) recipient = result?.request?.user?.email;

  const isNew = variant === 'new';

  let { amount, currency = props?.currency ?? wallet?.currency } =
    result?.data ?? {};
  if (!amount && form) {
    ({ amount } = form.getValues());
  }
  let display = false;
  if (form) {
    ({ display } = form.getValues());
  }

  amount =
    display && !result
      ? convertAmount({
          currency: { currency },
          values: { display, amount },
          rates: context?.rates,
        })
      : amount;

  const withDivis = Boolean(result?.data) || !isNew;

  const amountString = amount
    ? formatAmountString(amount, currency, withDivis)
    : 'Any amount';

  const { convAmount } = useConversion(amount, services, currency, withDivis);

  return (
    <>
      <Text
        c="white"
        fW="700"
        s={16}
        id={result?.data?.status === 'paid' ? 'request_paid' : 'request'}
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
        <Text
          fW="bold"
          c="white"
          id={result?.data?.status === 'paid' ? 'to' : 'from'}
          capitalize
        />
        <View fD="row" aI="center" pt={0.5} mr={3.5}>
          <Recipient wallet={wallet} value={recipient} />
        </View>
        {Boolean(note) && (
          <View pt={1}>
            <Text fW="bold" c="white" capitalize id="note" />
            <View pt={0.5}>
              <Text c="white">{note}</Text>
            </View>
          </View>
        )}
      </View>
    </>
  );
}
