import React from 'react';
import { Text, View, Spinner } from 'components';
import { StyleSheet } from 'react-native';
import Recipient from '../../components/Recipient';
import {
  convertAmount,
  formatAmountString,
  useConversion,
} from 'utility/rates';
import SendRecipient from '../../components/SendRecipient';
import { useRehiveContext } from 'contexts/RehiveContext';
import { concatName } from 'utility/general';

export default function RequestHeader(props) {
  const {
    wallet,
    form,
    result,
    variant,
    context,
    recipientDetails,
    isSuccess,
    isRecipientDetailsLoading,
  } = props;

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

  const styles = StyleSheet.create({
    text: {
      textAlign: 'center',
      textAlignVertical: 'center',
      color: '#000000',
      marginTop: 2,
    },
  });

  const showDetails = () => {
    if (isRecipientDetailsLoading) {
      return <Spinner />;
    } else if (!recipientDetails) {
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
    } else {
      return (
        <>
          {!recipientDetails && <Spinner />}
          {!isSuccess && recipientDetails && (
            <View>
              <Text style={styles.text}>You are about to request</Text>
              {amount ? (
                <Text style={styles.text} c="white" fW="700" s={34}>
                  {amountString}
                </Text>
              ) : (
                <View pv={0.25}>
                  <Text style={styles.text} c="white" fW="400" s={20}>
                    {amountString}
                  </Text>
                </View>
              )}
              {Boolean(convAmount) && (
                <Text style={styles.text} c="white" s={14}>
                  {convAmount}
                </Text>
              )}
              <View pt={1}>
                <Text style={styles.text}>from</Text>
              </View>
              <View pt={1}>
                <View aI="center" jC="center" f={1} pt={0.5}>
                  <SendRecipient
                    recipientDetails={recipientDetails}
                    wallet={wallet}
                    value={recipient}
                  />
                </View>
              </View>
            </View>
          )}
          {recipientDetails && isSuccess && (
            <>
              <View aI="center" jC="center" f={1} pt={2} pb={2}>
                {amount ? (
                  <Text style={styles.text} c="white" fW="700" s={34}>
                    {amountString}
                  </Text>
                ) : (
                  <View pv={0.25}>
                    <Text style={styles.text} c="white" fW="400" s={20}>
                      {amountString}
                    </Text>
                  </View>
                )}
                {Boolean(convAmount) && (
                  <Text style={styles.text} c="white" s={14}>
                    {convAmount}
                  </Text>
                )}
              </View>
              <View pt={1}>
                <Text s={23} fW={700} style={styles.text}>
                  has been sent to
                </Text>
              </View>
              <View aI="center" jC="center" f={1} pt={2} pb={2}>
                <SendRecipient
                  recipientDetails={recipientDetails}
                  wallet={wallet}
                  value={recipient}
                />
              </View>
            </>
          )}
        </>
      );
    }
  };
  return <>{showDetails()}</>;
}
