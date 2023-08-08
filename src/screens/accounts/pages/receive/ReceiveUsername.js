import React from 'react';
import { View, Button, TextField, Text } from 'components';
import { get } from 'lodash';
import { setStellarUsername } from 'utility/rehive';
import { useDispatch } from 'react-redux';
import { fetchCrypto } from '@redux/actions';

export default function ReceiveUsername(props) {
  const { setFormState, formikProps, showToast, context, refreshUser } = props;
  const {
    isSubmitting,
    isValid,
    values,
    setSubmitting,
    setFieldError,
    setFieldValue,
    setFieldTouched,
  } = formikProps;
  const { wallet } = context;

  const dispatch = useDispatch();

  async function submitUsername() {
    const { username, currency } = values;
    setSubmitting(true);

    try {
      let response = await setStellarUsername(
        { username },
        currency.crypto === 'TXLM',
      );
      if (response.status === 'success') {
        dispatch(fetchCrypto(currency.currency.code));
        showToast({ type: 'success', id: 'username_set' });
        refreshUser();
        setFormState('');
      } else {
        setFieldError(
          'username',
          get(
            response,
            ['data', 'username', 'error'],
            'Unable to set username',
          ),
        );
      }
    } catch (error) {
      console.log('submitUsername error', error);
      setFieldError('username', error.message);
    }
    setSubmitting(false);
  }

  return (
    <View p={1} f={1} jC={'space-between'} ph={1.5}>
      <View>
        <Text
          // t={'h5'}
          s={20}
          tA={'center'}
          paragraph
          id={
            wallet?.currency?.code === 'XLM'
              ? 'set_stellar_username'
              : 'set_stellar_testnet_username'
          }
        />
        <Text
          tA={'center'}
          id="set_stellar_username_description"
          paragragh
          // t="b2"
        />
        <TextField
          label={'Username'}
          value={values.username}
          error={formikProps.touched.username && formikProps.errors.username}
          onChangeText={value => setFieldValue('username', value)}
          onBlur={() => setFieldTouched('username')}
          onSubmitEditing={submitUsername}
          selectTextOnFocus
          spellCheck={false}
          name={'Username'}
          key={'Username'}
          autoCapitalize={'none'}
        />
      </View>
      <View pt={0.5}>
        <Button
          id={'submit'}
          color={'primary'}
          wide
          onPress={submitUsername}
          disabled={isSubmitting || !isValid || values.username.length === 0}
          loading={isSubmitting}
        />
        <Button id="cancel" type="text" wide onPress={() => setFormState('')} />
      </View>
    </View>
  );
}
