import React, { useEffect, useState } from 'react';
import { get } from 'lodash';

import WalletListHeader from '../components/WalletListHeader';
import { WalletCard, AccountCard } from 'components/cards';
import { View } from 'components';
import ContentList from 'components/to_remove/ContentList';
import { objectToArray, standardizeString, getUserCountryFromMSISDN } from 'utility/general';

import { useSelector } from 'react-redux';

import Header from 'components/layout/header';
import { calculateAccountTotal } from '../util/accounts';
import { getWallet } from 'utility/wallet';
import { useRehiveContext, useAccounts } from 'contexts';
import {
  userProfileSelector,
} from '@redux/rehive/reducer';

export default function WalletList(props) {
  const { route } = props;
  const initialCurrency = route?.params?.currency;

 

  const {
    context: { wallets, rates },
    refresh: fetchAccounts,
  } = useAccounts();
  const {
    context: { services },
    config: { accountsConfig },
  } = useRehiveContext();

  const oneAccount = objectToArray(wallets?.accounts)?.length === 1;

  const [accountRef, setAccountRef] = useState(
    oneAccount ? wallets?.data?.[0]?.account : initialCurrency,
  );
  const oneCurrency =
    oneAccount && wallets?.accounts?.[accountRef]?.keys.length === 1;

  const [currencyCode, setCurrencyCode] = useState(
    oneCurrency ? wallets?.accounts?.[accountRef]?.keys?.[0] : initialCurrency,
  );

  const wallet = getWallet(wallets, accountRef, currencyCode);

  const { layout } = accountsConfig;

  useEffect(() => {
    if (initialCurrency) {
      setAccountRef(initialCurrency?.account);
      setCurrencyCode(initialCurrency?.currency?.code);
    }
  }, [initialCurrency]);

  const context = {
    wallets,
    rates,
    services,
    currencyCode,
    accountRef,
    oneAccount,
    oneCurrency,
    wallet,
  };

  const methods = { fetchAccounts, setAccountRef, setCurrencyCode };
  const pageProps = { context, methods };

  return (
    <View screen hC="screen" header>
      {accountRef || layout !== 'accounts' ? (
        <CurrencyList {...props} {...pageProps} />
      ) : (
        <AccountsList {...props} {...pageProps} />
      )}
    </View>
  );
}

WalletList.whyDidYouRender = true;

function AccountsList(props) {
  const { context, methods } = props;
  const { fetchAccounts, setAccountRef } = methods;
  const { wallets, rates, services } = context;

  const { accounts, error, loading } = wallets;
  const data = objectToArray(accounts);
   
   
  return (
    <View screen ph={1}>
      <ContentList
        type="account"
        data={data}
        error={error}
        loading={loading}
        onRefresh={fetchAccounts}
        renderItem={(item, index) => (
          <View pb={1}>
             <AccountCard
              onPress={item => setAccountRef(item.reference)}
              item={item}
              index={index}
              currencies={wallets}
              rates={rates}
              onRefresh={fetchAccounts}
            />
          </View>
        )}
        keyExtractor={item => item.reference.toString()}
        emptyListMessage={'No active accounts'}
        header={
          services['Conversion Service'] ? (
            {
              component: (
                <View mb={0.75}>
                  <WalletListHeader rates={rates} />
                </View>
              ),
            }
          ) : (
            <View p={0.5} />
          )
        }
      />
    </View>
  );
}

function CurrencyList(props) {
  const { context, methods, navigation } = props;
  const { fetchAccounts, setAccountRef } = methods;
  const { wallets, rates, services, accountRef, oneAccount } = context;
  // const { currencies, rates, services, accountRef, oneAccount, navigation } = props;
  const { accounts, error, loading } = wallets;
  const account = accounts[accountRef];
  const profile = useSelector(userProfileSelector);
  const user = profile?.data?.[0];

  const data =
    accountRef && account ? objectToArray(account.currencies) : wallets.data;

 
    const optionsNGN = data.map(item => {
      if(item.currency.code =="NGN")
      {
        return {
          item
        };
      }
    });
  
    const optionsUSD = data.map(item => {
      if(item.currency.code =="USD")
      {
        return {
          item
        };
      }
    });

    const filteredOptionsNGN = optionsNGN.filter(function (el) {
      return el != null;
    });
  
    const filteredOptionsUSD = optionsUSD.filter(function (el) {
      return el != null;
    }); 

 
  let totalBalance = 0.0;
  if (account) {
    totalBalance = calculateAccountTotal(account, rates);
  }

  const title = oneAccount ? '' : standardizeString(get(account, 'name'));

  function handleBack() {
    setAccountRef('');
  }

  function handleCurrencySelect(item) {
    navigation.navigate('CurrencyDetail', {
      currencyCode: item?.currency?.code,
      accountRef: accountRef ? accountRef : item?.account,
    });
  }

  return (
    <View screen ph={1}>
      {/* getUserCountryFromMSISDN(user.mobile) == "NG" ? 
        <WalletCard
        onPress={handleCurrencySelect}
        navigation={navigation}
        rates={rates}
        item={filteredOptionsNGN[0].item}
        noBorder
            />
      :
      <WalletCard
      onPress={handleCurrencySelect}
      navigation={navigation}
      rates={rates}
      item={filteredOptionsUSD[0].item}
      noBorder
          />

  */}
     
     { getUserCountryFromMSISDN(user?.mobile) == "NG" ? 
      <ContentList
        data={data}
        type="currency"
        error={error}
        loading={loading}
        onRefresh={fetchAccounts}
        renderItem={(item, index) => (
          <View pb={1}>
             <WalletCard
              onPress={handleCurrencySelect}
              navigation={navigation}
              rates={rates}
              item={item}
              noBorder
            />
          </View>
        )}
        keyExtractor={item => (item.account + item.currency.code).toString()}
        emptyListMessage={'No active currencies'}
        renderHeader={
          services['Conversion Service'] ? (
            <View mb={0.75}>
              <WalletListHeader
                title={title}
                rates={rates}
                totalBalance={totalBalance}
              />
            </View>
          ) : (
            <View p={0.5} />
          )
        }
        header={
          !!title && {
            component: (
              <View mh={-1}>
                <Header
                  inverted
                  noPadding
                  noShadow
                  back={!oneAccount}
                  customBackFunc={handleBack}
                  customBack
                  title={title}
                />
              </View>
            ),
          }
        }
      /> 

      :
      <WalletCard
      onPress={handleCurrencySelect}
      navigation={navigation}
      rates={rates}
      item={filteredOptionsUSD[0].item}
      noBorder
          />

       }


    </View>
  );
}
