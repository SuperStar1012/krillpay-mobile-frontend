import React from 'react';

import ResultPage from 'components/layout/ResultPageNew';
import PayDetails from './PayDetails';
import PayHeader from './PayHeader';
import { toDivisibility } from 'utility/general';
import ErrorOutput from 'components/outputs/ErrorOutput';

export default function PayResult(props) {
  const { request, error, values, context = {} } = props;
  const { wallet = props?.currency } = context ?? {};

  return (
    <>
      <ResultPage
        {...props}
        bC={'#F8F8F8'}
        state={error ? 'fail' : 'success'}
        header={<PayHeader {...props} />}
        detail={
          error ? (
            <ErrorOutput>{error?.message ?? error}</ErrorOutput>
          ) : request ? (
            <PayDetails {...props} />
          ) : null
        }
        {...{
          // date: request?.updated,
          amount:
            request?.request_amount ??
            toDivisibility(values?.amount, wallet?.currency),
          currency: request?.request_currency ?? wallet?.currency,
          title: 'PAID',
        }}
      />
    </>
  );
  // return (
  //   <ResultPage
  //     text={text}
  //     amount={sentenceString}
  //     recipient={recipient}
  //     result={result}
  //     handleButtonPress={handleButtonPress}
  //     formikProps={props}
  //     scrollView={false}
  //     // buttonText="VIEW TRANSACTION"
  //   />
  // );
}

// const isRequest = Boolean(request);
// let recipient = '';
// let sentenceString = '';
// let result = error;
// const conversionQuote = props?.hooks?.conversionQuote;

// if (isRequest) {
//   let { status, payment_processor_quotes } = request;
//   let { name } = business ?? {};

//   const quote =
//     payment_processor_quotes.find(
//       item =>
//         item.payment_processor.unique_string_name === 'native' &&
//         item.status.match(/paid|processing/),
//     ) ?? {};
//   const isSuccess = status === 'paid' || status === 'overpaid';
//   result = { ...resultO, status: isSuccess ? 'success' : 'failed' };

//   // const { divisibility } = currency.currency;
//   const { amount, currency } = quote;

//   recipient = name;
//   sentenceString =
//     amount && currency && formatAmountString(amount, currency, true);
// } else {
//   result = resultO;
//   recipient = data?.name;
//   if (conversionQuote) {
//     const { amount = 0 } = formikProps?.values ?? {};
//     const amountString = formatAmountString(
//       conversionQuote?.from_amount,
//       currency?.currency,
//       true,
//     );
//     sentenceString = amountString;

//     const amountConvString = formatAmountString(
//       conversionQuote?.to_amount,
//       toCurrency?.currency,
//       true,
//     );

//     sentenceString = sentenceString + ' (~' + amountConvString + ')';
//   } else {
//     // const transaction = result?.transactions?.[0]??{};
//     const { amount = 0 } = formikProps?.values ?? {};
//     const amountString =
//       formatDecimals(amount, currency?.currency?.divisibility) +
//       ' ' +
//       getCurrencyCode(currency?.currency);
//     sentenceString = amountString;

//     if (
//       services['Conversion Service'] &&
//       rates.rates &&
//       rates.displayCurrency.code
//     ) {
//       const convRate = calculateRate(
//         currency?.currency?.code,
//         rates.displayCurrency.code,
//         rates.rates,
//       );
//       const showConv =
//         convRate && currency?.currency?.code !== rates.displayCurrency.code;

//       const amountConvString =
//         formatDecimals(
//           amount * convRate,
//           rates.displayCurrency.divisibility,
//         ) +
//         ' ' +
//         getCurrencyCode(rates.displayCurrency);

//       sentenceString =
//         sentenceString + (showConv ? ' (~' + amountConvString + ')' : '');
//     }
//   }
// }

// let text =
//   result?.id || result?.status === 'success'
//     ? 'Payment of '
//     : 'You failed paying ';
