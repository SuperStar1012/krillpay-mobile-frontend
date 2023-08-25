import React from 'react';
import { View } from 'components';

import CurrencySelector from './CurrencySelector';
import AccountSelector from './AccountSelector';

export default function AccountCurrencySelector(props) {
  const {
    rates,
    accountItems,
    accountItem,
    currencyItems,
    currencyItem,
    onAccountChange,
    onCurrencyChange,
  } = props;

  const hideAccounts = accountItems.length < 2;

  return (
    <>
      {!hideAccounts && (
        <View pb={1}>
          <AccountSelector
            rates={rates}
            disabled={accountItems.length < 2}
            modal
            items={accountItems}
            item={accountItem}
            onChange={onAccountChange}
          />
        </View>
      )}
      <CurrencySelector
        rates={rates}
        disabled={currencyItems.length < 2}
        modal
        items={currencyItems}
        item={currencyItem}
        onChange={onCurrencyChange}
      />
    </>
  );
}
