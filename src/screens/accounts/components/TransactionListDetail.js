import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { formatAmountString, renderRate } from '../util/rates';
import { View, Spinner, Text, Button } from 'components';
import OutputList from 'components/outputs/OutputList';
import TransactionListCryptoDetails from './TransactionListCryptoDetails';
import { getCampaign } from 'utility/rehive';
import ErrorOutput from 'components/outputs/ErrorOutput';
import CampaignCard from '../../rewards/components/CampaignCard';
import SendRecipient from '../components/SendRecipient';
import { formatTime } from 'utility/general';
import { useToast } from 'contexts/ToastContext';

import { currenciesSelector } from 'screens/accounts/redux/reducer';
import { useSelector } from 'react-redux';
import QuickActionConfig from '../config/quickActions';
import ReceiptInfoPage from './ReceiptInfoPage';
import { ModalFullscreen } from 'components/modals/ModalFullscreen';
import { TextInput, TouchableOpacity } from 'react-native';

const config = {
  send: {
    recipientLabel: 'Recipient',
    amountLabel: 'Amount sent',
    feeLabel: 'Service fee',
    totalLabel: 'Total transaction amount',
  },
  receive: {
    recipientLabel: 'Sender',
    amountLabel: 'Amount received',
    feeLabel: 'Service fee',
    totalLabel: 'Total transaction amount',
  },
  withdraw: {
    recipientLabel: 'Account',
    amountLabel: 'Withdrawal amount',
    feeLabel: 'Withdrawal fee',
    totalLabel: 'Total transaction amount',
  },
  buy: {
    recipientLabel: 'Account',
    amountLabel: 'Bought',
    feeLabel: 'Buy fee',
    totalLabel: 'Total buy amount',
  },
  sell: {
    recipientLabel: 'Account',
    amountLabel: 'Sold',
    feeLabel: 'Sell fee',
    totalLabel: 'Total sell amount',
  },
  default: {
    recipientLabel: 'Recipient',
    amountLabel: 'Amount',
    feeLabel: 'Service fee',
    totalLabel: 'Total amount',
  },
};

