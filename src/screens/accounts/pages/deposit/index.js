import React from 'react';
import depositMachine from './depositMachine';
import { View } from 'components';
import { createWyreTransfer } from 'utility/rehive';
import AccountFlow from '../../components/AccountFlow';
import { useRehiveContext } from 'contexts/RehiveContext';
import { toDivisibility } from 'utility/general';
import { useSelector } from 'react-redux';
import { companyBankAccountsSelector } from '@redux/rehive/reducer';

import ManualDeposit from './ManualDeposit';
import DepositList from './DepositList';
import WyreAccounts from './WyreAccounts';
import WyreAddBankAccount from './AddBankAccount';
import AccountsStep from './AccountsStep';
import WyreHeader from './WyreHeader';
import { useRehive } from 'hooks/rehive';
import WyreDetails from './WyreDetails';
import { checkWyreService } from 'extensions/wyre/util';

async function handleSubmit(props) {
  const { form, wallet, setSubmitting, context } = props;

  const id = context?.wyreAccount?.item?.id;

  const currency = wallet;
  setSubmitting(true);
  let { amount, account } = form.getValues();
  const amountInt = toDivisibility(amount, currency?.currency);

  const data = {
    destination_wallet: currency?.account,
    to_currency: 'USD',
    from_currency: 'USD',
    payment_method: account?.id,
    type: 'INCOMING',
    amount: amountInt,
  };
  const resp = await createWyreTransfer({ id, data });
  setSubmitting(false);
  if (resp?.status === 'FAILED') throw new Error(resp?.wyre_error);

  return resp;
}

function useAccountFlow(props, context) {
  const {
    currency: initialCurrency = '',
    amount = '',
    recipient = '',
    asset_code,
    accountRef,
  } = props?.route?.params ?? {};

  const {
    context: { services },
  } = useRehiveContext();
  const { companyBankAccounts } = context;

  const hasCompanyBankAccounts = companyBankAccounts?.items?.length > 0;
  const hasWyreService = checkWyreService(services);

  let configs = {
    accounts: {
      component: AccountsStep,
      selector: {
        label: 'to_account',
        disableCrypto: true,
      },
    },
    manual: {
      component: ManualDeposit,
      backgroundColor: 'background',
    },
    type: {
      component: DepositList,
    },
    wyre: {
      component: WyreAccounts,
      help: {
        center: {
          tab: 'depositing_money',
        },
        // items: [
        //   {
        //     id: 'mobile',
        //     title: 'send_to_mobile',
        //     description: 'send_to_mobile_description',
        //   },
        //   {
        //     id: 0,
        //     title: 'what_is_a_memo',
        //     condition: ({ context }) =>
        //       context?.wallet?.crypto?.includes('XLM'),
        //     description: 'what_is_a_memo_desciption',
        //   },
        //   {
        //     id: 1,
        //     title: 'what_is_a_federation_address',
        //     condition: ({ context }) =>
        //       context?.wallet?.crypto?.includes('XLM'),
        //     description: 'what_is_a_federation_address_description',
        //   },
        //   {
        //     id: 2,
        //     title: 'how_do_on_chain_transactions_work',
        //     condition: ({ context }) =>
        //       context?.wallet?.crypto?.includes('XLM'),
        //     description: 'how_do_on_chain_transactions_work_description',
        //   },
        // ],
      },
    },
    link_account: { component: WyreAddBankAccount },
    amount: {
      validation: false,
      selector: {
        label: 'deposit_to',
        disabled: true,
        condensed: true,
      },
    },
    post: { title: 'send', header: WyreHeader, detail: WyreDetails }, //
  };

  let machine = { ...depositMachine };

  const flags = { hasCompanyBankAccounts, hasWyreService };

  if (hasCompanyBankAccounts && !hasWyreService) {
    machine.initial = 'manual';
    delete machine.states.manual.on.BACK;
    // machine.states.accounts.on.NEXT = 'manual';
    // machine.states.manual.on.BACK = 'accounts';
  } else if (!hasCompanyBankAccounts && hasWyreService) {
    machine.initial = 'wyre';
    delete machine.states.wyre.on.BACK;
    // machine.states.accounts.on.NEXT = 'wyre';
    // machine.states.wyre.on.BACK = 'accounts';
  }
  // if (hasCompanyBankAccounts && !hasWyreService) {
  //   machine.states.accounts.on.NEXT = 'manual';
  //   machine.states.manual.on.BACK = 'accounts';
  // } else if (!hasCompanyBankAccounts && hasWyreService) {
  //   machine.states.accounts.on.NEXT = 'wyre';
  //   machine.states.wyre.on.BACK = 'accounts';
  // }

  return {
    id: 'deposit',
    onSubmit: handleSubmit,
    machine,
    defaultValues: {
      amount,
      recipient,
      currencyCode: asset_code ?? initialCurrency?.currency?.code,
      accountRef: accountRef ?? initialCurrency?.account,
    },
    configs,
    flags,
  };
}

export default function DepositPage(props) {
  const companyBankAccounts = useSelector(companyBankAccountsSelector);

  const {
    context: { user, init },
  } = useRehiveContext();

  const {
    context: { document: documents },
    refresh: refreshDocuments,
  } = useRehive(['document'], init, { user });

  const context = {
    companyBankAccounts,
    documents,
  };
  const config = useAccountFlow(props, context);

  return (
    <View screen bC="background">
      <AccountFlow
        {...props}
        config={config}
        context={context}
        refresh={{ refreshDocuments }}
      />
    </View>
  );
}
