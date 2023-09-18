import React from 'react';
import { StyleSheet } from 'react-native';
import { Spinner, Text, View } from 'components';
import SendRecipient from '../../components/SendRecipient';
import { formatAmountString, useConversion } from 'utility/rates';
import { useRehiveContext } from 'contexts/RehiveContext';
import { useContacts } from 'contexts/ContactsContext';
import Recipient from 'screens/accounts/components/Recipient';

export default function SendHeader(props) {
  const { wallet, form, result, recipientDetails, isSuccess } = props;

  const {
    context: { services },
  } = useRehiveContext();
  const { currency } = wallet;

  const { context: contacts } = useContacts('mobile');

  const nonKrillPayUser = contacts?.phone?.contacts?.some(
    contact => contact?.contact === recipientDetails?.contact,
  );

  const { recipient, memo, note, amount } = form.getValues();

  const amountString = amount
    ? formatAmountString(amount, currency, false)
    : 'Any amount';

  const { convAmount } = useConversion(amount, services, currency, false);

  const isTemp = result?.partner?.user?.temporary;

  const styles = StyleSheet.create({
    text: {
      textAlign: 'center',
      textAlignVertical: 'center',
      color: '#000000',
      marginTop: 2,
    },
  });
  return (
    <>
      {!recipientDetails && (
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
      )}
      {!isSuccess && recipientDetails && !nonKrillPayUser && (
        <View>
          <Text style={styles.text}>You are about to send</Text>
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
            <Text style={styles.text}>to a KrillPay user</Text>
            <View aI="center" jC="center" f={1} pt={0.5}>
              <SendRecipient
                recipientDetails={recipientDetails}
                wallet={wallet}
                value={recipient}
              />
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
        </View>
      )}

      {!isSuccess && recipientDetails && nonKrillPayUser && (
        <View>
          <Text style={styles.text}>You are attempting to send</Text>
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
            <Text style={styles.text}>to a non-KrillPay user</Text>
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
            <SendRecipient
              recipientDetails={recipientDetails}
              wallet={wallet}
              value={recipient}
            />
          </View>
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
        </>
      )}
    </>
  );
}
