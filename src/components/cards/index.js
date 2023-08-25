import React from 'react';
import WalletCard from './WalletCard';
import AccountCard from './AccountCard';
import CurrencyCard from './CurrencyCard';
import BalanceCard from './BalanceCard';

export function DynamicCard(props) {
  const { type = 'currency' } = props;

  switch (type) {
    case 'currency':
    default:
      return <CurrencyCard {...props} />;
    case 'account':
      return <AccountCard {...props} />;
    case 'wallet':
      return <WalletCard {...props} />;
    case 'balance':
      return <BalanceCard {...props} />;
  }
}

export { WalletCard, CurrencyCard, AccountCard, BalanceCard };
