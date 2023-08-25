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

/* 
- takes accountRef and currencyCode props
- filters available currencies?

*/

export default function WalletSelector(props) {
  let {
    children,
    accountRef,
    currencyCode,
    label,
    setCurrencyCode,
    toCodes,
    setAccountRef,
  } = props;
  const [modalVisible, setModalVisible] = useState(false);

  const disabled = false;

  const currencies = useSelector(currenciesSelector);
  const item = getWallet(currencies, accountRef, currencyCode);

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

  // if (simple)
  //   return (
  //     <>
  //       <View mb={0.5}>
  //         <Text c={'#777'} id={label} />
  //       </View>
  //       <CurrencySelectorCard
  //         disabled={disabled}
  //         currency={item}
  //         items={options}
  //         rates={rates}
  //         updateCurrency={item => onChange(item)}
  //       />
  //     </>
  //   );

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
        <TouchableOpacity
          disabled={disabled}
          onPress={() => setModalVisible(true)}>
          {children}
        </TouchableOpacity>
      ) : (
        <WalletCard
          // overlay
          item={item}
          onPressContentDisabled={disabled}
          rates={rates}
          onPressContent={() => setModalVisible(true)}
        />
      )}

      <PopUpGeneral
        visible={modalVisible}
        scrollView
        // title={title ? title : 'Select currency'}
        onDismiss={hideModal}
        docked>
        {Boolean(account) ? (
          <View style={{ maxHeight: '100%', zIndex: 2000 }}>
            {Boolean(account && multipleAccounts) && (
              <View mb={0.5}>
                <AccountIconName
                  item={account}
                  onBack={() => setTempAccountRef('')}
                />
              </View>
            )}
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
