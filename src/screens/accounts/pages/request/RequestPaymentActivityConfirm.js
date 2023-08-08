import React from 'react';
import { PopUpGeneral } from 'components/layout/PopUpGeneral';
import { View, Text } from 'components';
import { Image } from 'react-native';
import { formatAmountString } from '../../util/rates';
import { userLabel, contactMatch } from '../../util/requests';
import { get } from 'lodash';
import { uuidv4 } from 'utility/general';
import {
  updatePaymentRequest,
  createTransactionCollection,
} from 'utility/rehive';

export default function RequestPaymentActivityConfirm(props) {
  const {
    user,
    setState,
    processingAction,
    setProcessingAction,
    setAction,
    selected,
    action,
    setSelected,
    state,
    getRequests,
    refreshRequests,
    setResult,
    hasConversion,
    conversionRate,
    rates,
    requestCurrency,
  } = props;

  const outgoing = selected?.user?.id === user?.id;
  const existing = contactMatch(
    outgoing
      ? { email: selected?.payer_email, mobile: selected?.payer_mobile_number }
      : { email: selected?.user?.email, mobile: selected?.user?.mobile_number },
  );
  const contact =
    (existing && existing.name) ||
    userLabel(selected, outgoing ? 'payer_user' : 'user', true);

  // const isBlankRequest = [0, null, 'None'].includes(selected?.request_amount);

  async function makePayment() {
    try {
      let data = {
        primary_payment_processor: 'native',
        payment_processor_currency: selected?.request_currency.code,
      };

      // if (isBlankRequest) data.quote_amount = selectedAmount;

      const request = await updatePaymentRequest(selected?.id, data);
      const quote = get(request, ['data', 'payment_processor_quotes', '0'], {});
      const payment_processor = get(quote, ['payment_processor']);
      const uuid = uuidv4();

      let transactions = [
        {
          id: uuid,
          partner: quote.reference,
          tx_type: 'debit',
          status: 'complete',
          user: user?.id,
          // amount: isBlankRequest ? selectedAmount : selected.request_amount,
          amount: selected?.request_amount,
          currency: selected?.request_currency.code,
          account: requestCurrency.account,
          subtype: 'send_email',
        },
        {
          id: quote.reference,
          partner: uuid,
          tx_type: 'credit',
          status: 'complete',
          // amount: isBlankRequest ? selectedAmount : selected.request_amount,
          amount: selected?.request_amount,
          currency: selected?.request_currency.code,
          account_name: selected?.account,
          subtype: payment_processor.rehive_subtype ?? 'receive_email',
          user: selected?.user?.id,
        },
      ];
      const response = await createTransactionCollection(transactions);

      setResult({
        status: 'success',
        data: {
          ...response,
          user: response?.transactions?.[0]?.partner?.user,
          amount: response?.transactions?.[0]?.amount * -1,
          ...selected,
          status: 'paid',
        },
      });

      getRequests({ received: true });
      // dispatch(fetchAccounts());
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit() {
    setProcessingAction(true);
    setAction(action);

    await makePayment();
    await refreshRequests();

    setSelected(null);
    setProcessingAction(false);
  }

  return (
    <PopUpGeneral
      visible={state === 'confirm'}
      onDismiss={() => setState('')}
      title={'Confirm pay'}
      titleStyle={{ fontWeight: 700 }}
      buttonActions={[
        {
          text: 'Cancel',
          type: 'text',
          onPress: () => setState(''),
        },
        {
          text: 'CONFIRM',
          loading: processingAction,
          onPress: async () => {
            await handleSubmit('pay');
            setState('action');
          },
        },
      ]}>
      <View mb={1} aI={'center'}>
        {existing?.image ? (
          <Image
            style={{ height: 72, width: 72, borderRadius: 100 }}
            source={{
              uri: existing?.image,
            }}
            resizeMode={'contain'}
          />
        ) : (
          <View w={72} h={72} bC={'#DDD'} bR={100} jC={'center'} aI={'center'}>
            <Text c={'#9A9A9A'} fW={'700'} s={40}>
              {contact?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <View mb={0.5}>
        <Text tA={'center'} lH={23}>
          You are about to pay{' '}
          <Text c="primary" fW={'bold'}>
            {formatAmountString(
              selected?.request_amount,
              // isBlankRequest ? selectedAmount : selected.request_amount,
              selected?.request_currency,
              true,
            )}{' '}
            {hasConversion &&
              `(~${formatAmountString(
                // (isBlankRequest ? selectedAmount : selected.request_amount) * conversionRate,
                selected?.request_amount * conversionRate,
                rates?.displayCurrency,
                true,
                selected?.request_currency?.divisibility,
              )}) `}
          </Text>
          to{' '}
          <Text c="primary" fW={'bold'}>
            {contact}
          </Text>
          {selected.description && <Text> for {selected.description}</Text>}
        </Text>
      </View>
    </PopUpGeneral>
  );
}
