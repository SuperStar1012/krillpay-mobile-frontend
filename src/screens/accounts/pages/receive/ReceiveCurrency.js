import React from 'react';
import CurrencySelectorCard from '../../components/CurrencySelectorCard';

export default function ReceiveCurrency(props) {
  const { formikProps, context, form } = props;
  const { wallets, wallet, rates, actionsConfig } = context;

  const { values } = formikProps;
  let receiveConfig = actionsConfig?.receive ?? {};

  const hideCurrencies = receiveConfig?.condition?.hideCurrency ?? [];

  let filteredCurrencies = {
    ...wallets,
    data: wallets.data.filter(
      currency =>
        hideCurrencies.findIndex(
          hide => hide.toLowerCase() === currency.currency.code.toLowerCase(),
        ) === -1 && !currency.disabled,
    ),
  };

  if (values.recipientType === 'crypto') {
    filteredCurrencies.data = filteredCurrencies.data.filter(
      currency => currency.crypto !== '',
    );
  }

  function handleCurrencySelect(newWallet) {
    form.setValue('currencyCode', newWallet?.currency?.code);
    form.setValue('accountRef', newWallet?.account);
  }
  return (
    <CurrencySelectorCard
      cardType={'wallet'}
      rates={rates}
      modal
      filtered={filteredCurrencies}
      currency={wallet}
      returnCurrency
      currencies={wallets}
      updateCurrency={handleCurrencySelect}
      // updateCurrency={index => currencyHook[1](index)}
    />
  );
}
