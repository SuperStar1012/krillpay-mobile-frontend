import React from 'react';
import { Text } from 'components';
export default function RedeemVoucherHeader(props) {
  const { result, formikProps } = props;
  const { voucher = {} } = formikProps?.values;
  const { code } = voucher;

  return (
    <>
      <Text
        c="white"
        fW="700"
        s={16}
        id={result ? 'redeemed' : 'redeem'}
        capitalize
      />
      {code ? (
        <Text c="white" fW="700" s={20}>
          {code}
        </Text>
      ) : null}
    </>
  );
}
