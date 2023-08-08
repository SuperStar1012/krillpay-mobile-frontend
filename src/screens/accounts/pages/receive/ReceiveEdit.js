import React from 'react';
import * as Inputs from 'config/inputs';
import { View, Button } from 'components';
import RadioSelector from 'components/inputs/RadioSelector';
import AmountInput from '../../components/AmountInput';
import FormikInput from 'components/inputs/FormikInput';
import ReceiveCurrency from './ReceiveCurrency';
import ReceiveRecipientButtons from './ReceiveRecipientButtons';

export default function ReceiveEdit(props) {
  const { setFormState, formikProps, context } = props;
  const { crypto, wallet, services, rates } = context;
  const { values } = formikProps;

  const { stellarTransactionType, recipientType } = values;
  let isCrypto = recipientType === 'crypto';
  let isFederated = false;

  let isStellar = isCrypto && wallet.crypto.match(/TXLM|XLM/);

  if (isStellar) {
    const currentCrypto = crypto?.[wallet.crypto] ?? null;
    if (currentCrypto) {
      const { company, user } = currentCrypto;
      if (company && user) {
        if (company.is_federated) {
          isFederated = true;
        }
      }
    } else {
      isStellar = false;
    }
  }

  const amountInputProps = {
    services,
    rates,
    formikProps,
    currency: wallet,
    onSubmitEditing: () => {},
  };

  return (
    <View p={1} ph={1.5}>
      <ReceiveCurrency {...props} />
      <View pt={0.5}>
        <ReceiveRecipientButtons {...props} />
      </View>
      {isStellar && isFederated && (
        <RadioSelector
          title="address_type"
          items={[
            { value: 'public', label: 'public_address_memo' },
            { value: 'federation', label: 'federation_address' },
          ]}
          handleChange={value =>
            props.setFieldValue('stellarTransactionType', value)
          }
          value={stellarTransactionType}
        />
      )}
      <AmountInput {...amountInputProps} />
      <FormikInput
        field={Inputs.receive['note']}
        // onSubmitEditing={() => this.onSubmitEditing(id, props)}
        name={'note'}
        formikProps={formikProps}
        multiline
      />
      <View pt={1}>
        <Button
          onPress={() => setFormState('qr')}
          color={'primary'}
          id={'view_' + (isCrypto ? 'address' : 'qr_code')}
          wide
        />
      </View>
    </View>
  );
}
