import React from 'react';
import { View } from 'components';
import AccountFlow from 'screens/accounts/components/AccountFlow';

import RequestPaymentActivity from './RequestPaymentActivity';
import requestMachine from './requestMachine';
import RequestHeader from './RequestHeader';
import { calculateRate } from 'utility/rates';
import { IsEmail } from 'utility/validation';
import { cleanMobile } from 'utility/general';
import { createPaymentRequest } from 'utility/rehive';
import RequestDetails from './RequestDetails';

async function handleSubmit(props) {
  const { form, wallet, setSubmitting, context } = props;
  const { services, rates } = context;

  const currency = wallet;
  let {
    amount,
    recipient,
    note,
    memo,
    type: recipientType,
    display,
    id,
  } = form.getValues();

  setSubmitting(true);
  // let { amount, recipient, reason, display } = values;

  // setState('submitting');

  if (
    services?.conversion_service &&
    rates.rates &&
    rates.displayCurrency.code &&
    display
  ) {
    const convRate = calculateRate(
      wallet.currency.code,
      rates.displayCurrency.code,
      rates.rates,
    );
    amount = amount / convRate;
  }

  amount = parseInt(amount * 10 ** wallet.currency.divisibility);

  let request = {
    account: wallet.account,
    request_currency: wallet.currency.code,
  };
  if (amount) request.request_amount = Math.floor(amount);

  if (IsEmail(recipient)) request.payer_email = recipient;
  else request.payer_mobile_number = cleanMobile(recipient);

  if (note) request.description = note;

  const response = await createPaymentRequest(request);

  if (response.status === 'error') {
    throw response;
  }
  setSubmitting(false);

  return {
    ...response,
    data: {
      ...(response?.data ?? {}),
      amount: response?.data?.request_amount ?? 0,
      user: {
        // ...response.data.payer_user,
        email: IsEmail(recipient) ? recipient : null,
        mobile: !IsEmail(recipient) ? recipient : null,
      },
      currency: wallet.currency,
      account: wallet.account,
    },
  };
}

function useAccountFlow(props) {
  const { currency: initialCurrency = '', recipient = '' } =
    props?.route?.params ?? {};

  let machine = JSON.parse(JSON.stringify(requestMachine));

  if (recipient?.length > 0) {
    machine.initial = 'amount';
    machine.states.amount.on.NEXT = 'confirm';
    machine.states.amount.on.BACK = 'recipient';
    machine.states.recipient.on.NEXT = 'amount';
    machine.states.recipient.on.BACK = null;
    machine.id = 'request_recipient';
  }

  return {
    id: 'request',
    onSubmit: handleSubmit,
    machine,
    defaultValues: {
      amount: '',
      recipient,
      currencyCode: initialCurrency?.currency?.code,
      accountRef: initialCurrency?.account,
      memoSkip: '',
      stellarTransactionType: 'public',
      pinVisible: false,
    },
    initialFilters: { type: 'pending' },
    configs: {
      list: {
        title: 'payment_request',
        dense: true,
        component: RequestPaymentActivity,
        menuItems: ({ filters = {}, setFilters }) => [
          {
            label: 'pending',
            selected: filters?.type === 'pending',
            onPress: () => setFilters({ ...filters, type: 'pending' }),
          },
          {
            label: 'paid',
            selected: filters?.type === 'paid',
            onPress: () => setFilters({ ...filters, type: 'paid' }),
          },
          {
            label: 'cancelled',
            selected: filters?.type === 'cancelled',
            onPress: () => setFilters({ ...filters, type: 'cancelled' }),
          },
        ],
      },
      amount: {
        validation: false,
        selector: { label: 'request_currency', simple: true, crypto: false },
      },
      recipient: {
        title: 'request_recipient_title',
        actionLabel: 'request_recipient_action_label',
        types: ['email', 'mobile'],
      },
      note: {
        recipientLabel: 'request_recipient_on_note_label',
        types: ['email', 'mobile'],
      },
      post: { header: RequestHeader },
      result: {
        header: RequestHeader,
        detail: RequestDetails,
      },
    },
  };
}

export default function RequestPaymentPage(props) {
  const config = useAccountFlow(props);
  return (
    <View screen>
      <AccountFlow {...props} config={config} />
    </View>
  );
}
