import React, { useState } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { fetchAccounts } from '@redux/actions';
import {
  currenciesSelector,
  conversionRatesSelector,
} from '../../redux/reducer';
import {
  configPinSelector,
  userTierSelector,
  configActionsSelector,
} from '@redux/rehive/selectors';

import {
  localAuthSelector,
  companiesSelector,
  currentCompanyServicesSelector,
} from 'screens/auth/redux/selectors';
import { View } from 'components';
import Header from 'components/layout/header';
import PrepaidForm from './PrepaidForm';
import PendingIndacoinTransactionsModal from './PendingIndacoinTransactionsModal';

const PrepaidScreen = props => {
  function handleSuccess(currency) {
    props.fetchAccounts();
  }

  const {
    localAuth,
    pinConfig,
    currencies,
    rates,
    navigation,
    actionsConfig,
  } = props;
  const currency = get(navigation, ['state', 'params', 'currency']);
  const indacoinTransactionsHook = useState([]);

  const [
    indacoinTransactions,
    setIndacoinTransactions,
  ] = indacoinTransactionsHook;

  const showTransactions = Boolean(indacoinTransactions.length);

  return (
    <View f={1} bC={'white'}>
      <Header
        navigation={props.navigation}
        title={'Add funds'}
        back
        right={showTransactions}
        renderRight={
          <PendingIndacoinTransactionsModal items={indacoinTransactions} />
        }
      />
      <PrepaidForm
        rates={rates}
        currency={currency}
        actionsConfig={actionsConfig}
        currencies={currencies}
        onSuccess={currency => handleSuccess(currency)}
        navigation={navigation}
        localAuth={localAuth}
        pinConfig={pinConfig}
        indacoinTransactionsHook={indacoinTransactionsHook}
      />
    </View>
  );
};

const mapStateToProps = state => {
  return {
    currencies: currenciesSelector(state),
    localAuth: localAuthSelector(state),
    pinConfig: configPinSelector(state),
    companies: companiesSelector(state),
    rates: conversionRatesSelector(state),
    services: currentCompanyServicesSelector(state),
    tier: userTierSelector(state),
    actionsConfig: configActionsSelector(state),
  };
};

export default connect(mapStateToProps, {
  fetchAccounts,
})(PrepaidScreen);
