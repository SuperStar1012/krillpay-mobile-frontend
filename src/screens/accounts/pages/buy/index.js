import React from 'react';
import buyMachine from './buyMachine';
import { View } from 'components';
import BuyHeader from './BuyHeader';
import BuyDetails from './BuyDetails';
import { updateConversion } from 'utility/rehive';
import AccountFlow from '../../components/AccountFlow';
import BuyOptions from './BuyOptions';

async function handleSubmit(props) {
  const { form, setSubmitting } = props;
  const { conversionQuote } = form.getValues();
  setSubmitting(true);
  // let response = null;
  return await updateConversion(conversionQuote?.id, 'complete', true);
  // try {
  //   response = await updateConversion(conversionQuote?.id, 'complete', true);
  //   console.log('handleSubmit -> response', response);
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
    id: 'buy',
    onSubmit: handleSubmit,
    machine: buyMachine,
    validation: true,
    subtypes: ['buy'],
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
      options: { component: BuyOptions },
      amount: { selector: { label: 'pay_with', disabled: true } },
      post: { title: 'buy', header: BuyHeader, detail: BuyDetails },
    },
  };
}

export default function BuyPage(props) {
  const config = useAccountFlow(props);

  return (
    <View screen>
      <AccountFlow {...props} config={config} />
    </View>
  );
}
