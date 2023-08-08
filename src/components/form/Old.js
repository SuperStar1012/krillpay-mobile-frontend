import React from 'react';
import * as Inputs from 'config/inputs/inputs';
import { View, Text, Button } from 'components';
import { updateItem } from 'utility/rehive';

import * as Empty from 'config/empty_objects';

import { Formik } from 'formik';

import Input from 'components/inputs/FormikInput';

export default function (props) {
  const {
    initial,
    config,
    type,
    onSaveSuccess,
    onDetailClose,
    profileConfig,
  } = props;

  async function handleFormSubmit(props) {
    const { values, setSubmitting, setStatus } = props; // FormikProps
    setSubmitting(true);
    try {
      await updateItem(type, values);
      onSaveSuccess();
      onDetailClose();
    } catch (error) {
      console.log('TCL: handleFormSubmit -> error', error);
      setStatus({ error: error.message });
    }
    setSubmitting(false);
  }

  // onSubmitEditing(index, props) {
  //   const { fields } = this.state;

  //   try {
  //     if (fields?.length > index + 1) {
  //       this[fields[index + 1].id].focus();
  //     } else {
  //       // if (props.isValid) {
  //       this.handleFormSubmit(props);
  //       // } else {
  //       //   props.validateForm();
  //       // }
  //     }
  //   } catch (e) {
  //     console.log('onSubmitEditing', e);
  //   }
  // }

  const initialValues = initial ? initial : getEmpty(type);
  const { fields, onSubmitLabel, component } = config;

  const inputs = fields.map(key => Inputs?.[key]);

  return (
    <Formik initialValues={initialValues}>
      {formikProps => (
        <View pt={0.25}>
          {inputs.map((input, index) => {
            {
              /* if (field.id === 'id_number' && profileConfig.hideID) {
              return null;
            } */
            }
            return (
              <Input
                field={input}
                key={input.name}
                formikProps={formikProps}
                // {...restProps}
              />
            );
          })}
          {props.status && props.status.error ? (
            <Text p={1} c={'error'} tA={'center'}>
              {props.status.error}
            </Text>
          ) : null}
          <View mt={1}>
            <Button
              label={'SAVE'}
              color="primary"
              size="medium"
              onPress={() => handleFormSubmit(props)}
              wide
              disabled={!props.isValid || props.isSubmitting}
              loading={props.isSubmitting}
            />
            <Button
              label={'Cancel'}
              buttonStyle={{ paddingTop: 0 }}
              color="authScreenContrast"
              type="text"
              onPress={onDetailClose}
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
    case 'profile':
      return Empty.EMPTY_PROFILE;
    default:
      return {};
  }
};
