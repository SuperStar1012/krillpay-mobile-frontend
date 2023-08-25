import React, { useState } from 'react';

import QRCodeScanner from 'screens/accounts/components/QRCodeScanner';

import { View, HeaderButton, Spinner } from 'components';
import Header from 'components/layout/HeaderNew';
import RedeemVoucherError from './RedeemVoucherError';
import RedeemVoucherFormInputs from './RedeemVoucherFormInputs';
import RedeemVoucherPost from './RedeemVoucherPost';

export default function RedeemVoucherForm(props) {
  const { config, navigation, context, formikProps } = props;

  const enableScan = true;
  const [formState, setFormState] = useState(enableScan ? 'qr' : '');
  const { configs, id, title = id, onConfirmLoad, onSubmit } = config;

  const [loading, setLoading] = useState(false);

  function handleSubmit(code) {
    setLoading(true);
    onConfirmLoad
      ? onConfirmLoad({ formikProps, context, setLoading, code })
      : null;
    setFormState('confirm');
  }

  function onScanSuccess(values) {
    const { recipient } = values;
    if (recipient) {
      formikProps.setFieldValue('code', recipient);
    }

    handleSubmit(recipient);
  }

  function resetForm() {
    const { setStatus, setFieldValue } = formikProps;
    setStatus(null);
    setFieldValue('code', '');
    setFormState(enableScan ? 'qr' : '');
  }

  const result = formikProps?.status?.result;
  const isPost = formState === 'confirm' || result;

  function handleBack() {
    if (formState === 'confirm' && !result) setFormState('');
    else navigation.goBack();
  }

  return (
    <View screen>
      <Header
        navigation={props.navigation}
        title={isPost ? '' : title}
        handleBack={handleBack}
        back
        pb={formState === 'qr' ? 0.5 : 0}
        bC={isPost ? 'background' : 'white'}
        backIcon={{
          set: 'SimpleLineIcons',
          name: 'grid',
          size: 20,
          color: 'primary',
          style: { padding: 4 },
        }}
        actions={
          isPost ? null : (
            <HeaderButton
              containerStyle={{
                paddingBottom: formState === 'qr' ? 4 : 0,
                paddingRight: formState === 'qr' ? 20 : 18,
                paddingTop: formState === 'qr' ? 10 : 8,
              }}
              size={formState === 'qr' ? 22 : 27}
              color={'font'}
              onPress={() => setFormState(formState === 'qr' ? '' : 'qr')}
              set={'MaterialCommunityIcons'}
              icon={formState === 'qr' ? 'qrcode-edit' : 'qrcode'}
            />
          )
        }
      />
      {loading ? (
        <View p={1}>
          <Spinner />
        </View>
      ) : formState === 'qr' ? (
        <QRCodeScanner onSuccess={values => onScanSuccess(values)} />
      ) : formikProps.status && formikProps.status.error ? (
        <RedeemVoucherError
          {...props}
          onBack={resetForm}
          formikProps={formikProps}
        />
      ) : result || formState === 'confirm' ? (
        <RedeemVoucherPost
          {...props}
          result={result}
          onBack={handleBack}
          config={configs?.post}
          formikProps={formikProps}
          onNext={onSubmit}
        />
      ) : (
        <RedeemVoucherFormInputs
          {...props}
          config={configs?.form}
          formikProps={formikProps}
          onSubmit={handleSubmit}
        />
      )}
    </View>
  );
}
