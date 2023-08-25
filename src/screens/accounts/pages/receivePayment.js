import React, { Component } from 'react';
import { get } from 'lodash';

import { connect } from 'react-redux';
import { fetchCrypto, fetchRates } from '@redux/actions';
import { currenciesSelector, conversionRatesSelector } from '../redux/reducer';

import ReceivePaymentForm from '../components/ReceivePaymentForm';
import { cryptoSelector } from '@redux/selectors';
import {
  authUserSelector,
  currentCompanyServicesSelector,
} from 'screens/auth/redux/selectors';
import { HeaderButton, View } from 'components';
import Header from 'components/layout/header';

class ReceivePaymentScreen extends Component {
  static navigationOptions = {
    title: 'Receive payment',
  };

  state = {
    formState: '',
    currencyIndex: 0,
  };

  componentDidMount() {
    const { route, currencies } = this.props;
    const { params } = route;
    if (params && params.currency) {
      const currencyIndex = currencies.data.findIndex(
        currency =>
          currency?.account === params.currency?.account &&
          currency.currency.code === params.currency.currency.code,
      );

      this.setState({
        currencyIndex,
      });
    }
  }

  renderHeader() {
    const { formState } = this.state;
    return (
      <View fD={'row'}>
        {!formState ? (
          <HeaderButton
            set={'MaterialCommunityIcons'}
            onPress={() => this.setState({ formState: 'qr' })}
            icon={'qrcode'}
          />
        ) : null}
      </View>
    );
  }

  render() {
    const {
      currencies,
      profile,
      crypto,
      fetchCrypto,
      services,
      rates,
      fetchRates,
    } = this.props;

    const { currencyIndex, formState } = this.state;

    const currency = currencies.data[currencyIndex];

    const currencyHook = [
      currencyIndex,
      currencyIndex => this.setState({ currencyIndex }),
    ];
    const formStateHook = [
      formState,
      formState => this.setState({ formState }),
    ];

    return (
      <View f={1} bC={'white'}>
        <Header
          navigation={this.props.navigation}
          customBack={formState === 'qr'}
          customBackFunc={() => formStateHook[1]('')}
          back
          renderRight={this.renderHeader()}
          title={
            'Receive ' +
            get(currency, ['currency', 'description']) +
            (formState === 'qr' ? ' QR' : '')
          }
        />
        <ReceivePaymentForm
          fetchRates={fetchRates}
          rates={rates}
          services={services}
          currencies={currencies}
          profile={profile}
          crypto={crypto}
          fetchCrypto={fetchCrypto}
          formStateHook={formStateHook}
          currency={currency}
          currencyHook={currencyHook}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    currencies: currenciesSelector(state),
    profile: authUserSelector(state),
    crypto: cryptoSelector(state),
    rates: conversionRatesSelector(state),
    services: currentCompanyServicesSelector(state),
  };
};

export default connect(mapStateToProps, { fetchCrypto, fetchRates })(
  ReceivePaymentScreen,
);
