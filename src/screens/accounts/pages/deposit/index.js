import React, { useState, useEffect, useMemo } from 'react';
import depositMachine from './depositMachine';
import { Spinner, View } from 'components';
import { createWyreTransfer, getBankAccountsByFilter } from 'utility/rehive';
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
import { useQuery } from 'react-query';
import { concat } from 'lodash';
import ManualDepositMethodSelection from './ManualDepositMethodSelection';
import DepositNotAvailable from './DepositNotAvailable';

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
  const { hasWyre, combinedManualAccounts } = context;
  const hasCompanyBankAccounts = combinedManualAccounts?.length > 0;

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
    },
    manualMethodSelection: {
      component: ManualDepositMethodSelection,
      help: {
        center: {
          tab: 'depositing_money',
        },
      },
    },
    depositNotAvailable: {
      component: DepositNotAvailable,
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
    post: { title: 'send', header: WyreHeader, detail: WyreDetails },
  };

  let machine = { ...depositMachine };

  const flags = { hasCompanyBankAccounts, hasWyre };

  if (hasCompanyBankAccounts && !hasWyre) {
    if (combinedManualAccounts?.length > 1) {
      machine.initial = 'manualMethodSelection';
      machine.states.manual.on.BACK = 'manualMethodSelection';
    } else {
      machine.initial = 'manual';
      delete machine.states.manual.on.BACK;
    }
  } else if (hasWyre) {
    machine.initial = 'wyre';
    delete machine.states.wyre.on.BACK;
  } else {
    machine.initial = 'depositNotAvailable';
  }

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
  const {
    context: { services },
  } = useRehiveContext();
  const hasWyre = checkWyreService(services);
  const currencyCode = props?.route?.params?.currency?.currency?.code;
  const companyBankAccounts = useSelector(companyBankAccountsSelector);
  const [combinedManualAccounts, setCombinedManualAccounts] = useState(null);
  const [selectedManualAccount, setSelectedManualAccount] = useState();

  const {
    context: { user, init },
  } = useRehiveContext();
  const {
    context: { document: documents },
    refresh: refreshDocuments,
  } = useRehive(['document'], init, { user });
  const bankAccounts = useMemo(
    () =>
      companyBankAccounts?.items?.filter(
        acc =>
          acc.currencies.findIndex(curr => curr.code === currencyCode) !== -1,
      ),
    [currencyCode],
  );

  const { data: userBankAccounts } = useQuery(
    [user?.id, currencyCode, 'deposit-bank-accounts'],
    () => getBankAccountsByFilter(`currency=${currencyCode}&action=deposit`),
    {
      enabled: !hasWyre,
      staleTime: 2500,
    },
  );

  useEffect(() => {
    if (userBankAccounts?.data) {
      const combinedAccounts = concat(bankAccounts, userBankAccounts?.data);
      if (combinedAccounts.length === 1) {
        setSelectedManualAccount(combinedAccounts[0]);
      }
      setCombinedManualAccounts(combinedAccounts);
    }
  }, [userBankAccounts]);

  const context = {
    companyBankAccounts,
    documents,
    hasWyre,
    combinedManualAccounts,
    selectedManualAccount,
    setSelectedManualAccount,
  };
  if (!hasWyre && !combinedManualAccounts)
    return (
      <View screen bC="background">
        <Spinner />
      </View>
    );

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
