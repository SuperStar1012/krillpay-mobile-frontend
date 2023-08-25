import React, { useEffect } from 'react';
import { View, Text } from 'components';
import { objectToArray } from 'utility/general';
import CurrencySelector from './CurrencySelector';
import AccountSelector from './AccountSelector';
import ConversionRate from '../../components/ConversionRate';
import AmountInput from '../../components/AmountInput';
import { renderRate } from '../../util/rates';
import moment from 'moment';

function calculateAllowedConversionCurrencies(pairs, currencyCode) {
  let toCodes = pairs.items
    .filter(pair => pair.key.split(':')[0] === currencyCode)
    .map(item => item.key.split(':')[1]);

  return toCodes;
}

export default function PayCurrency(props) {
  const {
    currencies,
    currency,
    toCurrency,
    checkoutConfig,
    hooks,
    conversionPairs,
    rates,
    services,
    request,
    quote,
    isBlankRequest,
    formikProps,
    hideConversion,
  } = props;
  const {
    currencyCode,
    setCurrencyCode,
    accountRef,
    setAccountRef,
    setConversionQuote,
    conversionQuote,
  } = hooks;

  const { hideCurrency = [] } = checkoutConfig;
  const { request_currency = {} } = request ? request : {};

  let toCodes = !request
    ? [currencyCode]
    : calculateAllowedConversionCurrencies(
        conversionPairs,
        request_currency.code,
      )
        .concat(request_currency?.code)
        .filter(item => !hideCurrency.includes(item));

  let accountItems = objectToArray(currencies?.accounts);

  if (request) {
    accountItems = accountItems.map(account => ({
      ...account,
      keys: account?.keys.filter(currency => toCodes.includes(currency)),
    }));
    accountItems = accountItems.filter(account => account?.keys?.length > 0);
  }

  useEffect(() => {
    if (
      !accountRef ||
      accountItems.findIndex(item => item.reference === accountRef) === -1
    ) {
      const newAccount = accountItems?.[0];
      if (newAccount) {
        setAccountRef(newAccount?.reference);
        setCurrencyCode(newAccount?.keys?.[0]);
      }
    }
  }, [accountRef, accountItems]);

  const hideAccounts = accountItems.length < 2;
  let accountItem = currencies?.accounts?.[accountRef];

  const currencyItems = objectToArray(accountItem?.currencies).filter(item =>
    request ? toCodes.includes(item?.currency?.code) : item,
  );
  const wallet = accountItem?.currencies?.[currencyCode];
  const selectedCurrency = currencyItems?.find(
    x => x.currency.code === currencyCode,
  );

  const rate =
    quote?.conversion_quote?.rate ?? parseFloat(conversionQuote?.rate);

  let currencyValue = null;
  let convCurrencyValue = null;

  if (request) {
    currencyValue = quote?.currency ?? request_currency;
    convCurrencyValue = request_currency;
  } else {
    currencyValue =
      (conversionQuote ? currency?.currency : toCurrency?.currency) ??
      currency?.currency;
    convCurrencyValue = toCurrency?.currency;
  }

  useEffect(() => {
    if (
      !currencyCode ||
      currencyItems.findIndex(item => item.currency.code === currencyCode) ===
        -1
    ) {
      setCurrencyCode(accountItem.keys[0]);
      setConversionQuote(null);
    }
  }, [accountRef, wallet]);

  return (
    <View pv={0.5}>
      <View mv={0.5}>
        <Text s={14} c={'#777'}>
          From account
        </Text>
      </View>
      {!hideAccounts && (
        <View pb={1}>
          <AccountSelector
            rates={rates}
            disabled={accountItems.length < 2}
            modal
            items={accountItems}
            item={accountItem}
            onChange={item => setAccountRef(item.reference)}
          />
        </View>
      )}
      <CurrencySelector
        rates={rates}
        currencies={currencies}
        disabled={currencyItems.length < 2}
        modal
        items={currencyItems}
        item={wallet}
        onChange={item => {
          setCurrencyCode(item?.currency?.code);
          setConversionQuote(null);
        }}
      />
      {Boolean(rate) && (
        <View mt={1}>
          <ConversionRate>
            {renderRate({
              toCurrency: convCurrencyValue,
              fromCurrency: currencyValue,
              rate,
            })}
          </ConversionRate>
        </View>
      )}
      {isBlankRequest && (!quote || moment(quote?.expiration_date) < moment()) && (
        <AmountInput
          {...{
            services,
            rates,
            formikProps,
            currency: selectedCurrency,
            hideConversion,
            fieldProps: hideConversion
              ? {
                  label: `Amount in ${currencyCode}`,
                }
              : null,
          }}
        />
      )}
    </View>
  );
}
