import React from 'react';
import { Image } from 'react-native';
import { View, Text } from 'components';
import { PopUpGeneral } from 'components/layout/PopUpGeneral';
import { formatAmountString } from '../../util/rates';
import { userLabel, contactMatch } from '../../util/requests';
import { cancelPaymentRequest } from 'utility/rehive';

export default function RequestPaymentActivityCancel(props) {
  const {
    user,
    state,
    rates,
    setState,
    processingAction,
    selected,
    refreshRequests,
    setProcessingAction,
    setAction,
    setSelected,
    hasConversion,
    conversionRate,
  } = props;

  const outgoing = selected?.user?.id === user?.id;
  const isBlankRequest = [0, null, 'None'].includes(selected?.request_amount);

  const existing = contactMatch(
    outgoing
      ? { email: selected?.payer_email, mobile: selected?.payer_mobile_number }
      : { email: selected?.user?.email, mobile: selected?.user?.mobile_number },
  );
  const contact =
    existing?.name ||
    userLabel(selected, outgoing ? 'payer_user' : 'user', true);

  async function cancelRequest() {
    const outgoing = selected?.user?.id === user?.id;

    await cancelPaymentRequest(selected?.id, {
      incoming: !outgoing,
    });
  }

  async function handleSubmit() {
    setProcessingAction(true);
    setAction('cancel');

    await cancelRequest();
    refreshRequests();

    setSelected(null);
    setProcessingAction(false);
  }

  return (
    <PopUpGeneral
      visible={state === 'cancel'}
      onDismiss={() => setState('')}
      title={outgoing ? 'cancel_request' : 'decline_request'}
      buttonActions={[
        { id: 'back', type: 'text', onPress: () => setState('') },
        {
          id: 'cancel',
          loading: processingAction,
          color: '#CC2538',
          onPress: async () => {
            await handleSubmit();
            setState('');
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
          <Text
            id={outgoing ? 'cancel_request_prefix' : 'decline_request_prefix'}
          />{' '}
          <Text c="primary" fW={'bold'}>
            {isBlankRequest
              ? 'any amount'
              : formatAmountString(
                  selected?.request_amount,
                  selected?.request_currency,
                  true,
                )}{' '}
            {hasConversion &&
              !isBlankRequest &&
              `(~${formatAmountString(
                selected?.request_amount * conversionRate,
                rates?.displayCurrency,
                true,
                selected?.request_currency?.divisibility,
              )}) `}
          </Text>
          <Text id="from" options={{ lowercase: true }} />{' '}
          <Text c="primary" fW={'bold'}>
            {userLabel(selected, outgoing ? 'payer_user' : 'user', true)}
          </Text>
          {selected.description && (
            <>
              {' '}
              <Text id="for" options={{ lowercase: true }} />
              <Text> {selected.description}</Text>
            </>
          )}
        </Text>
      </View>
    </PopUpGeneral>
  );
}
