import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';

import {
  currenciesSelector,
  conversionRatesSelector,
} from '../../redux/reducer';

import Header from 'components/layout/header';
import { View, Spinner, Button, Text } from 'components';
import CurrencySelectorCard from '../../components/CurrencySelectorCard';
import { configActionsSelector } from '@redux/rehive/selectors';
import { getChiplessCards } from 'utility/rehive';
import ErrorOutput from 'components/outputs/ErrorOutput';
import ChiplessCard from './ChiplessCard';
import ChiplessCardLimits from './ChiplessCardLimits';
import AddChiplessCardForm from './AddChiplessCardForm';

const pageConfig = {
  '': {
    title: 'Card',
  },
  add: {
    title: 'Add card',
  },
  pin: {
    title: 'Card pin',
  },
  limits: {
    title: 'Card limits',
  },
};

export default function ChiplessCardPage(props) {
  const currencies = useSelector(currenciesSelector);
  const rates = useSelector(conversionRatesSelector);
  const actionsConfig = useSelector(configActionsSelector);
  const config = get(actionsConfig, 'card.config', {});
  const { disableAdd } = config;

  const initialCurrency = get(props, [
    'navigation',
    'state',
    'params',
    'currency',
  ]);
  let initialCurrencyIndex = '';
  if (initialCurrency) {
    initialCurrencyIndex = currencies.data.findIndex(
      currency =>
        currency?.account === initialCurrency.account &&
        currency.currency.code === initialCurrency.currency.code,
    );
  }

  const [currencyIndex, setCurrencyIndex] = useState(initialCurrencyIndex);
  const [cards, setCards] = useState([]);

  const [loading, setLoading] = useState(true);
  const [state, setState] = useState('');

  const [error, setError] = useState('');
  const condition = get(actionsConfig, ['card', 'condition'], '');
  const hideCurrency = get(condition, ['hideCurrency'], []);

  let availableCurrencies = {
    ...currencies,
    data: currencies.data.filter(
      currency =>
        hideCurrency.findIndex(code => code === currency.currency.code) ===
          -1 && initialCurrency.account === currency?.account,
    ),
  };

  async function fetchData() {
    const resp = await getChiplessCards();
    if (resp.status === 'success') {
      setCards(
        get(resp, ['data', 'results'], []).filter(
          item => item.account === initialCurrency.account,
        ),
      );
    } else {
      setError('Unable to retrieve cards');
    }
    setLoading(false);
  }
  useEffect(() => {
    fetchData();
  }, []);

  const currency = currencies.data[currencyIndex];
  const sharedProps = { currency, fetchData, setState, cards };
  return (
    <View f={1} bC={'white'}>
      <Header
        navigation={props.navigation}
        customBack={Boolean(state)}
        customBackFunc={() => setState('')}
        back
        // inverted
        title={get(pageConfig, [state, 'title'])}
      />
      <View p={1}>
        {state === 'add' || state === 'pin' ? (
          <AddChiplessCardForm {...sharedProps} item={get(cards, 0, null)} />
        ) : state === 'limits' ? (
          <ChiplessCardLimits {...sharedProps} />
        ) : (
          <View>
            <CurrencySelectorCard
              rates={rates}
              modal
              filtered={availableCurrencies}
              currency={currency}
              returnIndex
              currencies={currencies}
              updateCurrency={index => setCurrencyIndex(index)}
            />
            {loading ? (
              <Spinner />
            ) : cards && cards.length ? (
              <React.Fragment>
                <View pv={1}>
                  <ChiplessCard item={cards[0]} {...sharedProps} />
                </View>

                <View pb={1}>
                  <Button
                    containerStyle={{ paddingBottom: 8 }}
                    label="Pin"
                    onPress={() => setState('pin')}
                    wide
                    customIcon="pin"
                  />
                </View>
                <Button
                  containerStyle={{ paddingBottom: 8 }}
                  customIcon="limit"
                  label="Limits"
                  onPress={() => setState('limits')}
                  wide
                />
              </React.Fragment>
            ) : (
              <View pt={1}>
                <Button label="ADD CARD" onPress={() => setState('add')} wide />
              </View>
            )}
            <ErrorOutput>{error}</ErrorOutput>
          </View>
        )}
      </View>
    </View>
  );
}
