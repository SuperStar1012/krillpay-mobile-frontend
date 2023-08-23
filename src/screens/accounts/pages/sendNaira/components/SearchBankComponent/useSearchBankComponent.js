import React, { useState } from 'react';

export default function useSearchBankComponent() {
  const [selectedBank, setSelectedBank] = useState({});

  function onSelectBank(bank) {
    setSelectedBank(bank);
    console.log(bank);
  }

  return { onSelectBank };
}
