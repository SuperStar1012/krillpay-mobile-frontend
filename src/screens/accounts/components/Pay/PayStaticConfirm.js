import React from 'react';

import ConfirmPage from 'components/page/ConfirmPage';
import { formatAmountString } from '../../util/rates';
// import { useFeeWithConversion } from '../../util/fees';
import PayHeader from './PayHeader';
import { Text } from 'components';
import { useConversion } from 'utility/rates';

function PayStaticHeader(props) {
  const { showAmount, title, amount, context } = props;
  const { wallet, services } = context;
  const amountString = amount && formatAmountString(amount, wallet?.currency);
  const { convAmount } = useConversion(amount, services, wallet?.currency);

  return (
    <>
      {showAmount && (
        <>
          <Text c="white" fW="700" s={16}>
            {title}
          </Text>
          <Text c="white" fW="700" s={34}>
            {amountString}
          </Text>
          {Boolean(convAmount) && (
            <Text c="white" s={14}>
              {convAmount}
            </Text>
          )}
        </>
      )}
      <PayHeader {...props} />
    </>
  );
}

const config = { title: 'PAY', header: PayStaticHeader };

export default function PayConfirm(props) {
  const { form, hooks } = props;
  const values = form.getValues();

  const { amount } = values ?? {};

  return (
    <ConfirmPage
      variant="new"
      amount={amount}
      showAmount
      submitting={hooks?.isSubmitting}
      {...props}
      {...config}
    />
  );
}

// Fee

// const {
//   totalString,
//   feeString,
//   fee,
//   feeConvString,
//   totalConvString,
// } = useFeeWithConversion(
//   amountValue,
//   tier,
//   currency.currency,
//   'send',
//   convRate,
//   rates.displayCurrency,
// );
// // let feeAmount = 0.0;
// // let feeString = '';
// // let feeConvString = '';
// // const fee = getFee(tier, 'pay', currency.currency);
// if (fee) {
//   // feeAmount = calculateFee(amountValue, fee, currency);
//   // feeString = formatAmountString(feeAmount, currency.currency);
//   // if (hasConversion) {
//   //   feeConvString =
//   //     '~' +
//   //     formatAmountString(feeAmount * convRate, rates.displayCurrency);
//   // }
//   items.push({
//     id: 'fee',
//     label: 'Service fee',
//     value: feeString,
//     value2: feeConvString,
//     horizontal: true,
//   });
//   // Total amount
//   // let totalAmount = 0.0;
//   // let totalAmountString = '';
//   // let totalAmountConvString = '';
//   // totalAmount = parseFloat(amountValue) + feeAmount;
//   // totalAmountString = formatAmountString(totalAmount, currency.currency);
//   // if (hasConversion) {
//   //   totalAmountConvString =
//   //     '~' +
//   //     formatAmountString(totalAmount * convRate, rates.displayCurrency);
//   // }
//   items.push({
//     id: 'total_amount',
//     label: 'Total amount',
//     value: totalString,
//     value2: totalConvString,
//     horizontal: true,
//     bold: true,
//   });
// }
