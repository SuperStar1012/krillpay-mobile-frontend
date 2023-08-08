import React from 'react';
import { PopUpGeneral } from 'components/layout/PopUpGeneral';
import { Text } from 'components';

export default function RequestPaymentActivityInsufficientFunds(props) {
  const { state, setState } = props;

  return (
    <PopUpGeneral
      visible={state === 'insufficientFunds'}
      onDismiss={() => setState('')}
      title={'Insufficient funds'}
      buttonActions={[
        {
          text: 'Cancel',
          type: 'text',
          onPress: () => setState(''),
        },
      ]}>
      <Text tA={'center'}>
        You do not have sufficient funds to make this payment.
      </Text>
    </PopUpGeneral>
  );
}
