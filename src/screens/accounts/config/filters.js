import { uniqBy } from 'lodash';

export function transactionFilterConfig({ subtypes }) {
  return {
    subtype: {
      variant: 'selector',
      options: uniqBy(
        subtypes?.map(item => ({ ...item, value: item?.name })),
        i => i?.name,
      ) ?? [
        { value: 'send', label: 'send' },
        { value: 'receive', label: 'receive' },
        { value: 'purchase', label: 'purchase' },
        { value: 'sale', label: 'sale' },
        { value: 'reward', label: 'reward' },
      ],
    },
    tx_type: {
      title: 'type',
      variant: 'select',
      options: [
        { value: 'credit', label: 'credit' },
        { value: 'debit', label: 'debit' },
      ],
    },
    status: {
      variant: 'select',
      options: [
        { value: 'Pending', label: 'pending' },
        { value: 'Complete', label: 'complete' },
        { value: 'Failed', label: 'failed' },
      ],
    },
    date: {
      variant: 'date',
      options: [
        // { value: 'last', label: 'Is in the last' },
        { value: 'equal', label: 'date_equal' },
        { value: 'between', label: 'date_between' },
        { value: 'less', label: 'date_before' },
        { value: 'more', label: 'date_between' },
      ],
    },
    amount: {
      variant: 'number',
      options: [
        { value: 'equal', label: 'amount_equal' },
        { value: 'between', label: 'amount_between' },
        { value: 'less', label: 'amount_less' },
        { value: 'more', label: 'amount_more' },
      ],
    },
    account: {
      variant: 'text',
    },
    reference: {
      variant: 'text',
    },
  };
}
