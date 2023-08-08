import React from 'react';
import WyreAddBankAccount from 'components/wyre/WyreAddBankAccount';

export default function AddBankAccount(props) {
  const { send, refresh } = props;

  function hanldeSuccess() {
    refresh?.refreshDocuments();
    send('BACK');
  }

  return (
    <WyreAddBankAccount
      {...props}
      isOnboardingComplete
      onSuccess={hanldeSuccess}
    />
  );
}
