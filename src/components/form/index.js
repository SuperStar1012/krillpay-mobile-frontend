import React from 'react';

import Old from './Old';
import { AddressForm } from './AddressForm';
import { BankAccountForm } from './BankAccountForm';
import CryptoAccountForm from './CryptoAccountForm';
import RehiveForm from './RehiveForm';

export default function Form(props) {
  const { variant } = props;
  if (!variant) return <Old {...props} />;

  switch (variant) {
    case 'address':
      return <AddressForm {...props} />;
    case 'bank_account':
      return <BankAccountForm {...props} />;
    case 'crypto_account':
      return <CryptoAccountForm {...props} />;
    default:
      return <RehiveForm {...props} />;
  }
}
