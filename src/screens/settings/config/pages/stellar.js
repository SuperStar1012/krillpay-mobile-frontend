import {
  concatCryptoAccount,
  concatCryptoAccountNoName,
} from 'utility/general';
import { statusText } from 'screens/settings/util';
import { EMPTY_STELLAR_MAINNET, EMPTY_STELLAR_TESTNET } from 'config/empty';

import {
  updateItem,
  deleteItem,
  getStellarKnownPublicAddresses,
} from 'utility/rehive';
import FormList from 'screens/settings/components/FormList';

function mapDefaultValues(values) {
  const { name, address, metadata } = values;
  return {
    name,
    address,
    memo: metadata?.memo,
    stellarAddressType: address.includes('*') ? 'federation' : 'public',
    memoSkip: false,
  };
}

const formConfig = props => {
  const services = props?.reduxContext?.services;
  const knownPublicAddresses = props?.context?.results ?? [];

  let hasTestnetSelector = false;
  if (services['Stellar Service'] && services['Stellar Testnet Service']) {
    hasTestnetSelector = true;
  }
  const isMainnet =
    services['Stellar Service'] && !services['Stellar Testnet Service'];

  let fields = ['account_name'];

  fields.push({
    id: 'testnetSelector',
    condition: () => hasTestnetSelector,
  });
  fields.push('stellarAddressType');
  fields.push({
    id: 'stellarAddress',
    condition: ({ network, stellarAddressType }) => {
      return (
        (stellarAddressType === 'public' && network === 'mainnet') || isMainnet
      );
    },
  });
  fields.push({
    id: 'stellarTestnetAddress',
    condition: ({ network, stellarAddressType }) =>
      stellarAddressType === 'public' && network !== 'mainnet' && !isMainnet,
  });
  fields.push({
    id: 'stellarFederationAddress',
    condition: ({ stellarAddressType }) => stellarAddressType !== 'public',
  });
  fields.push({
    id: 'memoSkipAccount',
    condition: ({ stellarAddressType, address }) =>
      stellarAddressType === 'public' &&
      !(
        knownPublicAddresses?.find(item => item.public_address === address)
          ?.requires_memo ?? false
      ),
  });
  fields.push({
    id: 'memoSkipInfo',
    condition: ({ stellarAddressType, address }) =>
      stellarAddressType === 'public' &&
      (knownPublicAddresses?.find(item => item.public_address === address)
        ?.requires_memo ??
        false),
  });
  fields.push({
    id: 'memo',
    condition: ({ stellarAddressType, memoSkip }) =>
      stellarAddressType === 'public' && !memoSkip,
  });

  if (services['Stellar Service']) {
    return {
      defaultValues: EMPTY_STELLAR_MAINNET,
      mapDefaultValues,
      submitLabel: 'SAVE',
      onSubmit: createData,
      fields,
    };
  }
  return {
    defaultValues: EMPTY_STELLAR_TESTNET,
    mapDefaultValues,
    submitLabel: 'SAVE',
    onSubmit: createData,
    fields,
  };
};

async function createData(values, control, props) {
  const { itemId, onSuccess, showToast } = props;
  const { setSubmitting, setErrors } = control;
  const { memo, stellarAddressType } = values;

  try {
    let data = {
      ...values,
      crypto_type: 'stellar',
    };
    if (!values?.network) {
      data.network = props?.reduxData?.services?.['Stellar Service']
        ? 'mainnet'
        : 'testnet';
    }

    if (memo && stellarAddressType === 'public') {
      data.metadata = { memo };
    }

    if (itemId) {
      data.id = itemId;
    }

    const resp = await updateItem('cryptoAccounts', data);
    onSuccess(resp?.data?.id);
    showToast({ id: `stellar_account_${itemId ? 'edit' : 'add'}_success` });
  } catch (e) {
    showToast({ id: `stellar_account_${itemId ? 'edit' : 'add'}_error` });
  }

  if (typeof setSubmitting === 'function') setSubmitting(false);
}

async function fetchData(cnt, event) {
  try {
    let resp = await getStellarKnownPublicAddresses();
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

  try {
    await deleteItem('cryptoAccounts', itemId);
    showToast({
      text: 'stellar_account_delete_success',
    });
    onSuccess();
  } catch (error) {
    console.log(error);
    showToast({
      text: 'stellar_account_delete_failed',
    });
  }
  if (typeof setSubmitting === 'function') setSubmitting(false);
}

export default {
  title: 'Stellar accounts',
  renderDetail: FormList,
  redux: 'cryptoAccounts',

  services: {
    fetchData,
    createData,
    deleteData,
  },
  components: {
    list: {
      value: item => concatCryptoAccount(item, true, true),
      multiline: true,
      label: item => item?.name,
      status: item => statusText(item),
      emptyListMessage: 'No stellar accounts added',
    },
    form: formConfig,
  },
};
