import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { View, Text, Button } from 'components';
import { Icon } from 'components/outputs/Icon';
import { formatAmountString } from '../../util/rates';
import { useContacts } from 'contexts/ContactsContext';
import { userLabel, contactMatch } from '../../util/requests';
import moment from 'moment';

export default function RequestPaymentActivityItem(props) {
  const {
    item,
    section,
    user,
    sendReminder,
    setSelected,
    setState,
    setDisplayModal,
    getLabels,
    refreshing,
    processingAction,
    selected,
    action,
  } = props;

  const { context: contacts } = useContacts();

  const state = section?.toLowerCase();
  // console.log('RequestPaymentActivityItem -> state', state);

  const outgoing = item.user.id === user.id;
  const blankRequest = [0, null, 'None'].includes(item?.request_amount);
  const existing = contactMatch(
    outgoing
      ? {
          email: item.payer_email,
          mobile: item.payer_mobile_number,
          contacts,
        }
      : { email: item.user.email, mobile: item.user.mobile_number, contacts },
  );

  const contact =
    existing?.name || userLabel(item, outgoing ? 'payer_user' : 'user');

  const { firstLabel, secondLabel } = getLabels(state, outgoing, contact, item);

  return (
    <View f={1} fD={'row'} ph={1} pv={0.75}>
      <View mr={1}>
        {existing?.image ? (
          <Image
            style={{ height: 37, width: 37, borderRadius: 100 }}
            source={{
              uri: existing.image,
            }}
            resizeMode={'contain'}
          />
        ) : (
          <View w={37} h={37} bC={'#DDD'} bR={100} jC={'center'} aI={'center'}>
            <Text c={'#9A9A9A'} fW={'700'} s={22}>
              {contact?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View w={'100%'} style={{ flexShrink: 1 }}>
        <Text>
          <Text
            fW={'500'}
            c={firstLabel.color}
            id={firstLabel.text}
            context={firstLabel.context}
          />
          <Text fW={'500'} c={firstLabel.color}>
            {' '}
          </Text>
          <Text fW={'500'} c={secondLabel.color} id={secondLabel.text}></Text>
        </Text>
        <View fD={'row'} jC={'space-between'} mt={0.25}>
          <Text s={13} c={'#777'}>
            {moment(item.created) < moment().subtract(2, 'd')
              ? moment(item.created).format('MMM Do YYYY, HH:mm')
              : moment(item.created).fromNow()}
          </Text>
          <Text
            s={13}
            id={blankRequest ? 'any_amount' : null}
            c={
              state === 'paid' && outgoing
                ? '#24A070'
                : state === 'paid' && !outgoing
                ? '#CC2538'
                : '#777'
            }>
            {outgoing ||
            ['pending', 'cancelled'].includes(state) ||
            blankRequest
              ? ''
              : '-'}
            {blankRequest && state === 'paid'
              ? formatAmountString(
                  item.payment_processor_quotes?.[0]?.total_paid,
                  item.request_currency,
                  true,
                )
              : formatAmountString(
                  item.request_amount,
                  item.request_currency,
                  true,
                )}
          </Text>
        </View>
        {item.description && (
          <View mt={0.5}>
            <Text lH={23}>{item.description}</Text>
          </View>
        )}
        {state === 'pending' && (
          <View fD={'row'} mt={0.5} aI={'center'} jC={'space-between'}>
            <Button
              type={'outlined'}
              id={'cancel'}
              color="primary"
              onPress={() => {
                setSelected(item);
                setState('cancel');
              }}
              wide
              size={'tiny'}
              loading={
                processingAction &&
                selected?.id === item.id &&
                action === 'cancel'
              }
              disabled={
                refreshing ||
                (processingAction &&
                  selected?.id === item.id &&
                  action === 'cancel')
              }
              containerStyle={{ minWidth: 100 }}
              buttonStyle={{ paddingTop: 6, paddingBottom: 6 }}
              textStyle={{ fontSize: 14 }}
            />
            <Button
              id={outgoing ? 'remind' : 'pay'}
              color="primary"
              onPress={() => {
                setSelected(item);

                if (outgoing) sendReminder(item);
                else {
                  // setDisplayAction(false);
                  setDisplayModal(true);
                }
                // else
                //   setState(
                //     insufficientBalance ? 'insufficientFunds' : 'confirm',
                //   );
              }}
              wide
              size={'tiny'}
              loading={
                processingAction &&
                selected?.id === item.id &&
                action === 'remind'
              }
              disabled={
                refreshing ||
                (processingAction &&
                  selected?.id === item.id &&
                  action === 'cancel')
              }
              containerStyle={{ minWidth: 100 }}
              buttonStyle={{ paddingTop: 6, paddingBottom: 6 }}
              textStyle={{ fontSize: 14 }}
            />
            <TouchableOpacity
              onPress={() => {
                setSelected(item);
                // setDisplayAction(false);
                setDisplayModal(true);
              }}>
              <Icon
                name={'dots-horizontal'}
                set={'MaterialCommunityIcons'}
                size={26}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
