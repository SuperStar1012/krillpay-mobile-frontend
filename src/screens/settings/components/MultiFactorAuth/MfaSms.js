import React from 'react';
import { View, Text, ButtonList } from 'components';
import FormikInput from 'components/inputs/FormikInput';
import { Formik } from 'formik';
import { mobile_mfa } from 'config/inputs/inputs';
import { validateMobile } from 'utility/validation';
import { createMFAAuthenticator, deleteMfaAuthenticator } from 'utility/rehive';

export default function MfaSms(props) {
  const { profile, onBack, setModalVisible, setMobile, sms, setSms } = props;

  async function enableAuth(mobile) {
    /*
    sms is the authenticator object. when sms is exist and mobile is the same as sms mobile then we don't need
    to create new authenticator, we just show the verify modal. But, if the user update the mobile number then
    we delete the previous authenticator and create a new one.
    */
    try {
      if (mobile !== sms?.details?.mobile) {
        if (sms) {
          await deleteMfaAuthenticator(sms.id);
        }
        const _sms = await createMFAAuthenticator('sms', { mobile });
        setSms(_sms);
        setMobile(mobile);
      }
      setModalVisible(true);
    } catch (error) {
      console.log(error);
    }
  }

  function validate(values) {
    const { mobile_mfa } = values;
    let error = validateMobile(mobile_mfa);
    if (error) {
      return { mobile_mfa: error };
    }
  }

  const buttons = formikProps => {
    return [
      {
        id: 'enable',
        disabled: !formikProps.isValid,
        onPress: () => enableAuth(formikProps.values.mobile_mfa),
      },
      { id: 'back', onPress: onBack, type: 'text' },
    ];
  };

  return (
    <View>
      <Text tA={'center'} id="mfa_sms_description" />
      <Formik
        initialValues={{
          mobile_mfa: profile.mobile,
        }}
        isInitialValid={profile.mobile}
        validate={values => validate(values)}>
        {formikProps => (
          <View pt={1}>
            <FormikInput formikProps={formikProps} field={mobile_mfa} />
            <ButtonList items={buttons(formikProps)} pt={1.5} />
          </View>
        )}
      </Formik>
    </View>
  );
}
