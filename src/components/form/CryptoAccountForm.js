import React from 'react';
import { crypto_account } from 'config/inputs';
import { View, Button } from 'components';
import { updateItem } from 'utility/rehive';
import { EMPTY_CRYPTO } from 'config/empty_objects';

import { Formik } from 'formik';
import { standardizeString, cryptoCodeToType } from 'utility/general';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { validateCrypto2 } from 'utility/validation';
import RadioSelector from 'components/inputs/RadioSelector';
import FormikInput from 'components/inputs/FormikInput';
import { useRehiveContext } from 'contexts/RehiveContext';

export default function CryptoAccountForm(props) {
  const { item, currency, listType, type, onSuccess } = props;
  const {
    context: { services },
  } = useRehiveContext();

  const handleSubmit = async formikProps => {
    const { values, setSubmitting, setStatus } = formikProps; // FormikProps
    let {
      name,
      testnet,
      memo,
      memoSkip,
      address,
      stellarTransactionType,
      crypto_type,
    } = values;
    if (!crypto_type) crypto_type = listType;
    setSubmitting(true);
    if (
      crypto_type.match(/stellar/) &&
      stellarTransactionType === 'public' &&
      !(memo || memoSkip)
    ) {
      setStatus({ error: 'Please include a memo or check no memo required' });
    } else {
      const data = {
        address,
        // metadata: { testnet, name },
        name,
        network: testnet ? 'testnet' : 'mainnet',
        crypto_type: crypto_type ? crypto_type : cryptoCodeToType(type),
      };
      if (values.memo && stellarTransactionType === 'public') {
        data.metadata = { ...data.metadata, memo };
      }
      if (item) {
        data.id = item.id;
      }
      try {
        const resp = await updateItem('crypto_account', data);
        onSuccess(resp);
      } catch (error) {
        setStatus({ error: error.message });
      }
    }
    setSubmitting(false);
  };

  // function onSubmitEditing(index, formikProps) {

  //   try {
  //     if (fields?.length > index + 1) {
  //       this[fields[index + 1].id].focus();
  //     } else {
  //       handleFormSubmit(formikProps);
  //     }
  //   } catch (e) {
  //     console.log('onSubmitEditing', e);
  //   }
  // }

  function renderInput(formikProps, item) {
    return <FormikInput formikProps={formikProps} field={item} />;
  }

  function validation(values) {
    let {
      address,
      stellarTransactionType,
      testnet,
      crypto_type,
      memo,
      memoSkip,
    } = values;
    if (!crypto_type) crypto_type = listType;
    const error = validateCrypto2(address, crypto_type, testnet);

    if (error) {
      return { address: error };
    }
    if (crypto_type.match(/stellar/)) {
      if (
        stellarTransactionType === 'federation' &&
        address.indexOf('*') === -1
      )
        return { address: 'Not a valid federated stellar address' };
      else if (!memo && !memoSkip)
        return { address: 'Please include a memo or check no memo required' };
    }
  }

  let initialValues = {};
  let cryptoTypes = [];
  let crypto = listType;
  const formatValue = item => item.label;

  if (item) {
    initialValues = {
      address: item?.address,
      crypto_type: item?.crypto_type ?? listType,
      name: item?.name ?? '',
      memo: item?.metadata?.memo ?? '',
    };
    crypto = item?.crypto_type;
  } else {
    crypto = cryptoTypes[0] ? cryptoTypes[0].value : crypto;
    initialValues = { ...EMPTY_CRYPTO, crypto_type: crypto };
  }
  const cryptoName = standardizeString(crypto);

  if (services) {
    if (crypto === 'stellar') {
      initialValues.stellarTransactionType =
        item?.address?.indexOf('*') !== -1 ? 'federation' : 'public';
    }
    initialValues.testnet = item
      ? item?.network ?? '' === 'testnet'
      : !services[cryptoName + ' Service'];
  } else if (currency && currency.crypto) {
    initialValues = {
      ...initialValues,
      testnet:
        (currency && currency.crypto[0] === 'T') ||
        services[cryptoName + ' Testnet Service'],
      stellarTransactionType: 'public',
    };
  }

  const showNetwork = formikProps =>
    services[standardizeString(formikProps.values.crypto_type) + ' Service'] &&
    services[
      standardizeString(formikProps.values.crypto_type) + ' Testnet Service'
    ];

  return (
    <Formik
      validate={values => validation(values)}
      initialValues={initialValues}>
      {formikProps => (
        <View>
          <View w={'100%'}>
            {showNetwork(formikProps) && (
              <RadioSelector
                title="Network"
                items={[
                  { value: 'mainnet', label: 'Mainnet' },
                  { value: 'testnet', label: 'Testnet' },
                ]}
                value={formikProps.values.testnet ? 'testnet' : 'mainnet'}
                handleChange={value =>
                  formikProps.setFieldValue('testnet', value === 'testnet')
                }
              />
            )}
            {formikProps.values.crypto_type === 'stellar' && (
              <RadioSelector
                title="address_type"
                items={[
                  { value: 'public', label: 'public_address_memo' },
                  { value: 'federation', label: 'federation_address' },
                ]}
                handleChange={value =>
                  formikProps.setFieldValue('stellarTransactionType', value)
                }
                value={formikProps.values.stellarTransactionType}
              />
            )}
            {renderInput(formikProps, crypto_account?.name)}
            {renderInput(formikProps, {
              ...crypto_account?.address,
              placeholder:
                formikProps.values.stellarTransactionType === 'federation'
                  ? 'e.g. username*domain.com'
                  : crypto_account?.address?.placeholder,
            })}
            {formikProps.values.crypto_type === 'stellar' &&
              formikProps.values.stellarTransactionType === 'public' && (
                <View w={'100%'}>
                  {!formikProps.values.memoSkip &&
                    renderInput(formikProps, crypto_account?.memo)}
                  {!formikProps.values.memo &&
                    renderInput(formikProps, crypto_account?.memoSkip)}
                </View>
              )}

            <ErrorOutput>
              {formikProps.status && formikProps.status.error}
            </ErrorOutput>
          </View>
          <View mt={1} mb={2}>
            <Button
              id={'save'}
              color="primary"
              size="medium"
              onPress={() => handleSubmit(formikProps)}
              wide
              disabled={!formikProps.isValid || formikProps.isSubmitting}
              loading={formikProps.isSubmitting}
            />
            {/* <Button
              label={'Cancel'}
              buttonStyle={{ paddingTop: 0 }}
              color="authScreenContrast"
              type="text"
              onPress={onClose}
              wide
              containerStyle={{ marginTop: 18 }}
            /> */}
          </View>
        </View>
      )}
    </Formik>
  );
}
