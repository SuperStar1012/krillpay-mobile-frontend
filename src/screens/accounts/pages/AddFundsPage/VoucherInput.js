import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

import FormikInput from 'components/inputs/FormikInput';
import ErrorOutput from 'components/outputs/ErrorOutput';
import {
  ButtonList,
  View,
  Button,
  Text,
  Spinner,
  EmptyListMessage,
} from 'components';
import PoSPlaceholderImage from 'components/outputs/CurrencyBadge/CurrencyPlaceholderImage';
import { createVoucherMoneyPayment } from 'utility/rehive';
import { Dimensions } from 'react-native';
import PlaceholderSvg from './PlaceholderSvg';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function VoucherInput(props) {
  const { formikProps, setState, currency } = props;
  const { setFieldValue, values } = formikProps;
  const { type, code } = values;

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function fetchVoucher() {
    setLoading(true);
    setError('');
    const resp = await createVoucherMoneyPayment({
      currency: get(currency, ['currency', 'code']),
      voucher_serial: code,
    });
    if (resp.status === 'success') {
      setFieldValue('voucher', resp.data);
      setLoading(false);
      setState('confirm');
    } else {
      setError('Unable to find voucher');
      setLoading(false);
    }
  }

  switch (type) {
    case 'scan':
      return <VoucherScan {...props} fetchVoucher={fetchVoucher} />;
    case 'input':
      return (
        <React.Fragment>
          <FormikInput
            formikProps={formikProps}
            field={{
              id: 'code',
              label: 'Voucher',
            }}
          />
          <ErrorOutput>{error}</ErrorOutput>

          <ButtonList
            layout="vertical"
            items={[
              {
                label: 'Redeem',
                onPress: () => fetchVoucher(formikProps),
                disabled: !code || loading,
                loading,
              },
              {
                label: 'Scan QR',
                type: 'text',
                onPress: () => setFieldValue('type', 'scan'),
              },
            ]}
          />
        </React.Fragment>
      );
    default:
      return <VoucherTypeSelector formikProps={formikProps} />;
  }
}

function VoucherTypeSelector(props) {
  const { formikProps } = props;
  const { setFieldValue } = formikProps;
  function handleSelect(type) {
    setFieldValue('type', type);
  }

  return (
    <View fD="row" jC="space-around" w="100%" pt={2}>
      <Button onPress={() => handleSelect('scan')} type="text">
        <PlaceholderSvg name="qr" label="QR code" height={90} showLabel />
      </Button>
      <Button onPress={() => handleSelect('input')} type="text">
        <PlaceholderSvg name="pin" height={90} showLabel />
      </Button>
    </View>
  );
}

function VoucherScan(props) {
  const { setState, formikProps, fetchVoucher, error } = props;
  const { setFieldValue } = formikProps;
  const [loading, setLoading] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  const handleScan = raw => {
    const { data } = raw;
    if (data) {
      fetchVoucher(data);
      setFieldValue('code', data);
      setState('confirm');
    }
  };

  useEffect(() => {
    async function checkPermissions() {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setHasCameraPermission(status === 'granted');
      setLoading(false);
    }
    checkPermissions();
  }, []);

  return (
    <View w="100%">
      {loading ? (
        <View h={SCREEN_WIDTH} w="100%" aI={'center'} jC={'center'}>
          <Spinner size={'large'} />
        </View>
      ) : hasCameraPermission ? (
        <BarCodeScanner
          onBarCodeScanned={handleScan}
          style={{ height: SCREEN_HEIGHT - 200, width: '100%', marginTop: 12 }}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        />
      ) : (
        <EmptyListMessage text="No access to camera" />
      )}
      <ErrorOutput>{error}</ErrorOutput>
      <ButtonList
        layout="vertical"
        items={[
          {
            label: 'Input code',
            type: 'text',
            onPress: () => setFieldValue('type', 'input'),
          },
        ]}
      />
    </View>
  );
}
