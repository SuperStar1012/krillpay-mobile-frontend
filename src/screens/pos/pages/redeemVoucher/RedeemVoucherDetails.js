import React from 'react';
import { View } from 'components';
import moment from 'moment';
import { formatAmountString } from 'utility/rates';
import DetailList from 'components/outputs/DetailList';

export default function RedeemVoucherDetails(props) {
  const { formikProps } = props;

  const { voucher = {} } = formikProps?.values;
  const { item, order, product } = voucher;

  const items = [
    {
      label: 'product_name',
      value: product?.name,

      horizontal: true,
    },
    {
      label: 'amount',
      value: formatAmountString(item?.price, order?.currency, true),
      valueColor: true,
      valueBold: true,
      horizontal: true,
    },
    {
      label: 'date_purchased',
      value: moment(order?.placed).format('lll'),
      horizontal: true,
    },
  ];

  return (
    <>
      {items && (
        <View pv={0.5} w="100%">
          <DetailList items={items} />
        </View>
      )}
    </>
  );
}
