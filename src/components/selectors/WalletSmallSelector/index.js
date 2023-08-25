import React, { useState } from 'react';
import { standardizeString, objectToArray } from 'utility/general';
import { View, Text, PopUpGeneral } from 'components';

import { TouchableOpacity, Pressable } from 'react-native';
import { AccountCard, WalletCard } from 'components/cards';
import { Icon } from 'components/outputs/Icon';
import { useSelector } from 'react-redux';
import {
  conversionRatesSelector,
  currenciesSelector,
} from 'screens/accounts/redux/reducer';
import { getWallet } from 'utility/wallet';
import WalletSmall from './WalletSmall';

export default function WalletSmallSelector(props) {
  let { children, label, toCodes, form, config = {} } = props;
  const { allowedAccounts } = config;

  const { accountRef, currencyCode } = form.watch();

  const setAccountRef = value => form.setValue('accountRef', value);
  const setCurrencyCode = value => form.setValue('currencyCode', value);
  const [modalVisible, setModalVisible] = useState(false);

  const disabled = false;

  const currencies = useSelector(currenciesSelector);
  const item = getWallet(currencies, accountRef, currencyCode);

  const rates = useSelector(conversionRatesSelector);
  const { accounts } = currencies;

  const accountOptions = objectToArray(accounts)
    .map(item => {
      return {
        value: item,
        key: item.reference,
      };
    })
    .filter(item =>
      allowedAccounts?.length ? allowedAccounts.includes(item.reference) : true,
    );
  const multipleAccounts = accountOptions?.length > 1;
  const hideModal = () => setModalVisible(false);
  const showModal = (value = true) => setModalVisible(value);

  const [tempAccountRef, setTempAccountRef] = useState(accountRef);

  const account = accounts?.[tempAccountRef];
  const items = objectToArray(account?.currencies, 'id').filter(item =>
    toCodes?.length ? toCodes.includes(item?.currency?.code) : item,
  );
  const options = items.map(item => {
    return {
      value: item,
      key: item.account + ':' + item.currency.code,
    };
  });

  function onChange(currency) {
    setCurrencyCode(currency?.currency?.code);
    setAccountRef(currency?.account);
  }

  return (
    <React.Fragment>
      <View fD="row" w="100%" jC="space-between">
        <View mb={0.5}>
          <Text c={'#777'} id={label} />
        </View>
        {!!multipleAccounts && (
          <AccountIconName item={accounts?.[item?.account]} />
        )}
      </View>

      {children ? (
        <TouchableOpacity disabled={disabled} onPress={showModal}>
          {children}
        </TouchableOpacity>
      ) : (
        <Pressable onPress={showModal} disabled={disabled}>
          <WalletSmall item={item} rates={rates} />
        </Pressable>
      )}

      <PopUpGeneral
        visible={modalVisible}
        scrollView
        // title={title ? title : 'Select currency'}
        onDismiss={hideModal}
        docked>
        {Boolean(account) ? (
          <View style={{ maxHeight: '100%', zIndex: 2000 }}>
            {/* {Boolean(account && multipleAccounts) && ( */}
            <View mb={0.5}>
              <AccountIconName
                item={account}
                // onBack={() => setTempAccountRef('')}
              />
            </View>
            {/* )} */}
            {options.map((item, index) => (
              <View pb={1} key={item.key} style={{ zIndex: 20000 }}>
                <WalletCard
                  item={item.value}
                  currencies={currencies}
                  rates={rates}
                  onPressContent={() => {
                    onChange(item.value);
                    hideModal();
                  }}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={{ zIndex: 2000 }}>
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
  const { item, onBack } = props;
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
          h={20}
          w={20}
          mr={0.5}
          fD="row"
          aI="center"
          jC="center">
          <Icon
            set="Custom"
            color="white"
            size={12}
            name={item?.name ?? 'general'}
          />
        </View>
        <Text lH={20} fW="500" s={14}>
          {item?.label ? item?.label : standardizeString(item?.name)}
        </Text>
      </View>
    </Pressable>
  );
}
