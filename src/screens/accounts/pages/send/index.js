import React from 'react';
import sendMachine from './sendMachine';
import { View } from 'components';
import SendHeader from './SendHeader';
import SendDetails from './SendDetails';
import SendPending from './SendPending';
import Big from 'big.js';
import {
  createCryptoTransfer,
  createTransfer,
  createDebit,
} from 'utility/rehive';
import { getRecipientType } from '../../util/validation';
import AccountFlow from '../../components/AccountFlow';
import { useRehiveContext } from 'contexts/RehiveContext';
import { getUserGroup } from 'utility/general';
import { checkWyreService } from 'extensions/wyre/util';

async function handleSubmit(props) {
  const { form, wallet, setSubmitting, context } = props;

  const currency = wallet;
  let {
    amount,
    recipient,
    note,
    memo,
    type: recipientType,
    id,
    metadata,
  } = form.getValues();

  const hasWyreService = checkWyreService(context?.services ?? {});
  setSubmitting(true);
  let response;
  amount = new Big(amount);
  amount = parseInt(amount * 10 ** currency.currency.divisibility);
  if (recipientType === 'mobile' && !recipient.includes('+'))
    recipient = '+' + recipient;

  if (hasWyreService && recipientType === 'crypto') {
    const sendMetadata = {
      send_details: {
        destination: recipient,
        metadata: { memo },
      },
    };
    let data = {
      amount,
      reference: recipient,
      currency: currency.currency.code,
      account: currency?.account,
      note,
      subtype: 'send_crypto',
      metadata: {
        native_context: {
          send_details: {
            destination: recipient,
            metadata: {
              native_context: sendMetadata,
              rehive_context: sendMetadata,
            },
          },
        },
        ...(metadata ? { send_context: metadata } : {}),
      },
    };
    response = await createDebit(data);
  } else {
    let data = {
      amount,
      to_reference: recipient,
      currency: currency.currency.code,
      debit_account: currency?.account,
      crypto: currency.crypto,
      credit_note: note,
      debit_note: note,
      debit_subtype: 'send_' + recipientType,
      credit_subtype: 'receive_' + recipientType,
    };
    if (metadata) {
      data['debit_metadata'] = {
        send_context: metadata,
      };
      data['credit_metadata'] = {
        send_context: metadata,
      };
    }
    switch (currency.crypto) {
      case 'XLM':
      case 'TXLM':
        data['memo'] = memo;

      // case 'ETH':
      // case 'TETH':
      case 'XBT':
      case 'TXBT':
        if (recipientType === 'crypto') {
          response = await createCryptoTransfer(data);
          break;
        }

      default:
        if (recipientType === 'account') {
          data.credit_account = recipient;
        } else {
          data['recipient'] = recipient;
          data['reference'] = recipient;
          delete data.to_reference;
        }
        if (id) data.credit_reference = id;
        response = await createTransfer(data);
        break;
    }
  }
  return response;
}

function useAccountFlow(props) {
  const {
    currency: initialCurrency = '',
    memo,
    amount = '',
    recipient = '',
    asset_code,
    accountRef,
  } = props?.route?.params ?? {};

  const {
    context: { user },
    config: { actionsConfig },
  } = useRehiveContext();
  const actionConfig = actionsConfig?.send;

  let configs = {
    amount: { scan: true },
    recipient: {
      actionLabel: 'send_to',
      title: 'send_recipient_title',
      types: ['email', 'mobile', 'crypto', 'account'],
      help: {
        items: [
          {
            id: 'mobile',
            title: 'send_to_mobile',
            description: 'send_to_mobile_description',
          },
          {
            id: 0,
            title: 'what_is_a_memo',
            condition: ({ context }) =>
              context?.wallet?.crypto?.includes('XLM'),
            description: 'what_is_a_memo_desciption',
          },
          {
            id: 1,
            title: 'what_is_a_federation_address',
            condition: ({ context }) =>
              context?.wallet?.crypto?.includes('XLM'),
            description: 'what_is_a_federation_address_description',
          },
          {
            id: 2,
            title: 'how_do_on_chain_transactions_work',
            condition: ({ context }) =>
              context?.wallet?.crypto?.includes('XLM'),
            description: 'how_do_on_chain_transactions_work_description',
          },
        ],
      },
    },
    pending: { component: SendPending },
    note: {},
    post: { title: 'send', header: SendHeader, detail: SendDetails },
  };

  // let machine = {};
  let machine = JSON.parse(JSON.stringify(sendMachine));
  const userGroup = getUserGroup(user);
  const noteGroups = actionConfig?.config?.note?.groups ?? [];
  const metadataConfigs = actionConfig?.config?.metadata ?? [];
  let hideNote = noteGroups?.length > 0 && !noteGroups?.includes(userGroup);
  if (hideNote) {
    machine.states.recipient.on.NEXT = 'confirm';
    machine.states.confirm.on.BACK = 'recipient';
  }
  let showMetadata = false;

  metadataConfigs.forEach(item => {
    if (item?.groups?.includes(userGroup)) {
      showMetadata = true;
    }
  });
  if (showMetadata) {
    const previousState = hideNote ? 'recipient' : 'note';
    machine.states[previousState].on.NEXT = 'metadata';
    machine.states.metadata.on.BACK = previousState;
    machine.states.confirm.on.BACK = 'metadata';
    configs = { ...configs, metadata: { fields: metadataConfigs } };
  }
  if (recipient?.length > 0) {
    machine.states.note.on.BACK = 'amount';
    machine.states.amount.on.NEXT = 'note';
    machine.states.amount.on.BACK = 'recipient';
    machine.states.recipient.on.NEXT = 'amount';
    machine.states.recipient.on.BACK = null;
    machine.id = 'send_recipient';
  }

  return {
    id: 'send',
    onSubmit: handleSubmit,
    machine,
    subtypes: ['send_crypto', 'send_email', 'send_mobile'],
    defaultValues: {
      amount,
      type: getRecipientType(recipient, initialCurrency),
      recipient,
      currencyCode: asset_code ?? initialCurrency?.currency?.code,
      accountRef: accountRef ?? initialCurrency?.account,
      memoSkip: '',
      stellarTransactionType: 'public',
      pinVisible: false,
      memo,
    },
    configs,
  };
}

export default function SendPage(props) {
  const config = useAccountFlow(props);

  return (
    <View screen>
      <AccountFlow {...props} config={config} />
    </View>
  );
}

// const accountItems = objectToArray(wallets?.accounts);
// let accountItem =
//   wallets?.accounts?.[accountRef] ??
//   wallets?.accounts?.[wallets?.primaryAccount];

// let restrictedCurrencies =
//   accountsConfig.hideCurrencies &&
//   accountsConfig.hideCurrencies.find(x =>
//     tier?.items?.map(y => y?.level).includes(x?.tier),
//   );

// restrictedCurrencies = restrictedCurrencies?.currencies ?? [];

// const filteredWallets = objectToArray(accountItem?.currencies).filter(
//   item =>
//     !hideCurrency.includes(item?.currency?.code) &&
//     !restrictedCurrencies.includes(item?.currency?.code),
// );
