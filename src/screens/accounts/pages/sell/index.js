import React from 'react';
import sellMachine from './sellMachine';
import { View } from 'components';
import BuyHeader from './SellHeader';
import BuyDetails from './SellDetails';
import AccountFlow from '../../components/AccountFlow';
import SellOptions from './SellOptions';
import { updateConversion } from 'utility/rehive';

async function handleSubmit(props) {
  const { form, setSubmitting } = props;
  const { conversionQuote } = form.getValues();
  setSubmitting(true);
  let response = null;
  // try {
  return await updateConversion(conversionQuote?.id, 'complete', true);
  // console.log('handleSubmit -> response', response);
  // } catch (error) {
  //   console.log(error);
  //   let message = error?.message;
  //   if (
  //     error.message.includes('transaction') &&
  //     error.message.includes('amount')
  //   ) {
  //     if (error.message.includes(' 0.0')) {
  //       message = `You're unable to complete this exchange, required tier not met.`;
  //     } else {
  //       message = `You've reached your buy limit, required tier not met.`;
  //     }
  //   } else {
  //     message =
  //       'Unable to complete exchange' +
  //       (error.message ? ': ' + error.message : '');
  //   }
  //   throw { ...error, message };
  // }

  // return response;
}

function useAccountFlow(props) {
  const {
    currency: initialCurrency = '',
    amount = '',
    recipient = '',
  } = props?.route?.params ?? {};

  return {
    id: 'sell',
    onSubmit: handleSubmit,
    machine: sellMachine,
    // subtypes: ['send_crypto', 'send_email', 'send_mobile'],
    defaultValues: {
      amount,
      recipient,
      currencyCode: initialCurrency?.currency?.code,
      accountRef: initialCurrency?.account,
      memoSkip: '',
      stellarTransactionType: 'public',
      pinVisible: false,
    },
    configs: {
      options: { component: SellOptions },
      amount: { selector: { label: 'pay_with', disabled: true } },
      post: { title: 'BUY', header: BuyHeader, detail: BuyDetails },
    },
  };
}

export default function SellPage(props) {
  const config = useAccountFlow(props);

  return (
    <View screen>
      <AccountFlow {...props} config={config} />
    </View>
  );
}
