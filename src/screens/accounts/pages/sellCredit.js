import React, { Component } from 'react';
import { get } from 'lodash';
import { connect } from 'react-redux';

import { fetchPhoneContacts, fetchAccounts } from '@redux/actions';
import { currenciesSelector, conversionRatesSelector } from '../redux/reducer';
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
import { View, HeaderButton, PopUpGeneral } from 'components';
import Header from 'components/layout/header';
import SellCreditForm from '../components/SellCreditForm';

const stellarHelp = [
  {
    id: 0,
    title: 'What is a MEMO?',
    description:
      'If you’re sending funds to a Stellar Address, it is important to include a MEMO if the recipient requires a MEMO. The MEMO acts as an important reference for the receiving party to detect any incoming payments and or deposits for crediting your balance. \n\n If you do not include a MEMO when it is required by the recipient, you can lose your funds.',
  },
  {
    id: 1,
    title: 'What is a Federation Address?',
    description:
      'Stellar makes it easy for third party wallet providers to embed the MEMO in a human readable address format, similar to that of an email address. The only difference is that the @ symbol is replaced with a * symbol, e.g.\n\nusername*domain.com\n\nIt is important to make sure that you are sending funds to a valid federated address.  ',
  },
  {
    id: 2,
    title: 'How do on chain transactions work?',
    description:
      'If you’re sending funds to a Stellar Address it means that the transaction will be broadcasted to the Stellar Network.\n\nThere is usually a small network fee in XLM that will either be passed on to you as the user, or be absorbed by the organization.\n\nYou’ll be notified if the fee will be applied to your XLM account or not.\n\nYou’ll also be able to copy and/or click on the transaction hash to view the transaction chain details after it is broadcasted to the network.\n\nIt is important to note that on chain transactions can’t be reversed.',
  },
];

class SellCreditScreen extends Component {
  static navigationOptions = () => ({
    title: 'Sell credit',
  });

  state = {
    showHelp: false,
    modalVisible: false,
    formState: '',
    modalPage: 0,
    currencyIndex: 0,
    loading: true,
    qr: false,
    init: true,
  };

  componentDidMount() {
    this.props.fetchPhoneContacts();
    this.setCurrencyIndex();
  }

  setCurrencyIndex() {
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
        loading: false,
      });
    }

    if (params.qr) {
      this.setState({ qr: true });
    }
  }

  renderHeader() {
    const { showHelp, qr } = this.state;
    return (
      <View fD={'row'}>
        {showHelp ? (
          <HeaderButton onPress={() => this.modalShow()} icon="help-outline" />
        ) : null}
        <HeaderButton
          onPress={() => this.setState({ qr: !qr })}
          color={'primaryContrast'}
          icon={qr ? 'close' : 'camera-alt'}
        />
      </View>
    );
  }

  modalDismiss = () => this.setState({ modalVisible: false });
  modalShow = () => this.setState({ modalVisible: true, modalPage: 0 });

  renderModal() {
    const { modalVisible, modalPage } = this.state;
    const modalActionOne = {
      text: modalPage < 2 ? 'NEXT' : 'CLOSE',
      onPress: () => {
        if (modalPage < 2) {
          this.setState({ modalPage: modalPage + 1 });
        } else {
          this.modalDismiss();
        }
      },
    };
    return (
      <PopUpGeneral
        visible={modalVisible}
        modalActionOne={modalActionOne}
        onDismiss={this.modalDismiss}
        title={stellarHelp[modalPage].title}
        contentText={stellarHelp[modalPage].description}>
        {stellarHelp && stellarHelp.length > 1 ? (
          <View fD={'row'} f={1} p={1} jC={'center'}>
            {stellarHelp.map((_, i) => {
              {
                /* let opacity = position.interpolate({
                inputRange: [i - 1, i, i + 1],
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              }); */
              }
              return (
                <View
                  key={i}
                  style={{
                    opacity: modalPage === i ? 1 : 0.5,
                    height: 6,
                    width: 6,
                    backgroundColor: 'gray',
                    marginVertical: 2,
                    marginHorizontal: 8,
                    borderRadius: 3,
                  }}
                />
              );
            })}
          </View>
        ) : null}
      </PopUpGeneral>
    );
  }

  handleSendSuccess = currency => {
    this.props.fetchAccounts();
  };

  render() {
    const {
      localAuth,
      pinConfig,
      contacts,
      currencies,
      companies,
      services,
      rates,
      tier,
      actionsConfig,
    } = this.props;
    const { currencyIndex, qr, showHelp, init } = this.state;
    const initialValues = {
      ...this.props?.route?.params,
    };

    const currency = currencies.data[currencyIndex];

    const currencyHook = [
      currencyIndex,
      currencyIndex => this.setState({ currencyIndex }),
    ];

    const qrHook = [qr, qr => this.setState({ qr, init: false })];

    return (
      <View f={1} bC={'surface'}>
        <Header
          navigation={this.props.navigation}
          title={
            init && qr
              ? 'Scan'
              : 'Sell credit ' + get(currency, ['currency', 'code'])
          }
          back
          transparent
          right={showHelp}
          renderRight={this.renderHeader()}
        />
        <SellCreditForm
          tier={tier}
          rates={rates}
          services={services}
          actionsConfig={actionsConfig}
          ref={c => (this.SendForm = c)}
          companies={companies}
          initialValues={initialValues}
          currencies={currencies}
          currencyHook={currencyHook}
          qrHook={qrHook}
          onSendSuccess={currency => this.handleSendSuccess(currency)}
          navigation={this.props.navigation}
          localAuth={localAuth}
          pinConfig={pinConfig}
          headerHelp={{
            value: this.state.showHelp,
            set: value => this.setState({ showHelp: value }),
          }}
        />
        {this.renderModal()}
      </View>
    );
  }
}

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
})(SellCreditScreen);
