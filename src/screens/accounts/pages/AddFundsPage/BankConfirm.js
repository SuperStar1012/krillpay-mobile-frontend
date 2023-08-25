import React from 'react';

import { get } from 'lodash';
import CompanyBankAccountDeposit from '../../components/CompanyBankAccountDeposit';
import { Text } from 'components';
import { formatAmountString } from '../../util/rates';

export default function BankConfirm(props) {
  const { formikProps, config, currency } = props;
  const { values } = formikProps;
  const { amount } = values;

  const amountValue = get(config, ['fixed', 'options', amount, 'amount'], 0);
  const amountString = formatAmountString(amountValue, currency.currency, true);

  return (
    <CompanyBankAccountDeposit
      TextComponent={
        <Text p={1} tA={'center'}>
          {'Transfer exactly '}
          <Text c="primary" fW="700">
            {amountString}
          </Text>
          {
            ' to the bank details below. Make sure to use the correct reference number.'
          }
        </Text>
      }
      currency={currency}
    />
  );
}
