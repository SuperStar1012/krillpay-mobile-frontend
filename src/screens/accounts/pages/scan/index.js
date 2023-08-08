import React from 'react';

import QRCodeScanner from '../../components/QRCodeScanner';
import { useSelector } from 'react-redux';
import { currenciesSelector } from 'screens/accounts/redux/reducer';
import HeaderNew from 'components/layout/HeaderNew';
import { View } from 'components';
import { IsUuid } from 'utility/validation';
import { useToggle } from 'utility/hooks';

export default function ScanPage(props) {
  const { navigation, route } = props;
  const { value, setFalse, setTrue } = useToggle();
  const { currency } = route?.params ?? {};
  function onScanSuccess(values) {
    if (!value) {
      setTrue();
      if (
        values.name ||
        values.request_id ||
        values.request ||
        IsUuid(values.recipient)
      ) {
        navigation.replace('Pay', { currency, ...values });
      } else {
        navigation.replace('Send', { currency, ...values });
      }
      setFalse;
    }
  }

  const currencies = useSelector(currenciesSelector);

  return (
    <View screen>
      <HeaderNew bC={'white'} navigation={navigation} pb={0.5} />
      <QRCodeScanner
        currency={currency}
        onSuccess={values => onScanSuccess(values, props)}
        currencies={currencies}
        account={currency?.account}
      />
    </View>
  );
}
