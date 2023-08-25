import React, { useState } from 'react';
import { standardizeString, objectToArray } from 'utility/general';
import { View, Text, PopUpGeneral } from 'components';

import { TouchableOpacity, Pressable } from 'react-native';
import { CurrencyCard, AccountCard, WalletCard } from 'components/cards';
import { Icon } from 'components/outputs/Icon';
// import AccountCard from './AccountCard';
import { useSelector } from 'react-redux';
import {
  conversionRatesSelector,
  currenciesSelector,
} from 'screens/accounts/redux/reducer';
import { getWallet } from 'utility/wallet';
import CurrencySelectorCard from 'screens/settings/components/CurrencySelectorCard';

export default function WalletSelector(props) {
  let { form, children, context, navigation } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const { setValue, watch } = form;
  const config = props?.config?.selector ?? {};
  const { wallet, actionConfig } = context;
  const {
    label = 'from_account',
    simple = false,
    disabled,
    disableCrypto,
    condensed = false,
  } = config;

  const { accountRef, currencyCode, fromWallet } = watch();

  const currencies = useSelector(currenciesSelector);
  const item = fromWallet ?? getWallet(currencies, accountRef, currencyCode);

  const rates = useSelector(conversionRatesSelector);
  const { accounts, multipleAccounts } = currencies;

  const accountOptions = objectToArray(accounts).map(item => {
    return {
      value: item,
      key: item.reference,
    };
  });
  const hideModal = () => setModalVisible(false);

  const [tempAccountRef, setTempAccountRef] = useState(accountRef);

  const account = accounts?.[tempAccountRef];
  let items = objectToArray(account?.currencies, 'id').filter(
    item =>
      !actionConfig?.condition?.hideCurrency?.includes(item.currency.code),
  );
  if (disableCrypto) {
    items = items.filter(item => !item.crypto);
  }
  const options = items.map(item => {
    return {
      value: item,
      key: item.account + ':' + item.currency.code,
    };
  });

  function onChange(currency) {
    setValue('currencyCode', currency?.currency?.code);
    setValue('accountRef', currency?.account);
    navigation?.setParams({ currency });
  }

  if (simple)
    return (
      <>
        <View mb={0.5}>
          <Text c={'#777'} id={label} ns="accounts" />
        </View>
        <CurrencySelectorCard
          disabled={disabled}
          currency={item}
          items={options}
          rates={rates}
          updateCurrency={item => onChange(item)}
        />
      </>
    );

  return (
    <React.Fragment>
      {!condensed && (
        <View fD="row" w="100%" jC="space-between">
          <View mb={0.5}>
            <Text c={'#777'} id={label} ns="accounts" />
          </View>
          {!!multipleAccounts && (
            <AccountIconName item={accounts?.[item?.account]} />
          )}
        </View>
      )}
      {children ? (
        <TouchableOpacity
          disabled={disabled}
          onPress={() => setModalVisible(true)}>
          {children}
        </TouchableOpacity>
      ) : (
        <>
          {!!condensed && (
            <View
              fD="row"
              w="100%"
              jC="space-between"
              style={{ top: 8, zIndex: 1000 }}
              mh={0.75}>
              <View bC="white" ph={0.25} zIndex={10000}>
                <Text c={'#777'} id={label} ns="accounts" s={12} />
              </View>
              {!!multipleAccounts && (
                <AccountIconName item={accounts?.[item?.account]} />
              )}
            </View>
          )}
          <WalletCard
            // overlay
            item={item}
            onPressContentDisabled={disabled}
            rates={rates}
            onPressContent={() => setModalVisible(true)}
          />
        </>
      )}
      <PopUpGeneral
        visible={modalVisible}
        scrollView
        // title={title ? title : 'Select currency'}
        onDismiss={hideModal}
        docked>
        {Boolean(account) ? (
          <View>
            {Boolean(account && multipleAccounts) && (
              <View mb={0.5}>
                <AccountIconName
                  item={account}
                  onBack={() => setTempAccountRef('')}
                />
              </View>
            )}
            {options.map((item, index) => (
              <View pb={1} key={item.key}>
                <WalletCard
                  item={item.value}
                  currencies={currencies}
                  rates={rates}
                  onPressContent={() => {
                    hideModal();
                    onChange(item.value);
                  }}
                />
              </View>
            ))}
          </View>
        ) : (
          <View>
            {accountOptions.map((item, index) => (
              <View pb={1} key={item.key}>
                <AccountCard
                  item={item.value}
                  rates={rates}
                  onPress={() => setTempAccountRef(item.key)}
                />
              </View>
            ))}
          </View>
        )}
      </PopUpGeneral>
    </React.Fragment>
  );
}

function AccountIconName(props) {
  const { item, onBack, size = 14 } = props;
  const showBack = typeof onBack === 'function';
  return (
    <Pressable disabled={!showBack} onPress={onBack}>
      <View fD="row">
        {!!showBack && (
          <Icon
            name="chevron-left"
            set="MaterialIcons"
            size={20}
            color="fontDark"
          />
        )}
        <View
          bC="primary"
          bR={100}
          h={size + 6}
          w={size + 6}
          mr={0.5}
          fD="row"
          aI="center"
          jC="center">
          <Icon
            set="Custom"
            color="white"
            size={size - 2}
            name={item?.name ?? 'general'}
          />
        </View>
        <Text lH={20} fW="500" s={size}>
          {item?.label ? item?.label : standardizeString(item?.name)}
        </Text>
      </View>
    </Pressable>
  );
}
