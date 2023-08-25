import { get } from 'lodash';

function ellipseConcat(string1, string2) {
  if (!string2) {
    string2 = string1;
  }
  const string2length = string2.length;
  return (
    string1.substring(0, 4) +
    '...' +
    string2.substring(string2length - 4, string2length)
  );
}

const identifierFunc = (item, type = 'email', debit) => {
  if (item.first_name) {
    return item.first_name + ' ' + item.last_name;
  }
  switch (type) {
    case 'distribution':
      return item?.account_name;
    case 'purchase':
      return item?.business?.name ?? item?.name ?? '';

    case 'fiat':
      const account = item?.account ?? item;
      const accNumLength = account?.number?.length ?? 0;
      const string =
        account.name +
        (account?.number?.length
          ? '...' + account?.number?.substring(accNumLength - 4, accNumLength)
          : '');
      return string;
    case 'crypto':
      const address =
        (item.address
          ? item.address
          : debit
          ? item.recipient_public_address
            ? item.recipient_public_address
            : item.native_context?.send_details?.destination
          : item.sender_public_address) ?? item?.identifier;
      return address ? ellipseConcat(address) : '';
    case 'email':
    case 'mobile':
    default:
      return item?.identifier ?? item?.email ?? '';
  }
};

const en = {
  exchanged: 'Exchanged',
  exchange_pending: 'Pending exchange of',
  exchange_failed: 'Failed to exchange',
  for: 'for',
  bought: 'Bought',
  buy_pending: 'Pending buy of',
  buy_failed: 'Failed to buy',
  with: 'with',
  sold: 'Sold',
  sell_pending: 'Pending sell of',
  sell_failed: 'Failed to sell',
  purchase_complete: 'Made a purchase',
  purchase_pending: 'Pending purchase',
  purchase_failed: 'Failed purchase',
  purchase_app_complete: 'Made an in-app purchase',
  purchase_app_pending: 'Pending in-app purchase',
  purchase_app_failed: 'Failed in-app purchase',
  purchase_pos_complete: 'Made an in-store purchase',
  purchase_pos_pending: 'Pending in-store purchase',
  purchase_pos_failed: 'Failed in-store purchase',
  sale_complete: 'Made a sale',
  sale_pending: 'Pending sale',
  sale_failed: 'Failed sale',
  sale_app_complete: 'Made an in-app sale',
  sale_app_pending: 'Pending in-app sale',
  sale_app_failed: 'Failed in-app sale',
  sale_pos_complete: 'Made an in-store sale',
  sale_pos_pending: 'Pending in-store sale',
  sale_pos_failed: 'Failed in-store sale',
  fund_complete: 'Funded account',
  fund_pending: 'Pending fund',
  fund_failed: 'Failed to fund',
  deposit_complete: 'Made a deposit',
  deposit_pending: 'Pending deposit',
  deposit_failed: 'Failed deposit',
  deposit_manual_complete: 'Made a deposit',
  deposit_manual_pending: 'Pending deposit',
  deposit_manual_failed: 'Failed deposit',
  deposit_ach_complete: 'Made an ACH deposit',
  deposit_ach_pending: 'Pending ACH deposit',
  deposit_ach_failed: 'Failed ACH deposit',
  reward_credit_successful: 'Received a reward',
  reward_debit_successful: 'A reward was claimed',
  reward_pending: 'Pending reward',
  reward_failed: 'Failed reward',
  withdraw_successful: 'Withdrawal to ',
  withdraw_pending: 'Pending withdrawal to ',
  withdraw_failed: 'Failed withdrawal to ',
  withdraw_manual_successful: 'Withdrawal to ',
  withdraw_manual_pending: 'Pending withdrawal to ',
  withdraw_manual_failed: 'Failed withdrawal to ',
  hotwallet_deposit_successful: 'Issued initial supply',
  hotwallet_deposit_pending: 'Pending initial supply issue',
  hotwallet_deposit_failed: 'Failed to issue initial supply',
  hotwallet_withdraw_successful: 'Withdrawal from hotwallet',
  hotwallet_withdraw_pending: 'Pending withdrawal from hotwallet',
  hotwallet_withdraw_failed: 'Failed withdrawal from hotwallet',
  receive_successful: 'Received from',
  receive_pending: 'Pending payment from',
  receive_failed: 'Failed receiving from',
  send_successful: 'Sent to',
  send_pending: 'Pending payment to',
  send_failed: 'Failed sending to',
  fee_credit_successful: 'Fee payment',
  fee_credit_pending: 'Pending fee payment',
  fee_credit_failed: 'Failed fee payment',
  fee_debit_successful: 'Fee charged',
  fee_debit_pending: 'Pending fee',
  fee_debit_failed: 'Fee failed',
  fee_received_successful: 'Fee payment',
  fee_received_pending: 'Pending fee payment',
  fee_received_failed: 'Failed fee payment',
  fee_charged_successful: 'Fee charged',
  fee_charged_pending: 'Pending fee',
  fee_charged_failed: 'Fee failed',
  transfer_debit_successful: 'Transfer to',
  transfer_debit_pending: 'Pending transfer to',
  transfer_debit_failed: 'Failed transfer to',
  transfer_credit_successful: 'Transfer from',
  transfer_credit_pending: 'Pending transfer from',
  transfer_credit_failed: 'Failed transfer from',
  tip_credit_successful: 'Received tip',
  tip_credit_pending: 'Pending tip receieve',
  tip_credit_failed: 'Failed receiving tip',
  tip_debit_successful: 'Paid tip',
  tip_debit_pending: 'Pending tip payment',
  tip_debit_failed: 'Failed tip payment',
  deposit_voucher_successful: 'Added funds using a voucher',
  deposit_voucher_pending: 'Pending funding by voucher',
  deposit_voucher_failed: 'Failed adding funds using a voucher',
  request_credit_successful: 'Received from request to',
  request_credit_pending: 'Request to',
  request_credit_failed: 'Cancelled request to',
  request_debit_successful: 'Paid request from',
  request_debit_pending: 'Request from',
  request_debit_failed: 'Declined request from',
  sell_credit_successful: 'Sold credit to',
  sell_credit_pending: 'Pending credit sell to',
  sell_credit_failed: 'Failed selling credit to',
  buy_credit_successful: 'Bought credit from',
  buy_credit_pending: 'Pending credit buy from',
  buy_credit_failed: 'Failed buying credit from',
  top_up_credit_successful: 'Top up from',
  top_up_credit_pending: 'Pending top up from',
  top_up_credit_failed: 'Failed top up from',
  top_up_debit_successful: 'Top up to',
  top_up_debit_pending: 'Pending top up to',
  top_up_debit_failed: 'Failed top up to',
  donate_credit_successful: 'Donation from',
  donate_credit_pending: 'Pending donation from',
  donate_credit_failed: 'Failed donation from',
  donate_debit_successful: 'Donation to',
  donate_debit_pending: 'Pending donation to',
  donate_debit_failed: 'Failed donation to',
  deposit_teller_successful: 'Loaded money at teller',
  deposit_teller_pending: 'Pending loading money at teller',
  deposit_teller_failed: 'Failed loading money at teller',
  withdraw_teller_successful: 'Loaded balance for',
  withdraw_teller_pending: 'Pending loading balance for',
  withdraw_teller_failed: 'Failed loading balance for',
  send_refund_successful: 'Sent refund',
  send_refund_pending: 'Pending refund send',
  send_refund_failed: 'Failed refund send',
  receive_refund_successful: 'Recieved refund',
  receive_refund_pending: 'Pending refund receive',
  receive_refund_failed: 'Failed refund receive',
  receive_distribution_successful: 'Received distribution',
  receive_distribution_pending: 'Pending distribution receive',
  receive_distribution_failed: 'Failed distribution receive',
  purchase_bitrefill_successful: 'Made a Bitrefill purchase',
  purchase_bitrefill_pending: 'Pending Bitrefill purchase',
  purchase_bitrefill_failed: 'Error making a Bitrefill purchase',
  send_otp_successful: 'OTP payment',
  send_otp_pending: 'Pending OTP payment',
  send_otp_failed: 'Failed OTP payment',
};

