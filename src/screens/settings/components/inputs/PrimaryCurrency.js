import React, { useState } from 'react';
import { Formik } from 'formik';
import { View, Button } from 'components';
import { setActiveCurrency } from 'utility/rehive';
import { getCurrencyCode } from 'utility/rates';
import { useRehiveContext } from 'contexts/RehiveContext';
import CurrencySelectorCard from '../CurrencySelectorCard';
import { useToast } from 'contexts/ToastContext';
import {
  primaryCurrenciesSelector,
  conversionRatesSelector,
} from 'screens/accounts/redux/reducer';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAccounts } from 'screens/accounts/redux/actions';

export default function PrimaryCurrencyScreen(props) {
  const { navigation } = props;

  const {
    context: { services },
  } = useRehiveContext();
  const currencies = useSelector(primaryCurrenciesSelector);
  const rates = useSelector(conversionRatesSelector);
  const dispatch = useDispatch();
  const refreshAccounts = () => dispatch(fetchAccounts(services));

  const { primary } = currencies ?? {};
  const { showToast } = useToast();
  const [currency, setCurrency] = useState(primary);
  const [isSubmitting, setSubmitting] = useState(false);

  const formatValue = item => getCurrencyCode(item) + ': ' + item.description;
  const items = currencies?.items.map(item => {
    return {
      label: formatValue(item?.currency),
      value: item,
      id: item?.currency?.code,
    };
  });

  async function handleSubmit(item) {
    try {
      setSubmitting(true);
      await setActiveCurrency(item?.account, item?.currency?.code);
      refreshAccounts();

      showToast({
        text:
          'Primary currency successfully set to ' +
          getCurrencyCode(item?.currency),
        variant: 'success',
      });
      navigation.goBack();

      setSubmitting(false);
    } catch (e) {
      console.log('TCL: CryptoAddressesScreen -> handleSubmit -> e', e);
      showToast({
        text: 'Unable to update primary currency',
        variant: 'error',
      });
    }
  }

  return (
    <React.Fragment>
      <View>
        <CurrencySelectorCard
          currency={currency}
          items={items}
          rates={rates}
          updateCurrency={item => setCurrency(item)}
        />

        <View mt={1}>
          <Button
            color={'primary'}
            onPress={() => handleSubmit(currency)}
            id="save"
            loading={isSubmitting}
            wide
            disabled={
              currency?.currency?.code === primary?.currency?.code ||
              isSubmitting
            }
          />
        </View>
      </View>
    </React.Fragment>
  );
}
