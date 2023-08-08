import React, { useState, useEffect } from 'react';
import { Share, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { View, Button } from 'components';
import { get } from 'lodash';
import { cleanMobile } from 'utility/general';
import { getPaymentRequests, getReceivedPaymentRequests } from 'utility/rehive';
import { currentCompanyServicesSelector } from 'screens/auth/redux/selectors';
import { configActionsSelector } from '@redux/rehive/selectors';
import {
  currenciesSelector,
  conversionRatesSelector,
} from '../../redux/reducer';
import { formatAmountString, calculateRate } from '../../util/rates';
import { userLabel } from '../../util/accounts';
import Header from 'components/layout/header';
import RequestPaymentForm from './RequestPaymentForm';
import RequestPaymentActivity from './RequestPaymentActivity';
import ResultPage from 'components/layout/ResultPage';
import IconButton from 'components/inputs/IconButton';
import { useContacts } from 'contexts/ContactsContext';

export default function RequestPaymentPage(props) {
  const { navigation, route } = props;

  const [state, setState] = useState('list');
  const [filter, setFilter] = useState('Pending');
  const [initialTab, setInitialTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]); //Requests made BY the user
  const [receivedRequests, setReceivedRequests] = useState([]); //Requests made TO the user
  const [requestResult, setRequestResult] = useState();
  const [paymentResult, setPaymentResult] = useState();
  const [selectedCurrency, setSelectedCurrency] = useState(
    route?.params?.currency,
  );

  const services = useSelector(currentCompanyServicesSelector);
  const currencies = useSelector(currenciesSelector);
  const rates = useSelector(conversionRatesSelector);
  const { context: contacts } = useContacts();
  const actionsConfig = useSelector(configActionsSelector);

  const hiddenCurrencies = get(
    actionsConfig,
    ['request', 'condition', 'hideCurrency'],
    [],
  );

  const filteredCurrencies = {
    data: currencies?.data?.filter(
      x => !hiddenCurrencies.includes(x.currency.code),
    ),
  };

  useEffect(() => {
    setSelectedCurrency(
      filteredCurrencies?.data?.find(
        x => x.currency?.code === selectedCurrency?.currency?.code,
      ) ?? filteredCurrencies?.data?.[0],
    );
    getRequests({ getReceived: true });
  }, []);

  let conversionRate = 1;

  const hasConversion =
    services['Conversion Service'] &&
    rates.rates &&
    rates.displayCurrency.code &&
    rates.displayCurrency.code !== selectedCurrency?.currency?.code;

  if (hasConversion) {
    conversionRate = calculateRate(
      selectedCurrency?.currency?.code,
      rates.displayCurrency.code,
      rates.rates,
    );
  }

  async function getRequests({ getReceived }) {
    setLoading(true);

    // const resp = await getPaymentRequests(
    //   `?request_currency=${selectedCurrency.currency.code}`,
    // );
    const resp = await getPaymentRequests();

    setRequests(get(resp, ['data', 'results']));

    if (getReceived) {
      // const resp = await getReceivedPaymentRequests(
      //   `?request_currency=${selectedCurrency.currency.code}`,
      // );
      const resp = await getReceivedPaymentRequests();
      setReceivedRequests(get(resp, ['data', 'results']));
    }

    setLoading(false);
  }

  function renderResult() {
    const result = requestResult || paymentResult;
    const isBlankRequest = [0, null, 'None'].includes(result?.data?.amount);

    const secondaryAction = () => (
      <Button
        color={'primary'}
        wide
        label={'Done'}
        type={'text'}
        onPress={() => {
          setState('');
          setRequestResult(null);
          setPaymentResult(null);
        }}
      />
    );

    const share = () => {
      Share.share({
        ...Platform.select({
          ios: {
            url: result.data.redirect_url,
          },
          android: {
            message: result.data.redirect_url,
          },
        }),
      });
    };

    let resultProps = {
      text: 'Something went wrong',
      result,
      buttonText: 'TRY AGAIN',
      onReset: () => {
        setInitialTab(1);
        setState(null);
        setRequestResult(null);
        setPaymentResult(null);
      },
    };

    if (result.status === 'success') {
      resultProps = {
        ...resultProps,
        text: `You have ${requestResult ? 'requested' : 'paid'} `,
        buttonText: requestResult
          ? 'SHARE PAYMENT REQUEST'
          : 'VIEW TRANSACTION',
        amount: isBlankRequest
          ? 'any amount'
          : formatAmountString(result.data.amount, result.data.currency, true),
        recipient: userLabel(
          requestResult ? requestResult.data : result.data,
          'user',
          true,
        ),
        recipientDirection: requestResult ? 'from' : 'to',
        onSuccess: requestResult
          ? share
          : () => {
              // dispatch(fetchAccounts());
              navigation.navigate('CurrencyDetail', {
                currencyCode: result.data.currency.code,
                accountRef: result.data.account,
              });
              setRequestResult(null);
              setPaymentResult(null);
              setState(null);
            },
        onReset: () => {
          setRequestResult(null);
          setPaymentResult(null);
          setState(null);
        },
        secondaryAction,
      };
    }

    return <ResultPage {...resultProps} />;
  }

  function renderContent() {
    if (requestResult || paymentResult) return renderResult();

    switch (state) {
      case 'list':
        return (
          <RequestPaymentActivity
            {...{
              userLabel,
              getRequests,
              requests,
              setRequests,
              receivedRequests,
              currencies: filteredCurrencies,
              hasConversion,
              setPaymentResult,
              conversionRate,
              services,
              rates,
              contactMatch,
              loading,
            }}
          />
        );
      case 'form':
        return (
          <RequestPaymentForm
            {...{
              selectedCurrency,
              setSelectedCurrency,
              navigation,
              getRequests,
              services,
              currencies: filteredCurrencies,
              rates,
              requestResult,
              setRequestResult,
              contactMatch,
              blankRequestsEnabled:
                actionsConfig?.request?.condition?.enableBlankRequests,
            }}
          />
        );
      default:
        break;
    }
  }

  const contactMatch = ({ email, mobile }) => {
    if (!contacts) return;
    return contacts.phone.find(
      x =>
        (email && x.contact === email) ||
        (mobile && cleanMobile(x.contact) === cleanMobile(mobile)),
    );
  };

  const headerMenuItems = [
    {
      label: 'Pending',
      selected: filter === 'Pending',
      onPress: () => setFilter('Pending'),
    },
    {
      label: 'Paid',
      selected: filter === 'Paid',
      onPress: () => setFilter('Paid'),
    },
    {
      label: 'Cancelled',
      selected: filter === 'Cancelled',
      onPress: () => setFilter('Cancelled'),
    },
  ];

  return (
    <View screen header>
      <Header
        navigation={navigation}
        customBack={state === 'form'}
        customBackFunc={() => setState('list')}
        rightMenuItems={headerMenuItems}
        back
        title={'Request payment'}
      />
      {renderContent()}
      {state === 'list' && (
        <View style={{ position: 'absolute', bottom: 15, right: 0 }}>
          <IconButton
            icon="add"
            size={50}
            padding={16}
            onPress={() => setState('form')}
          />
        </View>
      )}
    </View>
  );
}