function exchangeIdentifier(item) {
  const key = get(item, ['service_conversion', 'conversion', 'key']);
  return key
    ? ' ' + key.split(':')[0] + ' ' + en.for + ' ' + key.split(':')[1]
    : '';
}

const SubtypeCopy = {
  buy: {
    both: {
      credit: {
        Complete: en.exchanged,
        Pending: en.exchange_pending,
        Failed: en.exchange_failed,
        identifier: item => exchangeIdentifier(item),
      },
    },
    icon: 'exchange',
  },
  buy_quick: {
    both: {
      credit: {
        Complete: en.bought,
        Pending: en.buy_pending,
        Failed: en.buy_failed,
        identifier: item => exchangeIdentifier(item),
      },
    },
    icon: 'exchange',
  },
  sell: {
    both: {
      debit: {
        Complete: en.exchanged,
        Pending: en.exchange_pending,
        Failed: en.exchange_failed,
        identifier: item => exchangeIdentifier(item),
      },
    },
    icon: 'exchange',
  },
  sell_quick: {
    both: {
      debit: {
        Complete: en.sold,
        Pending: en.sell_pending,
        Failed: en.sell_failed,
        identifier: item => exchangeIdentifier(item),
      },
    },
    icon: 'exchange',
  },
  purchase: {
    both: {
      debit: {
        Complete: en.purchase_complete,
        Pending: en.purchase_pending,
        Failed: en.purchase_failed,
      },
    },
    icon: 'product',
  },
  purchase_app: {
    both: {
      debit: {
        Complete: en.purchase_app_complete,
        Pending: en.purchase_app_pending,
        Failed: en.purchase_app_failed,
      },
    },
    icon: 'product',
  },
  purchase_pos: {
    both: {
      debit: {
        Complete: en.purchase_pos_complete,
        Pending: en.purchase_pos_pending,
        Failed: en.purchase_pos_failed,
      },
    },
    icon: 'product',
  },
  sale: {
    both: {
      credit: {
        Complete: en.sale_complete,
        Pending: en.sale_pending,
        Failed: en.sale_failed,
      },
    },
    icon: 'product',
  },
  sale_app: {
    both: {
      credit: {
        Complete: en.sale_app_complete,
        Pending: en.sale_app_pending,
        Failed: en.sale_app_failed,
        identifier: item => ' to ' + identifierFunc(item),
      },
    },
    icon: 'product',
  },
  sale_pos: {
    both: {
      credit: {
        Complete: en.sale_pos_complete,
        Pending: en.sale_pos_pending,
        Failed: en.sale_pos_failed,
        identifier: item => ' to ' + identifierFunc(item),
      },
    },
    icon: 'product',
  },
  fund: {
    both: {
      credit: {
        Complete: en.fund_complete,
        Pending: en.fund_pending,
        Failed: en.fund_failed,
      },
    },
    icon: 'fund',
  },
  deposit_stripe: {
    both: {
      credit: {
        Complete: en.fund_complete,
        Pending: en.fund_pending,
        Failed: en.fund_failed,
      },
    },
    icon: 'fund',
  },
  deposit: {
    both: {
      credit: {
        Complete: en.deposit_complete,
        Pending: en.deposit_pending,
        Failed: en.deposit_failed,
      },
    },
  },
  deposit_manual: {
    both: {
      credit: {
        Complete: en.deposit_complete,
        Pending: en.deposit_pending,
        Failed: en.deposit_failed,
      },
    },
  },
  deposit_crypto: {
    both: {
      credit: {
        Complete: en.deposit_complete,
        Pending: en.deposit_pending,
        Failed: en.deposit_failed,
        // identifier: item => ' ' + identifierFunc(item, 'crypto', false),
      },
    },
  },
  reward: {
    both: {
      credit: {
        Complete: en.reward_credit_successful,
        Pending: en.reward_pending,
        Failed: en.reward_failed,
      },
      debit: {
        Complete: en.reward_debit_successful,
        Pending: en.reward_pending,
        Failed: en.reward_failed,
      },
    },
    icon: 'reward',
  },
  receive_reward: {
    both: {
      credit: {
        Complete: en.reward_credit_successful,
        Pending: en.reward_pending,
        Failed: en.reward_failed,
      },
    },
    icon: 'reward',
  },
  send_reward: {
    both: {
      debit: {
        Complete: en.reward_debit_successful,
        Pending: en.reward_pending,
        Failed: en.reward_failed,
      },
    },
    icon: 'reward',
  },
  withdraw: {
    fiat: {
      debit: {
        Complete: en.withdraw_successful,
        Pending: en.withdraw_pending,
        Failed: en.withdraw_failed,
        identifier: item => ' ' + identifierFunc(item, 'fiat', false),
      },
    },
  },
  withdraw_manual: {
    fiat: {
      debit: {
        Complete: en.withdraw_successful,
        Pending: en.withdraw_pending,
        Failed: en.withdraw_failed,
        identifier: item => ' ' + identifierFunc(item, 'fiat', false),
      },
    },
  },
  withdraw_crypto: {
    both: {
      debit: {
        Complete: en.withdraw_successful,
        Pending: en.withdraw_pending,
        Failed: en.withdraw_failed,
        identifier: item => ' ' + identifierFunc(item, 'crypto', false),
      },
    },
  },
  hotwallet_deposit: {
    both: {
      credit: {
        Complete: en.hotwallet_deposit_successful,
        Pending: en.hotwallet_deposit_pending,
        Failed: en.hotwallet_deposit_failed,
      },
    },
  },
  hotwallet_withdraw: {
    both: {
      debit: {
        Complete: en.hotwallet_withdraw_successful,
        Pending: en.hotwallet_withdraw_pending,
        Failed: en.hotwallet_withdraw_failed,
      },
    },
  },
  receive: {
    both: {
      credit: {
        Complete: en.receive_successful,
        Pending: en.receive_pending,
        Failed: en.receive_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  receive_crypto: {
    both: {
      credit: {
        Complete: en.receive_successful,
        Pending: en.receive_pending,
        Failed: en.receive_failed,
        identifier: item => ' ' + identifierFunc(item, 'crypto', true),
      },
    },
  },
  receive_email: {
    both: {
      credit: {
        Complete: en.receive_successful,
        Pending: en.receive_pending,
        Failed: en.receive_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  receive_mobile: {
    both: {
      credit: {
        Complete: en.receive_successful,
        Pending: en.receive_pending,
        Failed: en.receive_failed,
        identifier: item => ' ' + identifierFunc(item, 'mobile'),
      },
    },
  },
  receive_mass: {
    both: {
      credit: {
        Complete: en.receive_successful,
        Pending: en.receive_pending,
        Failed: en.receive_failed,
        identifier: item => ' ' + identifierFunc(item),
      },
    },
  },
  receive_distribution: {
    both: {
      credit: {
        Complete: en.receive_distribution_successful,
        Pending: en.receive_distribution_pending,
        Failed: en.receive_distribution_failed,
        // identifier: item => ' ' + identifierFunc(item, 'distribution'),
      },
    },
  },
  request: {
    both: {
      credit: {
        Complete: en.request_successful,
        Pending: en.request_pending,
        Failed: en.request_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
      debit: {
        Complete: en.request_successful,
        Pending: en.request_pending,
        Failed: en.request_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  send: {
    both: {
      debit: {
        Complete: en.send_successful,
        Pending: en.send_pending,
        Failed: en.send_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  send_otp: {
    both: {
      debit: {
        Complete: en.send_otp_successful,
        Pending: en.send_otp_pending,
        Failed: en.send_otp_failed,
        identifier: item => '',
      },
    },
  },
  deposit_teller: {
    both: {
      credit: {
        Complete: en.deposit_teller_successful,
        Pending: en.deposit_teller_pending,
        Failed: en.deposit_teller_failed,
        // identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  withdraw_teller: {
    both: {
      debit: {
        Complete: en.withdraw_teller_successful,
        Pending: en.withdraw_teller_pending,
        Failed: en.withdraw_teller_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  top_up: {
    both: {
      debit: {
        Complete: en.top_up_debit_successful,
        Pending: en.top_up_debit_pending,
        Failed: en.top_up_debit_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
      credit: {
        Complete: en.top_up_credit_successful,
        Pending: en.top_up_credit_pending,
        Failed: en.top_up_credit_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  donate: {
    both: {
      debit: {
        Complete: en.donate_debit_successful,
        Pending: en.donate_debit_pending,
        Failed: en.donate_debit_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
      credit: {
        Complete: en.donate_credit_successful,
        Pending: en.donate_credit_pending,
        Failed: en.donate_credit_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  // buy_credit: {
  //   both: {
  //     credit: {
  //       Complete: en.buy_credit_successful,
  //       Pending: en.buy_credit_pending,
  //       Failed: en.buy_credit_failed,
  //       identifier: item => ' ' + identifierFunc(item, 'email'),
  //     },
  //   },
  // },
  send_crypto: {
    both: {
      debit: {
        Complete: en.send_successful,
        Pending: en.send_pending,
        Failed: en.send_failed,
        identifier: item => ' ' + identifierFunc(item, 'crypto', true),
      },
    },
  },
  send_email: {
    both: {
      debit: {
        Complete: en.send_successful,
        Pending: en.send_pending,
        Failed: en.send_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
    },
  },
  send_refund: {
    both: {
      debit: {
        Complete: en.send_refund_successful,
        Pending: en.send_refund_pending,
        Failed: en.send_refund_failed,
      },
    },
  },
  receive_refund: {
    both: {
      debit: {
        Complete: en.receive_refund_successful,
        Pending: en.receive_refund_pending,
        Failed: en.receive_refund_failed,
      },
    },
  },
  send_mobile: {
    both: {
      debit: {
        Complete: en.send_successful,
        Pending: en.send_pending,
        Failed: en.send_failed,
        identifier: item => ' ' + identifierFunc(item, 'mobile'),
      },
    },
  },
  send_mass: {
    both: {
      debit: {
        Complete: en.send_successful,
        Pending: en.send_pending,
        Failed: en.send_failed,
        identifier: item => ' ' + identifierFunc(item),
      },
    },
  },
  fee: {
    both: {
      debit: {
        Complete: en.fee_debit_successful,
        Pending: en.fee_debit_pending,
        Failed: en.fee_debit_failed,
      },
      credit: {
        Complete: en.fee_credit_successful,
        Pending: en.fee_credit_pending,
        Failed: en.fee_credit_failed,
      },
    },
  },
  fee_received: {
    both: {
      credit: {
        Complete: en.fee_credit_successful,
        Pending: en.fee_credit_pending,
        Failed: en.fee_credit_failed,
      },
    },
  },
  fee_charged: {
    both: {
      debit: {
        Complete: en.fee_debit_successful,
        Pending: en.fee_debit_pending,
        Failed: en.fee_debit_failed,
      },
    },
  },
  transfer: {
    both: {
      debit: {
        Complete: en.transfer_debit_successful,
        Pending: en.transfer_debit_pending,
        Failed: en.transfer_debit_failed,
        identifier: item =>
          ' ' + get(item, ['rehive_context', 'credit_account']),
      },
      credit: {
        Complete: en.transfer_credit_successful,
        Pending: en.transfer_credit_pending,
        Failed: en.transfer_credit_failed,
        identifier: item =>
          ' ' + get(item, ['rehive_context', 'debit_account']),
      },
    },
  },
  receive_transfer: {
    both: {
      credit: {
        Complete: en.transfer_credit_successful,
        Pending: en.transfer_credit_pending,
        Failed: en.transfer_credit_failed,
        identifier: item =>
          ' ' + get(item, ['rehive_context', 'debit_account']),
      },
    },
  },
  send_transfer: {
    both: {
      debit: {
        Complete: en.transfer_debit_successful,
        Pending: en.transfer_debit_pending,
        Failed: en.transfer_debit_failed,
        identifier: item =>
          ' ' + get(item, ['rehive_context', 'credit_account']),
      },
    },
  },
  tip: {
    both: {
      debit: {
        Complete: en.tip_debit_successful,
        Pending: en.tip_debit_pending,
        Failed: en.tip_debit_failed,
        identifier: item => ' to ' + identifierFunc(item),
      },
      credit: {
        Complete: en.tip_credit_successful,
        Pending: en.tip_credit_pending,
        Failed: en.tip_credit_failed,
        identifier: item => ' from ' + identifierFunc(item),
      },
    },
  },
  request: {
    both: {
      credit: {
        Complete: en.request_credit_successful,
        Pending: en.request_credit_pending,
        Failed: en.request_credit_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
      debit: {
        Complete: en.request_debit_successful,
        Pending: en.request_debit_pending,
        Failed: en.request_debit_failed,
        identifier: item => ' ' + identifierFunc(item, 'email'),
      },
      // neutral: {
      //   Complete: en.request_credit_successful,
      //   Pending: en.request_credit_pending,
      //   Failed: en.request_credit_failed,
      //   identifier: item => ' ' + identifierFunc(item, 'email'),
      // },
    },
  },
  purchase_bitrefill: {
    both: {
      debit: {
        Complete: en.purchase_bitrefill_successful,
        Pending: en.purchase_bitrefill_pending,
        Failed: en.purchase_bitrefill_failed,
      },
    },
  },
  deposit_ach: {
    both: {
      credit: {
        Complete: en.deposit_ach_complete,
        Pending: en.deposit_ach_pending,
        Failed: en.deposit_ach_failed,
        identifier: item => {
          const name = item?.service_wyre?.payment_method?.name;
          return name ? ' from ' + name : '';
        },
      },
    },
  },
  deposit_fiat: {
    both: {
      credit: {
        Complete: en.deposit_complete,
        Pending: en.deposit_pending,
        Failed: en.deposit_failed,
      },
    },
  },
  default: {
    both: {
      credit: {
        Complete: en.receive_successful,
        Pending: en.receive_pending,
        Failed: en.receive_failed,
        label: 'Sender',
        identifier: item => identifierFunc(item),
      },
      debit: {
        Complete: en.send_successful,
        Pending: en.send_pending,
        Failed: en.send_failed,
        label: 'Recipient',
        identifier: item => identifierFunc(item),
      },
    },
  },
};

export default SubtypeCopy;
