import React, { useState, useDeferredValue, useRef, useEffect } from 'react';

/**
 *
 * @param {{banks: import('../../api/getBankCodes').NIPBank[]}} param0
 * @returns
 */
export default function useSearchBankComponent({ banks, onSelect }) {
  const bankInputRef = useRef();
  const [banksPlaceholderList, setBanksPlaceholderList] = useState([]);
  const [showBankList, setShowBankList] = useState(false);
  const [searchBankText, setSearchBankText] = useState('');
  const deferredSearchText = useDeferredValue(searchBankText);

  const filteredBanks = banksPlaceholderList.filter(bank =>
    bank.bankName.toLowerCase().includes(deferredSearchText.toLowerCase()),
  );

  function onSelectBank(bank) {
    onSelect(bank);
    setSearchBankText(bank.bankName);
    bankInputRef.current?.blur();
    setShowBankList(false);
  }

  function onFocus() {
    setBanksPlaceholderList(banks);
    setShowBankList(true);
  }

  function onBlur() {
    setShowBankList(false);
    const lastStandingFilteredBank = filteredBanks[0];
    if (
      lastStandingFilteredBank?.bankName.toLowerCase() ===
      searchBankText.toLowerCase()
    ) {
      setSearchBankText(lastStandingFilteredBank?.bankName);
      onSelect(lastStandingFilteredBank);
    }
    setBanksPlaceholderList([]);
  }

  return {
    onSelectBank,
    setSearchBankText,
    searchBankText,
    filteredBanks,
    showBankList,
    bankInputRef,
    onBlur,
    onFocus,
  };
}
