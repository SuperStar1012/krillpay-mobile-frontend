import React, { useState } from 'react';

import QRCodeScanner from 'screens/accounts/components/QRCodeScanner';

import { View, HeaderButton, Spinner } from 'components';
import Header from 'components/layout/HeaderNew';
import TopUpFormError from './TopUpError';
import TopUpFormFormInputs from './TopUpInputs';
import TopUpFormPost from './TopUpPost';
import { useForm } from 'react-hook-form';

export default function TopUpForm(props) {
  const { config, navigation, context } = props;
  const [formState, setFormState] = useState('');
  const { configs, id, title = id, onConfirmLoad, onSubmit } = config;

  const [isSubmitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const { wallets, rates } = context;

  const form = useForm({
    defaultValues: {
      accountRef: wallets?.accountsDictionary?.teller ?? wallets.primaryAccount,
      currencyCode: 'USD',
      reValidateMode: 'onChange',
      amount: '',
    },
  });

  const { accountRef, currencyCode } = form.watch();

  const account = wallets?.accounts?.[accountRef];
  const wallet = account?.currencies?.[currencyCode];

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const resp = await onSubmit(form, wallet);
      setResult(resp);
    } catch (e) {
      form.setError('form', e.message);
    }
    setSubmitting(false);
  }

  function onScanSuccess(values) {
    const { recipient, amount = '' } = values;
    if (recipient) {
      form.setValue('recipient', recipient);
      if (amount) form.setValue('amount', amount);
      setFormState('');
    }
  }

  function resetForm() {
    form.setValue('recipient', '');
    form.setValue('amount', '');
    setFormState('');
  }

  const isPost = result;

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
        bC={isPost ? 'background' : 'white'}
        backIcon={{
          set: 'SimpleLineIcons',
          name: 'grid',
          size: 20,
          color: 'primary',
          style: { padding: 4 },
        }}
        pb={formState === 'qr' ? 0.5 : 0}
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
      {formState === 'qr' ? (
        <QRCodeScanner onSuccess={onScanSuccess} />
      ) : form.formState.errors?.form || result?.status === 'error' ? (
        <TopUpFormError
          {...props}
          onBack={resetForm}
          form={form}
          result={result}
        />
      ) : result ? (
        <TopUpFormPost
          {...props}
          result={result}
          onBack={handleBack}
          config={configs?.post}
        />
      ) : (
        <TopUpFormFormInputs
          {...props}
          form={form}
          wallet={wallet}
          config={{ validation: true, hideAmount: true }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </View>
  );
}
