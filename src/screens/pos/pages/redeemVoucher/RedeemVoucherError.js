import React from 'react';
import { View, ButtonList } from 'components';
import ErrorOutput from 'components/outputs/ErrorOutput';

export default function RedeemVoucherError(props) {
  const { formikProps, onBack } = props;

  const buttons = [
    {
      id: 'back',
      onPress: onBack,
    },
  ];

  return (
    <View p={1}>
      <View mb={1}>
        <ErrorOutput>{formikProps?.status?.error}</ErrorOutput>
      </View>
      <ButtonList items={buttons} />
    </View>
  );
}
