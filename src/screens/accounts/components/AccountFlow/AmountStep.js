import React from 'react';
import Numpad from 'components/inputs/Numpad';
import { Button, View } from 'components';
import WalletSelector from '../selectors/WalletSelector';
import ContentLayout from 'components/layout/ContentLayout';

import { formatDivisibility } from 'utility/general';
import { calculateRate } from 'screens/accounts/util/rates';

export default function AmountStep(props) {
  const { config = {}, form, context } = props;
  const { watch } = form;
  const { validation = true, selector } = config;
  const { wallet, rates } = context;

  const amount = watch('amount');
  const fromWallet = watch('fromWallet');
  const hasConv = !!fromWallet;
  const { currency = {}, available_balance } = fromWallet ?? wallet;
  const convRate = hasConv
    ? calculateRate(
        fromWallet?.currency?.code,
        wallet?.currency?.code,
        rates?.rates,
      )
    : 1;

  let maxFloat = formatDivisibility(
    available_balance * convRate,
    currency?.divisibility,
  );

  const insufficientBalance = validation && parseFloat(amount) > maxFloat;

  return (
    <View f={1}>
      <View f={1} pb={1.5}>
        <Numpad
          {...props}
          max={maxFloat}
          error={insufficientBalance ? 'Insufficent balance' : ''}
        />
      </View>
      {selector !== false && (
        <ContentLayout>
          <WalletSelector {...props} />
        </ContentLayout>
      )}
      <ContentLayout pb={1.5}>
        <Button
          //   disabled={(!parseFloat(amount) || insufficientBalance) && validation}
          //   !Change amount step
          disabled={false}
          id="next"
          wide
          onPress={props.onNext}
        />
      </ContentLayout>
    </View>
  );
}
