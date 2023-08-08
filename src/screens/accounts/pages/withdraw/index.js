import React, { useMemo } from 'react';
import { View } from 'components';
import AccountFlow from 'screens/accounts/components/AccountFlow';

import withdrawMachine from './withdrawMachine';
import WithdrawHeader from './WithdrawHeader';
import WithdrawDetails from './WithdrawDetails';
import WithdrawAccountsStep from './WithdrawAccountsStep';
import { createDebit, updateConversion } from 'utility/rehive';
import { useRehiveContext } from 'contexts/RehiveContext';

async function handleSubmit(props) {
  const { form, setSubmitting, context } = props;
  const { wallet, allowCryptoBankWithdraw } = context;

  const { currency } = wallet;
  let {
    amount,
    withdrawAccount: selectedAccount,
    conversionQuote,
    toCurrency,
  } = form.getValues();

  const hasConversion = currency?.code !== toCurrency?.code;
  const cryptoSelectedBankForWithdraw =
    allowCryptoBankWithdraw && selectedAccount?.bank_name;

  setSubmitting(true);
  let response = null;
  const isCrypto = !!selectedAccount?.crypto_type; //checkIfCrypto({ currency: toCurrency, crypto });

  let data;
  if (hasConversion) {
    if (conversionQuote) {
      response = await updateConversion(conversionQuote?.id, 'complete');
      const withdrawMetadata = {
        account: selectedAccount,
        type: isCrypto && !cryptoSelectedBankForWithdraw ? 'crypto' : 'fiat',
      };
      data = {
        amount: conversionQuote?.to_total_amount,
        metadata: {
          native_context: withdrawMetadata,
          rehive_context: withdrawMetadata,
        },
        currency: toCurrency.code,
        account: conversionQuote.credit_account,
        subtype: `withdraw${
          isCrypto && !cryptoSelectedBankForWithdraw ? '_crypto' : '_manual'
        }`,
      };
    } else {
      throw { status: 'error', message: 'Unable to process conversion' };
    }
  } else {
    const withdrawMetadata = {
      account: selectedAccount,
      type: isCrypto && !cryptoSelectedBankForWithdraw ? 'crypto' : 'fiat',
    };
    data = {
      amount: parseInt(amount * 10 ** currency.divisibility),
      metadata: {
        native_context: withdrawMetadata,
        rehive_context: withdrawMetadata,
      },
      currency: currency?.code,
      account: wallet?.account,
      subtype: `withdraw${
        isCrypto && !cryptoSelectedBankForWithdraw ? '_crypto' : '_manual'
      }`,
    };
  }
  response = await createDebit(data);

  setSubmitting(false);
  return response;
}

function useAccountFlow(props) {
  const { currency: initialCurrency = '' } = props?.route?.params ?? {};
  const isCrypto = Boolean(initialCurrency?.crypto);

  return {
    id: 'withdraw',
    onSubmit: handleSubmit,
    machine: withdrawMachine,
    subtypes: ['withdraw_manual', 'withdraw_crypto'],
    defaultValues: {
      amount: '',
      type: isCrypto ? 'crypto' : 'manual',
      withdrawAccount: null,
      currencyCode: initialCurrency?.currency?.code,
      accountRef: initialCurrency?.account,
      toCurrency: initialCurrency?.currency,
    },
    configs: {
      accounts: {
        title: 'select_withdraw_accounts',
        component: WithdrawAccountsStep,
        help: {
          center: {
            tab: 'withdrawing_money',
          },
        },
      },
      amount: { selector: { disabled: true } },
      post: {
        title: 'WITHDRAW',
        header: WithdrawHeader,
        detail: WithdrawDetails,
      },
    },
  };
}

export default function WithdrawPaymentPage(props) {
  const {
    config: { actionsConfig },
  } = useRehiveContext();
  const currencyCode = props?.route?.params?.currency?.currency?.code;
  const allowCryptoBankWithdraw = useMemo(
    () =>
      Boolean(
        actionsConfig?.withdraw?.config?.cryptoBankSupport?.some(
          item => item === currencyCode,
        ),
      ),
    [currencyCode],
  );
  const config = useAccountFlow(props);

  return (
    <View screen>
      <AccountFlow
        {...props}
        config={config}
        context={{ allowCryptoBankWithdraw }}
      />
    </View>
  );
}
