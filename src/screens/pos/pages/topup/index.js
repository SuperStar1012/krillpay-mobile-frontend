import React from 'react';

import TopUpForm from './TopUpForm';
import TopUpHeader from './TopUpHeader';
import { createTransfer } from 'utility/rehive';

import Big from 'big.js';

async function handleSubmit(form, wallet) {
  let { amount, recipient, accountRef, currencyCode } = form.getValues();
  amount = new Big(amount);
  amount = amount.times(10 ** wallet.currency.divisibility);
  amount = parseInt(amount);

  let data = {
    amount,
    recipient,
    currency: currencyCode,
    debit_account: accountRef,
    debit_subtype: 'withdraw_teller',
    credit_subtype: 'deposit_teller',
  };
  return await createTransfer(data);
}

const initialValues = { recipient: '', amount: '' };

const config = {
  id: 'top_up_user_balance',
  onSubmit: handleSubmit,
  initialValues,

  configs: {
    post: {
      header: TopUpHeader,
    },
  },
};

export default function TopUpPage(props) {
  return <TopUpForm {...props} config={config} />;
}
