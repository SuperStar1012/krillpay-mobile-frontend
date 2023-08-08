import { concatCryptoAccount } from 'utility/general';
import { statusText } from '../../util';
import { EMPTY_BANK_ACCOUNT } from 'config/empty';

import { difference } from 'lodash';
import {
  updateItem,
  addBankAccountCurrency,
  deleteBankAccountCurrency,
  getBankAccounts,
  deleteItem,
} from 'utility/rehive';
import { checkWyreService } from 'extensions/wyre/util';

function mapFields(item, inputs) {
  let fields = Object.keys(item).map(key => inputs?.[key]);
  fields = fields.filter(item => item);
  return fields;
}

function mapDefaultValues(values) {
  const { currencies = [] } = values;
  return {
    ...values,
    currencies: currencies.map(item => item?.code),
  };
}

export const formConfig = props => {
  const { bank = {}, locales } = props?.reduxContext?.settingsConfig ?? {};
  const { hideFields = [] } = bank;

  let fields = [
    'account_name',
    'account_number',
    'type',
    'bank_name',
    'bank_code',
    'branch_code',
    'bic',
    'swift',
    'iban',
  ];

  fields = fields.filter(item => hideFields.indexOf(item) === -1);

  const sections = [
    { id: 'currencies', fields: ['currencies'] },
    {
      id: 'account',
      title: 'Account info',
      fields,
    },

    {
      id: 'address',
      title: 'Address',
      fields: [
        'line_1',
        'line_2',
        'city',
        'state_province',
        'country',
        'postal_code',
        // 'state',
      ],
    },
  ];
  return {
    defaultValues: EMPTY_BANK_ACCOUNT,
    submitLabel: 'SAVE',
    actions: true,
    mapDefaultValues,
    // inputComponents: Inputs,
    onSubmit: createData,
    sections,
    locales,
    title: 'bank_account',
  };
};

async function createData(values, control, props) {
  const { itemId, onSuccess, showToast } = props;
  const { setSubmitting, setError } = control;
  if (!values?.currencies?.length > 0) {
    setError('currencies', {
      type: 'manual',
      message: 'Please include account currency',
    });
  } else {
    if (typeof setSubmitting === 'function') setSubmitting(true);
    const newCurrencies = values.currencies;
    let data = values;
    delete data.currencies;

    try {
      const resp = await updateItem('bankAccounts', data, itemId);
      const oldCurrencies = resp.currencies.map(item => item.code);
      const toAdd = difference(newCurrencies, oldCurrencies);
      let i = 0;
      for (i = 0; i < toAdd.length; i++) {
        await addBankAccountCurrency(resp.id, toAdd[i]);
      }
      const toRemove = difference(oldCurrencies, newCurrencies);
      for (i = 0; i < toRemove.length; i++) {
        await deleteBankAccountCurrency(resp.id, toRemove[i]);
      }
      onSuccess(resp?.data?.id);
      showToast({ id: `bank_account_${itemId ? 'edit' : 'add'}_success` });
    } catch (e) {
      showToast({ id: `bank_account_${itemId ? 'edit' : 'add'}_error` });
    }

    if (typeof setSubmitting === 'function') setSubmitting(false);
  }
}

async function fetchData(cnt, event) {
  try {
    let resp = await getBankAccounts();
    if (resp.status === 'success') {
      return resp?.data;
    }
  } catch (e) {
    console.log('fetchData -> e', e);
  }
}

async function deleteData(props) {
  const { itemId, onSuccess, showToast, setSubmitting } = props;
  if (typeof setSubmitting === 'function') setSubmitting(true);
  // const { index, type, crypto } = this.state;
  // const data = this.props[type];
  // let id = '';
  // if (type === 'cryptoAccounts') {
  //   const filtered = data.items.filter(
  //     item => item.crypto_type === cryptoTypes[crypto].id,
  //   );
  //   id = safe(filtered[index], ['id'], '');
  // } else {
  //   id = safe(data.items[index], 'id', '');
  // }

  try {
    await deleteItem('bankAccounts', itemId);
    showToast({
      text: 'bank_account_delete_success',
    });
    onSuccess();
  } catch (error) {
    console.log(error);
    showToast({
      text: 'bank_account_delete_failed',
    });
  }
  if (typeof setSubmitting === 'function') setSubmitting(false);
}

export default {
  title: 'Crypto accounts',
  type: 'crypto_account',
  value: item => concatCryptoAccount(item),

  services: {
    fetchData,
    createData,
    deleteData,
  },
  // configs: {
  //   list: {
  //     value: item => concatBankAccount(item),
  //     label: item => item?.name ?? '',
  //     status: item => statusText(item),
  //     emptyListMessage: 'No crypto accounts added',
  //     title: 'bank_account',
  //     image: 'bank',
  //   },
  //   form: formConfig,
  // },
  configs: {
    list: {
      value: item => concatCryptoAccount(item),
      // label: item => item?.name ?? '',
      // label: (item, index) => 'Crypto account ' + (index + 1),
      status: item => statusText(item),
      emptyListMessage: 'No crypto accounts added',
      title: 'crypto_accounts',
      image: 'crypto',
      canDelete: true,
      filter: 'crypto_type',
    },
    form: formConfig,
    view: {
      title: 'crypto_account',
      image: 'crypto',
    },
    type: {
      title: 'choose_the_crypto_network',
      image: 'crypto',
      variant: 'select',
      options: context => {
        const { services } = context;
        let options = [];
        if (
          services?.['Stellar Testnet Service'] ||
          services?.['Stellar Service'] ||
          checkWyreService(services)
        )
          options.push('stellar');
        if (
          services?.['Bitcoin Testnet Service'] ||
          services?.['Bitcoin Service']
        )
          options.push('bitcoin');
        if (
          services?.['Ethereum Testnet Service'] ||
          services?.['Ethereum Service']
        )
          options.push('ethereum');

        return options;
      },
    },
  },
};
