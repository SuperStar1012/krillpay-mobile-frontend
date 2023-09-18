import React from 'react';
import { auth as inputs } from 'config/inputs';
import { View, Button } from 'components';
import * as yup from 'yup';

import { Formik } from 'formik';
import ErrorOutput from 'components/outputs/ErrorOutput';
import FormikInput from 'components/inputs/FormikInput';
import Logo from 'components/outputs/Logo';
import { validateMobile } from 'utility/validation';
import { resetPassword } from 'utility/rehive';
import Header from 'components/layout/HeaderNew';

function validate(values, config) {
  try {
    let { mobile } = values;

    if (config.identifier === 'mobile') {
      if (mobile.indexOf('+') === -1) {
        mobile = '+' + mobile;
      }
      let error = validateMobile(mobile);
      if (error) {
        return { mobile: error };
      }
    } else {
      let schema = {};
      if (config.identifier !== 'mobile')
        schema.email = yup
          .string()
          .email('Please enter a valid email')
          .required('Email is required');

      let errors = {};
      try {
        errors = yup.object().shape(schema).validateSync(values);
      } catch (e) {
        errors = e;
      }
      if (errors.path) {
        return {
          [errors.path]: errors.message,
        };
      }
    }

    // turn this into a schema type

    return {};
  } catch (e) {
    console.log('TCL: validation -> e', e);
  }
}

export default function ForgotPasswordPage(props) {
  const { onBack, company, onAbout, showToast, authConfig, email } = props;
  const { identifier } = authConfig;

  async function handleSubmit(formikProps) {
    const { values, setSubmitting } = formikProps;
    const { email, mobile } = values;
    const user = email ? email : mobile;
    try {
      setSubmitting(true);
      await resetPassword({
        user,
        company: company.id,
      });
      showToast({
        text:
          'Instructions on how to reset your password have been sent to ' +
          user,
        duration: 3000,
      });
      onBack();
    } catch (e) {
      console.log('resetPassword', e);
      props.setFieldError('email', e.message);
    }
    setSubmitting(false);
  }

  return (
    <Formik
      initialValues={{
        email,
        mobile: '',
      }}
      validate={values =>
        validate(values, { ...authConfig, identifier: 'email' })
      }
      onSubmit={formikProps => handleSubmit(formikProps)}>
      {formikProps => (
        <React.Fragment>
          <Header handleBack={onBack} />
          <View p={1} scrollView keyboardAvoiding>
            <View pv={1} aI={'center'}>
              <Logo height={100} company={company} onAbout={onAbout} />
            </View>
            <FormikInput
              formikProps={formikProps}
              onSubmitEditing={() => handleSubmit(formikProps)}
              field={inputs?.['email']}
            />

            <ErrorOutput>
              {formikProps.status && formikProps.status.error}
            </ErrorOutput>

            <View pt={2}>
              <Button
                id={
                  'send_recovery_' + (identifier === 'mobile' ? 'sms' : 'email')
                }
                color="primary"
                size="medium"
                onPress={() => handleSubmit(formikProps)}
                wide
                disabled={!formikProps.isValid || formikProps.isSubmitting}
                loading={formikProps.isSubmitting}
              />
            </View>
          </View>
        </React.Fragment>
      )}
    </Formik>
  );
}
