import React, { Component } from 'react';
import moment from 'moment';
import { Keyboard, Image } from 'react-native';

import { Formik } from 'formik';
import { get } from 'lodash';
import CurrencySelectorCard from './CurrencySelectorCard';
import {
  calculateRate,
  formatDecimals,
  renderRate,
  getCurrencyCode,
} from '../util/rates';
import AmountInput from './AmountInput';
import { TextField, View, Button, Text } from 'components';
import OutputList from 'components/outputs/OutputList';
import context from 'components/context';
import QRCode from 'components/outputs/QRCode';
import * as Clipboard from 'expo-clipboard';

class _ReceivePaymentForm extends Component {
  state = {
    receiveString: '',
    modalVisible: false,
  };

  onSubmitEditing(index) {
    try {
      switch (index) {
        case 'amount':
          Keyboard.dismiss();
          break;
      }
    } catch (e) {
      console.log('onSubmitEditing', e);
    }
  }

  _copyQR(receiveString, currency) {
    Clipboard.setString(receiveString);
    this.props.showToast({
      text:
        receiveString +
        ' copied.' +
        (currency.crypto === 'stellar'
          ? ' Please remember to include your memo when sending to this address.'
          : ''),
      duration: 3000,
    });
  }

  renderCurrency(props) {
    const { currencyHook, currencies, rates } = this.props;
    const currency = currencies.data[currencyHook[0]];

    return (
      <CurrencySelectorCard
        rates={rates}
        modal
        filtered={currencies}
        currency={currency}
        returnIndex
        currencies={currencies}
        updateCurrency={index => currencyHook[1](index)}
      />
    );
  }

  renderReceive(props) {
    const { currency, services, rates, formStateHook } = this.props;

    const amountInputProps = {
      services,
      rates,
      formikProps: props,
      currency,
      onSubmitEditing: () => {},
    };

    return (
      <View p={1}>
        {this.renderCurrency(props)}
        <AmountInput {...amountInputProps} />
        <View p={1} />
        <Button
          onPress={() => formStateHook[1]('qr')}
          color={'primary'}
          label={'VIEW QR CODE'}
          wide
        />
      </View>
    );
  }

  renderQR = props => {
    const { values } = props;
    const { currency, rates, services } = this.props;
    const { display, amount } = values;
    const profile = get(values, ['profile']);

    let paymentQRString =
      'pay:' +
      profile.id +
      '?currency=' +
      get(currency, ['currency', 'code']) +
      (profile.first_name
        ? '&name=' +
          profile.first_name +
          (profile.last_name && ' ' + profile.last_name)
        : '') +
      (profile.profile ? '&image=' + encodeURIComponent(profile.profile) : '');
    let receiveItems = [];

    let amountString = '';
    let sentenceString = '';
    let amountConvString = '';
    const { divisibility } = currency.currency;
    const hasConversion =
      services?.conversion_service && rates.rates && rates.displayCurrency.code;
    if (amount) {
      if (hasConversion) {
        const convRate = calculateRate(
          currency.currency.code,
          rates.displayCurrency.code,
          rates.rates,
        );

        receiveItems.push({
          label: 'Rate',
          value: renderRate({
            fromCurrency: currency.currency,
            toCurrency: rates.displayCurrency,
            rate: convRate,
          }),
          value2:
            'Last updated ' +
            moment(
              rates.rates['USD:' + currency.currency.code].created,
            ).fromNow(),
        });

        if (display) {
          amountString = formatDecimals(amount / convRate, divisibility);
          sentenceString =
            amountString + ' ' + getCurrencyCode(currency.currency);

          amountConvString =
            formatDecimals(amount, rates.displayCurrency.divisibility) +
            ' ' +
            getCurrencyCode(rates.displayCurrency);
        } else {
          amountString = formatDecimals(amount, divisibility);
          sentenceString =
            amountString + ' ' + getCurrencyCode(currency.currency);

          amountConvString =
            formatDecimals(
              amount * convRate,
              rates.displayCurrency.divisibility,
            ) +
            ' ' +
            getCurrencyCode(rates.displayCurrency);
        }
        if (amountConvString) {
          amountConvString = '~' + amountConvString;
          sentenceString =
            amountString +
            ' ' +
            getCurrencyCode(currency.currency) +
            ' (' +
            amountConvString +
            ')';
        }
      } else {
        amountString = formatDecimals(amount, divisibility);
        sentenceString =
          amountString + ' ' + getCurrencyCode(currency.currency);
      }
    } else {
      sentenceString = getCurrencyCode(currency.currency);
    }

    if (amountString) {
      paymentQRString = paymentQRString + '&amount=' + amountString;
    }

    const B = props => (
      <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>
    );

    const text = (
      <Text tA={'center'}>
        {'I want to get paid '}
        <B>{sentenceString}</B>
      </Text>
    );

    const photoLink = profile.profile;
    const name = profile.first_name
      ? profile.first_name + ' ' + profile.last_name
      : '';

    return (
      <React.Fragment>
        {/* <View p={2} w={'100%'} style={{ paddingBottom: 0 }}>
          {text}
        </View> */}

        <View p={2} style={styles.viewStyleContainer}>
          {photoLink && (
            <Image
              style={styles.imageStylePhoto}
              source={{
                uri: photoLink,
                // cache: 'only-if-cached',
              }}
              key={photoLink}
            />
          )}

          <View style={styles.viewStyleName}>
            <Text color={'headerContrast'}>{name}</Text>
          </View>
        </View>
        <QRCode encUrl={encodeURIComponent(paymentQRString)} width={220} />
        <View aI={'flex-start'} w={'100%'} ph={1}>
          <OutputList items={receiveItems} />
        </View>
      </React.Fragment>
    );
  };

  render() {
    const { profile, formStateHook } = this.props;
    const formState = formStateHook[0];

    return (
      <React.Fragment>
        <Formik
          initialValues={{
            profile,
            amount: '',
          }}>
          {props => (
            <View keyboardAvoiding scrollView>
              {formState === 'qr'
                ? this.renderQR(props)
                : this.renderReceive(props)}
            </View>
          )}
        </Formik>
      </React.Fragment>
    );
  }
}

const ReceivePaymentForm = context(_ReceivePaymentForm);

export default ReceivePaymentForm;

const styles = {
  viewStyleContainer: {
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.15,
    zIndex: 2,
  },
  imageStylePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 0,
  },
  viewStyleName: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
};