export default function TransactionListDetail(props) {
  const {
    open,
    item = {},
    rates,
    convRate,
    profile,
    closeModal,
    navigation,
    recipient,
    recipientDetails,
    getTransactions,
    nav,
    c,
    crypto,
    setItem,
  } = props;

  const {
    id,
    amount,
    total_amount,
    currency,
    fee,
    balance,
    metadata,
    note,
    description,
    subtype,
    partner,
    tx_type,
    created,
  } = item;

  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [loadingSecondaryAction, setLoadingSecondaryAction] = useState(false);
  const [actionContentVisible, setActionContentVisible] = useState(false);
  const [reward, setReward] = useState(null);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);

  const { showToast } = useToast();

  const isBlankRequest =
    subtype === 'request' && [0, null, 'None'].includes(amount);
  const hasReward = Boolean(metadata && metadata.service_reward);
  const hideEmail = Boolean(
    metadata &&
      (metadata.service_reward ||
        metadata.service_product ||
        metadata.service_crypto),
  );

  useEffect(() => {
    async function fetchData() {
      const id = get(metadata, ['service_reward', 'campaign_id']);
      const resp = await getCampaign(id);

      if (resp.status === 'success') {
        setReward(resp.data);
      } else {
        setError(resp.message);
      }
      setLoading(false);
    }
    if (open && hasReward) {
      fetchData();
    }
  }, [hasReward, metadata, open]);

  if (!open || !item) {
    return null;
  }

  const horizontal = false;

  let labelConfig = config[subtype];
  if (!labelConfig) {
    labelConfig = config.default;
  }

  let items = [
    description
      ? { id: 'note', label: 'note', value: description, horizontal }
      : null,
    {
      id: 'id',
      label: 'transaction_id',
      value: id,
      valueColor: true,
      copy: true,
      // horizontal,
    },
    // recipient
    //   ? {
    //       id: 'recipient',
    //       label: copyConfig.label ? copyConfig.label : 'Recipient',
    //       value: recipient.substr(1),
    //       horizontal,
    //     }
    //   : null,
    note ? { id: 'note', label: 'note', value: note, horizontal } : null,
  ];

  if (partner && partner.user) {
    const { email, mobile, first_name, last_name, identifier } = partner.user;

    if (email && !hideEmail) {
      items.push({
        id: 'email',
        value: email,
        horizontal,
      });
    }
    if (mobile) {
      items.push({
        id: 'mobile',
        value: mobile,
        horizontal,
      });
    }
    if (identifier) {
      items.push({
        id: 'recipient',
        value: identifier,
        horizontal,
      });
    }
    if (first_name || last_name) {
      items.push({
        id: 'name',
        value: first_name + (last_name ? ' ' + last_name : ''),
        horizontal,
      });
    }
  }
  items.push('divider');

  const amountLabel = labelConfig.amountLabel;
  let amountValue = amount / 10 ** currency.divisibility;
  let amountString = '';
  let amountConvString = '';
  amountString = isBlankRequest
    ? 'any_amount'
    : formatAmountString(amountValue, currency);
  if (convRate) {
    amountConvString = isBlankRequest
      ? null
      : '~' + formatAmountString(amountValue * convRate, rates.displayCurrency);
  }
  items.push({
    id: 'amount',
    label: amountLabel,
    value: amountString,
    value2: amountConvString,
    horizontal: true,
  });

  if (fee) {
    const feeLabel = labelConfig.feeLabel;
    let feeValue = fee / 10 ** currency.divisibility;
    let feeString = '';
    let feeConvString = '';
    feeString = formatAmountString(feeValue, currency);
    if (convRate) {
      feeConvString =
        '~' + formatAmountString(feeValue * convRate, rates.displayCurrency);
    }
    items.push({
      id: 'fee',
      label: feeLabel,
      value: feeString,
      value2: feeConvString,
      horizontal: true,
    });
  }

  if (amount !== total_amount) {
    const totalLabel = labelConfig.totalLabel;
    let totalValue = total_amount / 10 ** currency.divisibility;
    let totalString = '';
    let totalConvString = '';
    totalString = formatAmountString(totalValue, currency);
    if (convRate) {
      totalConvString =
        '~' + formatAmountString(totalValue * convRate, rates.displayCurrency);
    }
    items.push({
      id: 'total',
      label: totalLabel,
      value: totalString,
      value2: totalConvString,
      horizontal: true,
    });
  }

  if (subtype && subtype.match(/buy|sell/)) {
    const conversion = get(metadata, ['service_conversion', 'conversion']);
    if (conversion && conversion.rate) {
      const rateString = renderRate({
        toCurrency: conversion.to_currency,
        fromCurrency: conversion.from_currency,
        rate: conversion.rate,
      });
      items.push({
        id: 'rate',
        value: rateString,
        horizontal: true,
      });
    }
  }

  if (balance) {
    items.push('divider');
    let balanceString = '';
    let balanceValue = balance / 10 ** currency.divisibility;
    let balanceConvString = '';
    balanceString = formatAmountString(balanceValue, currency);
    if (convRate) {
      balanceConvString =
        '~' +
        formatAmountString(balanceValue * convRate, rates.displayCurrency);
    }
    items.push({
      id: 'balance',
      label: 'account_balance',
      value: balanceString,
      value2: balanceConvString,
      horizontal: true,
    });
  }

  if (metadata && metadata.send_context) {
    Object.keys(metadata.send_context).forEach(mKey => {
      items.push({
        id: 'metadata-' + mKey,
        label: metadata.send_context[mKey].label,
        value: metadata.send_context[mKey].value,
        horizontal: true,
      });
    });
  }

  function renderQuickActions() {
    let actions = get(
      QuickActionConfig({
        request: item,
        navigation,
        closeModal,
        currency,
        wallet: props?.currency,
        loading: loadingAction,
        setLoading: setLoadingAction,
        setLoadingSecondaryAction,
        setActionContentVisible,
        // services,
        rates,
        user: profile?.items ?? {},
        getTransactions,
        showToast,
      }),
      [subtype, 'actions'],
    );

    if (!actions) return null;

    try {
      actions = [...(actions?.[tx_type] ?? {}), ...(actions?.['both'] ?? {})];
    } catch (e) {}

    if (!actions.length) return null;

    return (
      <>
        <View fD={'row'} aI={'center'} style={{ flexWrap: 'wrap' }}>
          {actions
            .filter(x => x.type !== 'secondary')
            ?.map((x, index) => (
              <View mr={1} key={index}>
                <Button
                  type={'outlined'}
                  id={x.label}
                  size={'tiny'}
                  buttonStyle={{ padding: 4, minWidth: 80 }}
                  onPress={x.onPress}
                  disabled={Boolean(loadingAction)}
                  loading={x.id && loadingAction === x.id}
                />
                {x.renderedOutput &&
                  x.renderedOutput({ visible: actionContentVisible === x.id })}
              </View>
            ))}
        </View>
        {actions
          .filter(x => !x.hidden && x.type === 'secondary')
          ?.map((x, index) => (
            <Button
              key={index}
              type={x.variant ?? 'outlined'}
              label={x.label}
              size={'tiny'}
              buttonStyle={{ padding: 4, minWidth: 80 }}
              onPress={x.onPress}
              disabled={Boolean(loadingSecondaryAction)}
              loading={loadingSecondaryAction === x?.id}
              wide
            />
          ))}
      </>
    );
  }

  return (
    <React.Fragment>
      {recipientDetails && (
        <>
          <View
            bC={'#044494'}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
            }}
            ph={0.125}
            mv={0.5}
            pv={1}>
            <Text style={{ color: '#ffffff' }} s={20}>
              {subtype == 'send_mobile'
                ? 'Sent to'
                : subtype === 'receive_mobile'
                ? 'Received From'
                : 'Requested From'}
            </Text>
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            ph={0.125}
            pv={0.5}>
            <Text o={0.87} s={16}>
              {formatTime(created, 'MMMM Do YYYY, h:mm:ss a', profile)}
            </Text>
          </View>

          <View mt={2} mb={1}>
            <TouchableOpacity onPress={() => setModal(true)}>
              <SendRecipient user={item.partner?.user} />
            </TouchableOpacity>
          </View>
        </>
      )}
      {renderQuickActions()}
      {hasReward &&
        (loading ? (
          <Spinner />
        ) : error ? (
          <ErrorOutput>{error}</ErrorOutput>
        ) : (
          <CampaignCard
            item={reward}
            altStyle
            onPress={() => {
              // hideModal;
              // navigation.navigate('Rewards', {
              //   initialTab: 'Earned',
              //   id: get(metadata, ['service_reward', 'reward_id']),
              // });
            }}
          />
        ))}
      <View w={'100%'} ph={0.125} style={{ paddingBottom: 32 }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
          }}
          ph={0.125}
          mv={0.5}
          pv={1}>
          <Text s={30} fW={'700'}>
            {amountString}
          </Text>
          <Text>{amountConvString}</Text>
        </View>
        <View>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#434343',
              color: '#000000',
              borderRadius: 5,
              padding: 10,
              paddingTop: 20,
              paddingBottom: 20,
              marginTop: 20,
            }}
            editable={false}
            value={note ?? description}
          />
        </View>
        <View
          mt={3}
          style={{
            alignItems: 'center',
          }}>
          <Button label={' Share Receipt '} />
        </View>
        {/* <OutputList items={items} /> */}

        {/* <TransactionListCryptoDetails item={item} /> */}
      </View>
      {!!modal && (
        <ModalFullscreen
          visible={modal}
          scrollView
          iconTitleRight={'close'}
          onPressTitleRight={() => setModal(false)}
          onDismiss={() => setModal(false)}>
          <ReceiptInfoPage
            onDismiss={() => {
              setModal(false);
              closeModal();
            }}
            close={() => setModal(false)}
            setItem={setItem}
            user={item.partner?.user}
            navigation={navigation}
            profile={profile}
            getTransactions={getTransactions}
            nav={nav}
            c={c}
            rates={rates}
            crypto={crypto}
          />
        </ModalFullscreen>
      )}
    </React.Fragment>
  );
}
