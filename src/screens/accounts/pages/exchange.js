import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Header from 'components/layout/HeaderNew';
import { View, Spinner, Text } from 'components';
import { fetchData, fetchAccounts } from '@redux/actions';

import {
  currenciesSelector,
  conversionPairsSelector,
  conversionRatesSelector,
} from '../redux/reducer';
import ExchangeForm from '../components/ExchangeForm';
import { userTierSelector } from '@redux/rehive/selectors';
import CompanyStatusBanner from 'components/auth/CompanyStatusBanner';
import { useConversionTimer } from '../hooks/conversion';
import { useSelector } from 'react-redux';
import { userProfileSelector } from '@redux/rehive/reducer';

function ExchangeScreen(props) {
  let { currencies, navigation, route } = props;
  const [loading, setLoading] = useState(true);
  const currencyIndexHook = useState(0);
  const [currencyIndex, setCurrencyIndex] = currencyIndexHook;
  const profile = useSelector(userProfileSelector);
  const user = profile?.data?.[0];

  const [data, setData] = useState(null);
  const [formState, setFormState] = useState('');

  useEffect(() => {
    const { params } = route;

    if (params && params.currency) {
      const currencyIndex = currencies.data.findIndex(
        currency =>
          currency?.account === params.currency?.account &&
          currency.currency.code === params.currency.currency.code,
      );
      setCurrencyIndex(currencyIndex);
    }
    setLoading(false);
  }, []);

  currencies = { ...currencies, items: currencies.data };

  const currency = currencies?.data?.[currencyIndex];

  const { remaining, expired } = useConversionTimer(data);

  function handleBack() {
    if (formState === 'confirm') {
      setFormState('');
      setData(null);
    } else navigation.goBack();
  }

  const bC = formState !== '' ? '#F8F8F8' : '#ffffff';
  return (
    <View screen bC={bC}>
      <CompanyStatusBanner />
      {/* <Header
        navigation={navigation}
        title={formState === '' ? 'exchange' : ''}
        back
        handleBack={handleBack}
        bC={bC}
        transparent
        rightAction={
          Boolean(data && remaining) && (
            <View pr={1} pt={0.5}>
              <Text tA={'right'} c={'font'} s={22}>
                {remaining}
              </Text>
            </View>
          )
        }
      />*/}
      {loading ? (
        <Spinner />
      ) : (
        <ExchangeForm
          {...props}
          index={currencyIndex}
          formState={formState}
          setFormState={setFormState}
          data={data}
          setData={setData}
          user={user}
          currency={currency}
          currencyIndexHook={currencyIndexHook}
        />
      )}
    </View>
  );
}

const mapStateToProps = state => {
  return {
    conversionPairs: conversionPairsSelector(state),
    rates: conversionRatesSelector(state),
    tier: userTierSelector(state),
    currencies: currenciesSelector(state),
  };
};

export default connect(mapStateToProps, {
  fetchData,
  fetchAccounts,
})(ExchangeScreen);
