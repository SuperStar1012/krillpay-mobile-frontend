import React from 'react';
// import { useSelector } from 'react-redux';
// import ConfirmModal from 'components/layout/ConfirmModal';
// import Text from 'components/outputs/Text';
// import { View } from 'components/layout/View';
// import { userProfileSelector } from '@redux/rehive/selectors';
// import { conversionRatesSelector } from 'screens/accounts/redux/selectors';
// import { currentCompanyServicesSelector } from '@redux/auth/selectors';

// import { calculateRate } from 'utility/rates';
// import { get } from 'lodash';
// import { copyToClipboard, formatAmountString, uuidv4 } from 'utility/general';
// import { showToast } from 'components/outputs/Toast';
import {
  updatePaymentRequest,
  notifyPaymentRequest,
  createTransactionCollection,
  cancelPaymentRequest,
} from 'utility/rehive';
// import { RateReviewSharp } from '@material-ui/icons';

export function copyLink({ request, showToast } = {}) {
  showToast({ id: 'copied_to_clipboard' });
}

export async function remind({ request, showToast }) {
  await notifyPaymentRequest(request.id);

  showToast({
    id: 'request_reminder',
    context: { value: request.payer_email || request.payer_mobile },
  });
}

export async function cancel({ request, user, onSuccess, showToast }) {
  const outgoing = request?.user?.id === user?.id;

  await cancelPaymentRequest(request.id, {
    incoming: !outgoing,
  });

  showToast({
    id: outgoing
      ? 'successfully_cancelled_request_to'
      : 'successfully_declined_request_from',
    context: { value: request.payer_email || request.payer_mobile },
    variant: 'info',
  });

  onSuccess && onSuccess({});
}

// export async function createPayment({
//   request,
//   currency,
//   user,
//   onSuccess,
//   onError,
// }) {
//   try {
//     const updateResponse = await updatePaymentRequest(request.id, {
//       primary_payment_processor: 'native',
//       payment_processor_currency: request.request_currency.code,
//     });
//     const quote = get(
//       updateResponse,
//       ['data', 'payment_processor_quotes', '0'],
//       {},
//     );
//     const payment_processor = get(quote, ['payment_processor']);
//     const uuid = uuidv4();
//     let transactions = [
//       {
//         id: uuid,
//         partner: quote.reference,
//         tx_type: 'debit',
//         status: 'complete',
//         user: user.id,
//         amount: request.request_amount,
//         currency: request.request_currency.code,
//         account: currency.account,
//         subtype: 'send_email',
//       },
//       {
//         id: quote.reference,
//         partner: uuid,
//         tx_type: 'credit',
//         status: 'complete',
//         amount: request.request_amount,
//         currency: request.request_currency.code,
//         account_name: request.account,
//         subtype: payment_processor.rehive_subtype ?? 'receive_email',
//         user: request.user.id,
//       },
//     ];
//     const response = await createTransactionCollection(transactions);

//     onSuccess && onSuccess({ response });
//   } catch (error) {
//     onError && onError({ error });
//   }
// }

// const userLabel = (request, outgoing, contactOnly = false) => {
//   const user = outgoing ? 'payer_user' : 'user';

//   if (!request[user]) return request.payer_email || request.payer_mobile;

//   return !contactOnly && request[user].first_name && request[user].last_name
//     ? `${request[user].first_name} ${request[user].last_name}`
//     : request[user].email || request[user].mobile;
// };

// export function renderConfirm({
//   request,
//   currency,
//   action,
//   services,
//   rates,
//   user,
//   onConfirm,
//   onSuccess,
//   onCancel,
//   onError,
// }) {
//   const outgoing = request?.user?.id === user?.id;
//   let conversionRate = 1;

//   const hasConversion =
//     services?.['Conversion Service'] &&
//     rates.rates &&
//     rates.displayCurrency.code &&
//     rates.displayCurrency.code !== currency.code;

//   if (hasConversion) {
//     conversionRate = calculateRate(
//       currency.code,
//       rates.displayCurrency.code,
//       rates.rates,
//     );
//   }

//   const config = {
//     pay: {
//       title: 'Confirm pay',
//       buttonText: 'CONFIRM',
//       cancelButton: 'Cancel',
//       description: 'You are about to pay ',
//       recipientDirection: 'to ',
//       onConfirm: () => {
//         // setState('action');
//         onConfirm && onConfirm();
//         createPayment({ request, user, currency, onSuccess, onError });
//       },
//     },
//     cancel: {
//       title: outgoing ? 'Cancel request' : 'Decline request',
//       buttonText: 'CANCEL',
//       cancelButton: 'Back',
//       buttonColor: '#CC2538',
//       description: `Are you sure you want to ${
//         outgoing ? 'cancel your request' : 'decline the request'
//       } of `,
//       recipientDirection: 'from ',
//       onConfirm: () => {
//         // setState('action');
//         onConfirm && onConfirm();
//         cancel({ request, user, onSuccess });
//       },
//     },
//   };

//   return (
//     <ConfirmModal
//       {...{
//         visible: true,
//         onConfirm: config[action].onConfirm,
//         // onCancel: () => setState(''),
//         onCancel: () => onCancel && onCancel(),
//         title: config[action].title,
//         cancelButtonText: config[action].cancelButton,
//         buttonText: config[action].buttonText,
//         buttonColor: config[action].buttonColor,
//         topSlot: () => (
//           <View bC={'#DDD'} bR={100} h={80} w={80} aI={'center'} jC={'center'}>
//             <Text
//               bold
//               myColor={'#9A9A9A'}
//               width={'unset'}
//               style={{ fontSize: 30 }}>
//               {userLabel(request, outgoing, true)?.charAt(0)?.toUpperCase()}
//             </Text>
//           </View>
//         ),
//       }}>
//       <Text style={{ textAlign: 'center' }}>
//         {config[action].description}
//         <Text
//           myColor={'primary'}
//           fontWeight={'500'}
//           style={{ display: 'inline' }}>
//           {formatAmountString(
//             request.request_amount,
//             request.request_currency,
//             true,
//           )}{' '}
//           {hasConversion &&
//             `(~${formatAmountString(
//               request.request_amount * conversionRate,
//               rates.displayCurrency,
//               true,
//               request.request_currency.divisibility,
//             )}) `}
//         </Text>{' '}
//         {config[action].recipientDirection}
//         <Text
//           myColor={'primary'}
//           fontWeight={'500'}
//           style={{ display: 'inline' }}>
//           {userLabel(request, outgoing, true)}
//         </Text>
//         {request.description && ` for ${request.description}`}
//       </Text>
//     </ConfirmModal>
//   );
// }
