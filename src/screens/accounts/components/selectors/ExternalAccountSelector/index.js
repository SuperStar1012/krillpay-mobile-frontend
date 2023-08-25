import React, { useEffect, useMemo, useState } from 'react';

import AccountCard from './AccountCard';
import { Text, View, PopUpGeneral, EmptyListMessage } from 'components';

import { useModal } from 'utility/hooks';
import { FlatList } from 'react-native';
import { cryptoCodeToType } from 'utility/general';
import { getCurrencyCode } from 'utility/rates';
import CurrencySelectorCard from 'screens/settings/components/CurrencySelectorCard';
import CardsSkeleton from 'components/cards/CardsSkeleton';
import AddAccountCard from 'components/cards/AddNewAccountCard';
import { useIsRTL } from 'hooks/general';

export default function ExternalAccountSelector(props) {
  const {
    items = [],
    label = 'withdraw_to',
    variant,
    context,
    refresh,
    loading,
    form,
    navigation,
    isCrypto,
    showToast,
    allowCryptoBankWithdraw,
  } = props;
  const isRTL = useIsRTL();
  const { wallet, wallets, actionConfig, rates } = context;

  const { currency } = wallet;

  const { pairs: withdrawPairs = [] } = actionConfig?.config ?? {};

  const filteredPairs = withdrawPairs.filter(
    pair => pair.split(':')[0] === currency?.code,
  );
  const { modalVisible, showModal, hideModal } = useModal();

  const { setValue, register, watch } = form;
  const item = watch('withdrawAccount');
  const toCurrency = watch('toCurrency');

  useEffect(() => {
    register('withdrawAccount');
  }, [register]);

  const [filteredItems, setFilteredItems] = useState([]);
  const [cryptoBankWithdrawAdd, setCryptoBankWithdrawAdd] = useState(false);

  useEffect(() => {
    if (!loading) {
      let _withdrawAccounts = [];
      if (allowCryptoBankWithdraw || !isCrypto) {
        _withdrawAccounts = _withdrawAccounts.concat(
          items.filter(item =>
            item?.currencies
              ?.map(itemCurrency => itemCurrency.code)
              .includes(currency?.code),
          ),
        );
      }
      if (isCrypto) {
        _withdrawAccounts = _withdrawAccounts.concat(
          items?.filter(
            item => item?.crypto_type === cryptoCodeToType(isCrypto),
          ),
        );
      }
      setFilteredItems(_withdrawAccounts);
      setValue(
        'withdrawAccount',
        _withdrawAccounts?.length ? _withdrawAccounts[0] : null,
      );
    }
  }, [isCrypto, loading, currency]);

  const isCryptoBlocked = Boolean(
    wallet?.crypto && checkWithdrawCryptoBlocked(props),
  );

  const showWithdrawCurrency = filteredPairs.length > 0;
  let withdrawCurrencies = isCryptoBlocked
    ? []
    : [
        {
          label: getCurrencyCode(currency),
          value: currency,
          id: currency?.code,
        },
      ];

  if (showWithdrawCurrency) {
    const extraCurrencies = filteredPairs.map(pair => {
      const code = pair.split(':')[1];
      const tempCurrency =
        wallets?.data?.find(currency => currency?.currency?.code === code)
          ?.currency ?? null;
      if (tempCurrency) {
        return {
          id: code,
          label: code,
          value: tempCurrency,
        };
      }
    });
    withdrawCurrencies = withdrawCurrencies.concat(extraCurrencies);
  }
  withdrawCurrencies = withdrawCurrencies.filter(item => item);
  useEffect(() => {
    handleWithdrawCurrencyChange(withdrawCurrencies?.[0]);
  }, [withdrawCurrencies?.length]);

  function handleSuccess(item, isAdd) {
    hideModal();
    refresh(variant);
    if (isAdd) {
      showToast({
        id: cryptoBankWithdrawAdd ? 'bank_account' : variant + '_add_success',
        variant: 'success',
      });
    }
    setValue('withdrawAccount', item);
  }

  function handleAddAccount(_cryptoBankWithdrawAdd) {
    setCryptoBankWithdrawAdd(_cryptoBankWithdrawAdd);
    hideModal();
    navigation.navigate('Form', {
      wallet,
      variant: _cryptoBankWithdrawAdd ? 'bank_account' : variant,
      isCrypto,
      onSuccess: handleSuccess,
      context,
      cryptoBankWithdrawAdd: _cryptoBankWithdrawAdd,
    });
  }

  function handleWithdrawCurrencyChange(item) {
    setValue('toCurrency', item?.value ?? item);
    setState('');
  }

  const [state, setState] = useState('');
  function handleBack() {
    setState('currency');
  }

  return (
    <React.Fragment>
      <View>
        <View mb={0.5}>
          <Text c={'#777'} id={label} />
        </View>
        {loading ? (
          <CardsSkeleton />
        ) : item ? (
          <AccountCard
            context={context}
            item={item}
            currency={toCurrency ?? currency}
            selected={-1}
            onPress={showModal}
          />
        ) : (
          <AddAccountCard
            title={isCrypto ? 'add_crypto_account' : 'add_bank_account'}
            onPress={() => handleAddAccount(false)}
          />
        )}
      </View>
      <PopUpGeneral
        iconTitleLeft={
          showWithdrawCurrency && !isCryptoBlocked && !state
            ? isRTL
              ? 'chevron-right'
              : 'chevron-left'
            : ''
        }
        onPressTitleLeft={handleBack}
        docked
        titleColor="font"
        scrollView
        ns="accounts"
        title={state ? 'select_withdraw_currency' : 'select_withdraw_account'}
        visible={modalVisible}
        onDismiss={hideModal}>
        <View mb={0.5}>
          {state === 'currency' ? (
            <CurrencySelectorCard
              currency={toCurrency}
              currencies={wallets}
              items={withdrawCurrencies}
              variant="list"
              rates={rates}
              updateCurrency={handleWithdrawCurrencyChange}
            />
          ) : (
            <FlatList
              keyboardShouldPersistTaps={'handled'}
              data={filteredItems}
              renderItem={({ item, index }) => (
                <View key={item?.code ?? item?.address} mb={1}>
                  <AccountCard
                    context={context}
                    item={item}
                    index={index}
                    currency={toCurrency}
                    onPress={handleSuccess}
                  />
                </View>
              )}
              ListEmptyComponent={
                loading ? (
                  <CardsSkeleton mb={1} />
                ) : (
                  <EmptyListMessage id="accounts" />
                )
              }
              keyExtractor={item => item.id.toString()}
              ListFooterComponent={
                <>
                  <AddAccountCard
                    title={isCrypto ? 'add_crypto_account' : 'add_bank_account'}
                    onPress={() => handleAddAccount(false)}
                  />
                  {allowCryptoBankWithdraw && (
                    <AddAccountCard
                      title="add_bank_account"
                      onPress={() => handleAddAccount(true)}
                      style={{ marginTop: 12 }}
                    />
                  )}
                </>
              }
            />
          )}
        </View>
      </PopUpGeneral>
    </React.Fragment>
  );
}

export function checkWithdrawCryptoBlocked(props) {
  const { context, wallet, form } = props;
  const subtypes = ['withdraw_crypto'];

  if (!subtypes?.length) return null;

  const {
    currencyCode,
    toCurrency,
    toAccount,
    toWallet = { currency: toCurrency, account: toAccount },
  } = form.watch();

  const tier = context?.tier?.items?.[0];
  const limits =
    tier?.limits?.filter(item => item?.currency === currencyCode) ?? [];

  // flow blocked check
  let isTierBlocked = true;
  for (let index = 0; index < subtypes?.length; index++) {
    const subtype = subtypes?.[index];
    const subtypeLimits = limits.filter(item => item.subtype === subtype);

    if (
      subtypeLimits?.length === 0 ||
      subtypeLimits.findIndex(item => item?.value > 0) !== -1
    ) {
      isTierBlocked = false;
      index = subtypes?.length;
    }
  }
  if (isTierBlocked) return true;
  return false;
}
