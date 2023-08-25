import React from 'react';
import * as Inputs from 'config/inputs';
import { View, Text, Button } from 'components';
import { updateItem } from 'utility/rehive';
import * as Empty from 'config/empty_objects';
import { Formik } from 'formik';
import Input from 'components/inputs/FormikInput';
import { useRehiveContext } from 'contexts/RehiveContext';
import { intersectTierRequirements } from 'screens/onboarding/util';

export default function RehiveForm(props) {
  const { type, initial, onClose, onSuccess, config } = props;
  const {
    context: { tiers },
    config: { profileConfig },
  } = useRehiveContext();

  const temp = config?.fields?.length
    ? config?.fields
    : type === 'user'
    ? intersectTierRequirements({
        section: 'user-basic_info',
        tiers: tiers?.items ?? [],
        applyOverrides: true,
      })
    : Object.keys(getEmpty(type));

  const fields =
    temp?.length > 0
      ? temp.map(key => Inputs?.[type]?.[key] ?? { id: key })
      : [] ?? [];

  async function handleFormSubmit(formikProps) {
    const { values, setSubmitting, setStatus } = formikProps; // FormikProps
    setSubmitting(true);
    try {
      let data = type.match(/user|profile|central_bank/)
        ? {
            ...values,
          }
        : values;
      if (values?.nationality)
        data.nationality = values?.nationality?.cca2 ?? values?.nationalityl;
      const resp = await updateItem(type, data);
      onSuccess(resp);
    } catch (error) {
      console.log('TCL: handleFormSubmit -> error', error);
      setStatus({ error: error.message });
    }
    setSubmitting(false);
  }

  const initialValues = initial ? initial : getEmpty(type);

  const edit = Boolean(initial);
  return (
    <Formik initialValues={initialValues}>
      {formikProps => (
        <View pt={0.25}>
          {fields?.length > 0 &&
            fields.map((field, index) => {
              if (field?.id === 'id_number' && profileConfig.hideID) {
                return null;
              }
              return (
                <Input
                  key={field.id ?? field.name}
                  formikProps={formikProps}
                  field={field}
                  initialValues={initialValues}
                  // onSubmitEditing={() =>
                  //   onSubmitEditing(field.id, formikProps)
                  // }
                />
              );
            })}
          {formikProps.status && formikProps.status.error ? (
            <Text p={1} c={'error'} tA={'center'}>
              {formikProps.status.error}
            </Text>
          ) : null}
          <View mt={1} mb={2}>
            <Button
              id={edit ? 'update' : 'save'}
              color="primary"
              size="medium"
              onPress={() => handleFormSubmit(formikProps)}
              wide
              disabled={!formikProps.isValid || formikProps.isSubmitting}
              loading={formikProps.isSubmitting}
            />
            <Button
              id={'cancel'}
              buttonStyle={{ paddingTop: 0 }}
              color="authScreenContrast"
              type="text"
              onPress={onClose}
              wide
              containerStyle={{ marginTop: 18 }}
            />
          </View>
        </View>
      )}
    </Formik>
  );
}

const getEmpty = type => {
  switch (type) {
    case 'address':
      return Empty.EMPTY_ADDRESS;
    case 'bank_account':
      return Empty.EMPTY_BANK_ACCOUNT;
    case 'crypto_account':
      return Empty.EMPTY_CRYPTO;
    case 'email':
      return Empty.EMPTY_EMAIL;
    case 'mobile':
      return Empty.EMPTY_MOBILE;
    case 'central_bank':
      return Empty.EMPTY_CENTRAL_BANK_NUMBER;

    case 'user':
      return Empty.EMPTY_PROFILE;
    case 'profile':
      return { profile: '' };
    default:
      return {};
  }
};
