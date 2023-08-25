import React from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';

import { View, Button, CustomIcon } from 'components';
import { createChiplessCard, updateChiplessCard } from 'utility/rehive';
import FormikInput from 'components/inputs/FormikInput';

export default function AddChiplessCardForm(props) {
  const { currency, fetchData, setState, item } = props;
  const schema = yup.object().shape({
    pin: yup
      .string()
      .min(4, 'Must be minimum 4 characters')
      .max(5, 'Must be maximum 5 characters')
      .required('Pin is required'),
  });

  async function handleSubmit(formikProps) {
    const { setSubmitting, setFieldError, values } = formikProps;
    setSubmitting(true);
    const { pin } = values;
    let data = {
      pin,
    };
    let resp = null;
    if (item && item.id) {
      resp = await updateChiplessCard(item.id, data);
    } else {
      data.account = currency?.account;
      resp = await createChiplessCard(data);
    }
    if (resp.status === 'success') {
      fetchData();
      setState('');
    } else {
      setFieldError('pin', resp.message);
    }

    setSubmitting(false);
  }

  return (
    <Formik initialValues={{ pin: '' }} validationSchema={schema}>
      {formikProps => (
        <View>
          {/* <View fD="row" w="100%"> */}
          {/* <CustomIcon */}
          <FormikInput
            formikProps={formikProps}
            field={{
              name: 'pin',
              id: 'pin',
              label: 'Card pin',
              helper: 'Must be 4 or 5 characters',
              type: 'password',
            }}
          />
          {/* </View> */}

          <View pt={1}>
            <Button
              label={item ? 'CHANGE PIN' : 'ADD CARD'}
              color="primary"
              wide
              disabled={!formikProps.isValid || formikProps.isSubmitting}
              loading={formikProps.isSubmitting}
              onPress={() => handleSubmit(formikProps)}
            />
          </View>
        </View>
      )}
    </Formik>
  );
}
