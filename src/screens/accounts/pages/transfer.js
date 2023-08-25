import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from 'components/layout/HeaderNew';
import { configPinSelector } from '@redux/rehive/selectors';
import { View } from 'components';
import { fetchData, fetchAccounts } from '@redux/actions';
import TransferForm from '../components/TransferForm';
import {
  currenciesSelector,
  conversionPairsSelector,
  conversionRatesSelector,
} from '../redux/reducer';
import { useLocalAuth } from 'contexts/LocalAuthContext';

class TransferClass extends Component {
  static navigationOptions = () => ({
    title: 'Transfer',
  });

  state = {
    pinVisible: false,
    bC: '#ffffff',
  };

  setBackgroundColor = (bC = '#f8f8f8') => {
    this.setState({ bC });
  };

  performTransfer() {
    const {
      withdrawWallet,
      withdrawAmount,
      withdrawBankAccount,
      withdrawNote,
    } = this.props;

    let data = {
      amount: withdrawAmount,
      currency: withdrawWallet.currency.currency,
      metadata: { bank_account: withdrawBankAccount },
      note: withdrawNote,
      reference: withdrawWallet.account_reference,
    };
    this.props.withdraw(data);
  }

  render() {
    const {
      route,
      fetchData,
      currencies,
      localAuth,
      pinConfig,
      fetchAccounts,
      conversionPairs,
      rates,
    } = this.props;
    const { currency } = route.params;

    return (
      <View screen bC={this.state.bC}>
        <Header
          navigation={this.props.navigation}
          title={this.state.bC === '#ffffff' ? 'transfer' : ''}
          back
          transparent
        />
        <TransferForm
          initialCurrency={currency}
          navigation={this.props.navigation}
          currencies={currencies}
          fetchData={fetchData}
          fetchAccounts={fetchAccounts}
          localAuth={localAuth}
          pinConfig={pinConfig}
          conversionPairs={conversionPairs}
          rates={rates}
          setBackgroundColor={this.setBackgroundColor}
        />
      </View>
    );
  }
}

function TransferScreen(props) {
  const { localAuth } = useLocalAuth();
  return <TransferClass {...props} localAuth={localAuth} />;
}

const mapStateToProps = state => {
  return {
    currencies: currenciesSelector(state),
    pinConfig: configPinSelector(state),
    conversionPairs: conversionPairsSelector(state),
    rates: conversionRatesSelector(state),
  };
};

export default connect(mapStateToProps, {
  fetchData,
  fetchAccounts,
})(TransferScreen);
