import { get } from 'lodash';
import SubtypeCopyConfig from '../config/SubtypeCopy';
import { standardizeString } from 'utility/general';

export function getMainTransaction(transactions) {
  return get(transactions, 0);
}

export function filterTransactionCollections(collections, currency) {
  return collections.filter(
    collection =>
      collection.transactions.findIndex(
        transaction =>
          get(transaction, ['currency', 'code']) ===
          get(currency, ['currency', 'code']),
      ) !== -1,
  );
}

export function filterTransactions(transactions, currency) {
  return transactions.filter(
    transaction =>
      get(transaction, ['currency', 'code']) ===
      get(currency, ['currency', 'code']),
  );
}

export function useSubtypeCopy(transaction, crypto) {
  let { metadata, tx_type, subtype, status } = transaction;
  if (!subtype && metadata?.service_wyre)
    subtype = tx_type === 'credit' ? 'deposit_wyre' : 'withdraw_wyre';

  let identifier = {};
  switch (subtype) {
    case 'buy':
    case 'sell':
    case 'transfer':
    case 'send_transfer':
      identifier = metadata;
      break;
    case 'receive_distribution':
      identifier = transaction;
      break;
    case 'withdraw':
    case 'withdraw_crypto':
      identifier = get(transaction, ['metadata', 'rehive_context', 'account']);
      break;
    case 'purchase_pos':
      identifier = get(
        transaction,
        ['metadata', 'rehive_context'],
        get(transaction, ['partner', 'user']),
      );
      break;
    case 'receive':
    case 'send':
    case 'mass_send':
    default:
      identifier = get(transaction, ['partner', 'user']);

      if (!identifier) {
        identifier = get(transaction, ['metadata', 'rehive_context']);
      }
      if (!identifier) {
        identifier = get(transaction, ['metadata', 'service_stellar']);
      }
      if (!identifier) {
        identifier = get(transaction, ['metadata', 'service_bitcoin']);
      }
      if (!identifier) {
        identifier = metadata;
      }
  }

  const subtypeConfig = get(SubtypeCopyConfig, subtype, {});
  let typeConfig = {};
  if (subtypeConfig.both || (crypto && subtypeConfig.crypto)) {
    typeConfig = subtypeConfig.crypto
      ? subtypeConfig.crypto
      : get(subtypeConfig, 'both');
  } else if (subtypeConfig.fiat) {
    typeConfig = subtypeConfig.fiat;
  }
  let copyConfig = {};

  if (typeConfig.credit && tx_type.includes('credit')) {
    copyConfig = get(typeConfig, 'credit');
  } else if (typeConfig.debit && tx_type.includes('debit')) {
    copyConfig = get(typeConfig, 'debit');
  }

  let iconColor = '';
  let iconName = tx_type
    ? tx_type === 'credit'
      ? 'receive'
      : 'sent'
    : 'question';
  let color = tx_type === 'credit' ? 'positive' : 'negative';
  if (subtypeConfig && subtypeConfig.icon) {
    iconName = subtypeConfig.icon;
    iconColor = 'primary';
  }
  if (status === 'Pending') {
    iconName = 'pending';
    color = 'font';
    iconColor = 'grey2';
  } else if (status === 'Failed') {
    iconName = 'close';
    color = 'font';
    iconColor = 'grey2';
  }

  let text = get(
    SubtypeCopyConfig,
    ['default', 'both', tx_type, status],
    'Unknown transaction type',
  );

  let text2 = '';
  let recipient = '';
  let configStatus = copyConfig?.[status];

  text = configStatus ? configStatus : standardizeString(subtype);

  let image = null;
  if (identifier && copyConfig.identifier) {
    try {
      image = get(identifier, 'profile');
      recipient = copyConfig.identifier(identifier);

      const length = recipient.length;
      if (length > 30) {
        text2 =
          recipient.substring(0, 4) +
          '...' +
          recipient.substring(length - 8, length);
      } else {
        text2 = recipient;
      }
      // if (subtype && !subtype.match(/buy|sell/)) {
      //   text2 = (tx_type === 'credit' ? ' from ' : ' to ') + text2;
      // }
    } catch (e) {}
  }
  text = text + text2;

  return {
    text,
    color,
    iconName,
    iconColor,
    recipient,
    copyConfig,
    image,
  };
}

export function getTransactionDetails(transaction) {}
