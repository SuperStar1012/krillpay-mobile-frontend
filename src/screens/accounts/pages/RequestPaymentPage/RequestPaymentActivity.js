import React, { useState, useEffect } from 'react';
import { TouchableOpacity, SectionList, Image } from 'react-native';
import { View, Text, Button } from 'components';
import { Icon } from 'components/outputs/Icon';
import { PopUpGeneral } from 'components/layout/PopUpGeneral';
import { formatAmountString } from '../../util/rates';
import { profileSelector } from '@redux/rehive/reducer';
import { useSelector, useDispatch } from 'react-redux';
import { uuidv4 } from 'utility/general';
import moment from 'moment';
import {
  updatePaymentRequest,
  createTransactionCollection,
  notifyPaymentRequest,
  cancelPaymentRequest,
} from 'utility/rehive';
import { get, orderBy } from 'lodash';
import PayPage from 'screens/accounts/components/Pay';
import { useToast } from 'contexts/ToastContext';
import { fetchAccounts } from 'redux/actions';
import * as Clipboard from 'expo-clipboard';

export default function RequestPaymentActivity(props) {
  const {
    request,
    requests = [],
    setRequests,
    receivedRequests = [],
    conversionRate,
    setPaymentResult,
    hasConversion,
    getRequests,
    rates,
    currencies,
    contactMatch,
    userLabel,
    loading,
  } = props;

  const [selected, setSelected] = useState();
  const [selectedAmount, setSelectedAmount] = useState();
  const [displayModal, setDisplayModal] = useState(false);
  const [displayAction, setDisplayAction] = useState(false);
  const [state, setState] = useState();
  const [action, setAction] = useState();
  const [processingAction, setProcessingAction] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [chosenCurrency, setChosenCurrency] = useState(false);

  const isBlankRequest = [0, null, 'None'].includes(selected?.request_amount);
  const requestCurrency = currencies?.data?.find(
    x => x.currency?.code === selected?.request_currency?.code,
  );
  const { showToast } = useToast();

  const user = useSelector(profileSelector);

  useEffect(() => {
    setChosenCurrency(requestCurrency);
  }, [selected]);

  useEffect(() => {
    if (!loading && !refreshing && !selected && request) {
      const preloadRequest = requests?.find(x => x.id === request);
      if (!preloadRequest) return;
      setSelected(preloadRequest);
      setDisplayModal(true);
    }
  }, [loading, refreshing]);

  function renderPopUp() {
    const outgoing = selected.user.id === user.id;

    return (
      <PopUpGeneral
        visible={displayModal}
        onDismiss={() => setDisplayModal(false)}
        docked>
        <PayPage
          {...{
            data: {
              currentCurrency: requestCurrency,
              currencyCode: requestCurrency?.currency?.code,
              request_id: selected?.id,
              amount: selected?.request_amount,
              subtype: 'receive_email',
            },
            config: {
              hideBack: true,
              hideInvoice: true,
              hideCurrency: outgoing,
            },
            onQuoteAdded: data => {
              let updatedRequest = {
                ...(requests?.find(x => x.id === data?.id) ?? {}),
                payment_processor_quotes: data.payment_processor_quotes,
              };

              setSelected(updatedRequest);

              setRequests(
                orderBy(
                  [
                    ...(requests?.filter(x => x.id !== data?.id) ?? []),
                    updatedRequest,
                  ],
                  'created',
                  'desc',
                ),
              );
            },
            onSuccess: response => {
              setPaymentResult({
                status: 'success',
                data: {
                  user: response.transactions[0].partner.user,
                  amount: response.transactions[0].amount * -1,
                  currency: response.transactions[0].currency,
                  account: response.transactions[0].account,
                },
              });

              getRequests({ received: true });
              setDisplayModal(false);
            },

            onError: error => {
              console.log(error);
            },
            currentRequest: selected,
            contactMatch,
            userLabel,
          }}
        />
        {state !== 'pending' && (
          <View mt={outgoing ? 1 : -1}>
            {outgoing && (
              <Button
                id="remind"
                wide
                onPress={() => {
                  setDisplayModal(false);
                  sendReminder(selected);
                }}
              />
            )}
            <Button
              type={'outlined'}
              id="cancel_request"
              wide
              onPress={() => {
                setDisplayModal(false);
                setTimeout(() => setState('cancel'), 500);
              }}
            />
          </View>
        )}
      </PopUpGeneral>
    );
  }

  function renderConfirm() {
    const outgoing = selected.user.id === user.id;
    const existing = contactMatch(
      outgoing
        ? { email: selected.payer_email, mobile: selected.payer_mobile_number }
        : { email: selected.user.email, mobile: selected.user.mobile_number },
    );
    const contact =
      (existing && existing.name) ||
      userLabel(selected, outgoing ? 'payer_user' : 'user', true);

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
                uri: existing.image,
              }}
              resizeMode={'contain'}
            />
          ) : (
            <View
              w={72}
              h={72}
              bC={'#DDD'}
              bR={100}
              jC={'center'}
              aI={'center'}>
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
                isBlankRequest ? selectedAmount : selected.request_amount,
                selected.request_currency,
                true,
              )}{' '}
              {hasConversion &&
                `(~${formatAmountString(
                  (isBlankRequest ? selectedAmount : selected.request_amount) *
                    conversionRate,
                  rates.displayCurrency,
                  true,
                  selected.request_currency.divisibility,
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

  function renderInsufficientBalance() {
    return (
      <PopUpGeneral
        visible={state === 'insufficientFunds'}
        onDismiss={() => setState('')}
        title={'Insufficient funds'}
        buttonActions={[
          {
            text: 'Cancel',
            type: 'text',
            onPress: () => setState(''),
          },
        ]}>
        <Text tA={'center'}>
          You do not have sufficient funds to make this payment.
        </Text>
      </PopUpGeneral>
    );
  }

  function renderCancel() {
    const outgoing = selected.user.id === user.id;

    const existing = contactMatch(
      outgoing
        ? { email: selected.payer_email, mobile: selected.payer_mobile_number }
        : { email: selected.user.email, mobile: selected.user.mobile_number },
    );
    const contact =
      (existing && existing.name) ||
      userLabel(selected, outgoing ? 'payer_user' : 'user', true);

    return (
      <PopUpGeneral
        visible={state === 'cancel'}
        onDismiss={() => setState('')}
        title={`${outgoing ? 'Cancel' : 'Decline'} request`}
        buttonActions={[
          { text: 'Back', type: 'text', onPress: () => setState('') },
          {
            text: 'CANCEL',
            loading: processingAction,
            color: '#CC2538',
            onPress: async () => {
              await handleSubmit('cancel');
              setState('');
            },
          },
        ]}>
        <View mb={1} aI={'center'}>
          {existing?.image ? (
            <Image
              style={{ height: 72, width: 72, borderRadius: 100 }}
              source={{
                uri: existing.image,
              }}
              resizeMode={'contain'}
            />
          ) : (
            <View
              w={72}
              h={72}
              bC={'#DDD'}
              bR={100}
              jC={'center'}
              aI={'center'}>
              <Text c={'#9A9A9A'} fW={'700'} s={40}>
                {contact?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View mb={0.5}>
          <Text tA={'center'} lH={23}>
            Are you sure you want to
            <Text fW={'bold'}>
              {' '}
              {outgoing ? 'cancel your' : 'decline the'} request
            </Text>{' '}
            of{' '}
            <Text c="primary" fW={'bold'}>
              {isBlankRequest
                ? 'any amount'
                : formatAmountString(
                    selected.request_amount,
                    selected.request_currency,
                    true,
                  )}{' '}
              {hasConversion &&
                !isBlankRequest &&
                `(~${formatAmountString(
                  selected.request_amount * conversionRate,
                  rates.displayCurrency,
                  true,
                  selected.request_currency.divisibility,
                )}) `}
            </Text>
            from{' '}
            <Text c="primary" fW={'bold'}>
              {userLabel(selected, outgoing ? 'payer_user' : 'user', true)}
            </Text>
            {selected.description && <Text> for {selected.description}</Text>}
          </Text>
        </View>
      </PopUpGeneral>
    );
  }

  async function refreshRequests() {
    setRefreshing(true);
    await getRequests({ getReceived: true });
    setRefreshing(false);
  }

  async function handleSubmit(action) {
    setProcessingAction(true);
    setAction(action);

    switch (action) {
      case 'pay':
        await makePayment();
        await refreshRequests();
        break;
      // case 'remind':
      //   await sendReminder();
      //   break;
      case 'cancel':
        await cancelRequest();
        refreshRequests();
        break;
      case 'copy':
        Clipboard.setString(selected.redirect_url);
        showToast({
          text: 'Copied to clipboard!',
        });
        break;
    }
    setSelected(null);
    setProcessingAction(false);
  }

  async function makePayment() {
    try {
      let data = {
        primary_payment_processor: 'native',
        payment_processor_currency: selected.request_currency.code,
      };

      if (isBlankRequest) data.quote_amount = selectedAmount;

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
          user: user.id,
          amount: isBlankRequest ? selectedAmount : selected.request_amount,
          currency: selected.request_currency.code,
          account: requestCurrency.account,
          subtype: 'send_email',
        },
        {
          id: quote.reference,
          partner: uuid,
          tx_type: 'credit',
          status: 'complete',
          amount: isBlankRequest ? selectedAmount : selected.request_amount,
          currency: selected.request_currency.code,
          account_name: selected.account,
          subtype: payment_processor.rehive_subtype ?? 'receive_email',
          user: selected.user.id,
        },
      ];
      const response = await createTransactionCollection(transactions);

      setPaymentResult({
        status: 'success',
        data: {
          user: response.transactions[0].partner.user,
          amount: response.transactions[0].amount * -1,
          created: response.transactions[0]?.created,
        },
      });

      getRequests({ received: true });
      // dispatch(fetchAccounts());
    } catch (error) {
      console.log(error);
    }
  }

  async function sendReminder(item) {
    setProcessingAction(true);
    setAction('remind');

    await notifyPaymentRequest(item?.id);
    showToast({
      text: `A reminder has been sent to ${
        item?.payer_email || item?.payer_mobile
      }`,
    });

    setProcessingAction(false);
  }

  async function cancelRequest() {
    const outgoing = selected.user.id === user.id;

    await cancelPaymentRequest(selected?.id, {
      incoming: !outgoing,
    });
  }

  function getLabels(state, outgoing, contact) {
    let firstLabel = {};
    let secondLabel = {};
    switch (state) {
      case 'pending':
        firstLabel.text = outgoing ? 'You have requested' : `${contact} has`;
        firstLabel.color = outgoing ? 'primary' : 'font';
        secondLabel.text = outgoing ? `from ${contact}` : 'requested from you';
        secondLabel.color = outgoing ? 'font' : 'primary';
        break;
      case 'paid':
        firstLabel.text = outgoing ? `${contact} has` : 'You paid';
        firstLabel.color = outgoing ? 'font' : 'primary';
        secondLabel.text = outgoing ? 'paid you' : `${contact}`;
        secondLabel.color = outgoing ? 'primary' : 'font';
        break;
      case 'cancelled':
        firstLabel.text = outgoing
          ? `${contact} has`
          : 'You cancelled a request from';
        firstLabel.color = 'font';
        secondLabel.text = outgoing
          ? 'cancelled a request from you'
          : `${contact}`;
        secondLabel.color = 'font';
        break;
    }

    return { firstLabel, secondLabel };
  }

  function renderItem({ item, section }) {
    const state = section?.title?.toLowerCase();

    const outgoing = item.user.id === user.id;
    const blankRequest = [0, null, 'None'].includes(item?.request_amount);
    const existing = contactMatch(
      outgoing
        ? { email: item.payer_email, mobile: item.payer_mobile_number }
        : { email: item.user.email, mobile: item.user.mobile_number },
    );

    const contact =
      existing?.name || userLabel(item, outgoing ? 'payer_user' : 'user');

    const { firstLabel, secondLabel } = getLabels(state, outgoing, contact);

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
            <View
              w={37}
              h={37}
              bC={'#DDD'}
              bR={100}
              jC={'center'}
              aI={'center'}>
              <Text c={'#9A9A9A'} fW={'700'} s={22}>
                {contact?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View w={'100%'} style={{ flexShrink: 1 }}>
          <Text>
            <Text fW={'500'} c={firstLabel.color}>
              {firstLabel.text}{' '}
            </Text>
            <Text fW={'500'} c={secondLabel.color}>
              {secondLabel.text}
            </Text>
          </Text>
          <View fD={'row'} jC={'space-between'} mt={0.25}>
            <Text s={13} c={'#777'}>
              {moment(item.created) < moment().subtract(2, 'd')
                ? moment(item.created).format('MMM Do YYYY, HH:mm')
                : moment(item.created).fromNow()}
            </Text>
            <Text
              s={13}
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
                : blankRequest
                ? 'Any amount'
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
                label={'CANCEL'}
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
                label={outgoing ? 'REMIND' : 'PAY'}
                color="primary"
                onPress={() => {
                  setSelected(item);

                  if (outgoing) sendReminder(item);
                  else {
                    setDisplayAction(false);
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
                  setDisplayAction(false);
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

  // const insufficientBalance =
  //   selected && requestCurrency.available_balance < selected.request_amount;

  const sections = [
    {
      title: 'Pending',
      data: [...requests, ...receivedRequests].filter(item =>
        ['draft', 'initiated', 'underpaid', 'late'].includes(item.status),
      ),
    },
    {
      title: 'Paid',
      hideActions: true,
      data: [...requests, ...receivedRequests].filter(item =>
        ['complete', 'paid', 'overpaid'].includes(item.status),
      ),
    },
    {
      title: 'Cancelled',
      hideActions: true,
      data: [...requests, ...receivedRequests].filter(
        item => item.status === 'cancelled',
      ),
    },
  ];

  return (
    <View h={'100%'} pt={0.5}>
      <SectionList
        stickySectionHeadersEnabled={true}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          overflow: 'hidden',
        }}
        sections={sections.filter(x => x.data.length)}
        onRefresh={() => refreshRequests()}
        refreshing={refreshing || loading}
        ListEmptyComponent={
          !loading && (
            <Text tA={'center'} c={'grey'}>
              No payment request activity
            </Text>
          )
        }
        renderItem={itemProps => renderItem(itemProps)}
        renderSectionHeader={({ section }) => (
          <View ml={1} pv={0.5} bC={'white'}>
            <Text s={18} fW={'500'}>
              {section.title}
            </Text>
          </View>
        )}
        renderSectionFooter={() => <View p={0.25} />}
        keyExtractor={item => (item.id ? item.id.toString() : '')}
        showsVerticalScrollIndicator={false}
      />
      {selected && renderPopUp()}
      {selected && renderConfirm()}
      {selected && renderCancel()}
      {selected && renderInsufficientBalance()}
    </View>
  );
}
