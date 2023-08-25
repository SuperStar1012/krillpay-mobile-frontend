import React from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';

import { cryptoSelector } from '@redux/selectors';
import OutputList from 'components/outputs/OutputList';

function generateTxHashLink(tx_hash, type, testnet) {
  let link = 'https://';

  switch (type) {
    case 'bitcoin':
      link = link + 'live.blockcypher.com/btc' + (testnet ? '-testnet' : '');
      break;
    case 'stellar':
      link =
        link + 'stellar.expert/explorer/' + (testnet ? 'testnet' : 'public');
      break;
    default:
  }
  return link + '/tx/' + tx_hash + '/';
}
function generateRecipientLink(address, type, testnet) {
  let link = 'https://';

  switch (type) {
    case 'bitcoin':
      link =
        link +
        'live.blockcypher.com/btc' +
        (testnet ? '-testnet' : '') +
        '/address';
      break;
    case 'stellar':
      link =
        link +
        'stellar.expert/explorer/' +
        (testnet ? 'testnet' : 'public') +
        '/account';
      break;
    default:
  }
  return link + '/' + address + '/';
}

export default function TransactionListCryptoDetails(props) {
  const { item } = props;
  const { metadata, tx_type } = item;
  const crypto = useSelector(cryptoSelector);
  if (!metadata) return null;

  const { service_bitcoin, service_stellar, native_context } = metadata;
  let context = null;
  let type = '';

  if (service_bitcoin) {
    type = 'bitcoin';
    context = service_bitcoin;
  } else if (service_stellar) {
    type = 'stellar';
    context = service_stellar;
  } else if (native_context?.blockchain_details) {
    context = native_context?.blockchain_details;
    type = context?.chain;
  } else {
    return null;
  }

  const {
    network,
    confirmations,
    hash,
    tx_hash = hash,
    sender_public_address,
    recipient_public_address,
    to_address,
  } = context;

  const testnet = Boolean(network && network.match(/testnet/));
  const debit = Boolean(tx_type === 'debit');
  const recipient =
    to_address ?? (debit ? recipient_public_address : sender_public_address);
  const linkRecipient = generateRecipientLink(recipient, type, testnet);
  const linkTxHash = generateTxHashLink(tx_hash, type, testnet);

  let items = [
    {
      label: debit ? 'Recipient address' : 'Sender address',
      value: recipient,
      link: linkRecipient,
      valueColor: true,
    },
    {
      label: 'Transaction hash',
      value: tx_hash,
      link: linkTxHash,
      valueColor: true,
    },
  ];

  if (type === 'bitcoin' && confirmations) {
    const totalConfirmations = get(
      crypto,
      [
        network === 'testnet' ? 'TXBT' : 'XBT',
        'company',
        'company_configuration',
        'confirmations_to_confirm',
      ],
      '6',
    );
    items.push({
      label: 'Confirmations',
      value: confirmations + '/' + totalConfirmations,
      horizontal: true,
    });
  }
  return <OutputList items={items} />;
}
