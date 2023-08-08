import React from 'react';
import { View, Text, ButtonList } from 'components';
import FormikInput from 'components/inputs/FormikInput';
import { Formik } from 'formik';
import { mobile_mfa } from 'config/inputs/inputs';
import { validateMobile } from 'utility/validation';
import { enableAuthSMS } from 'utility/rehive';

export default function MfaSms(props) {
  const { profile, onBack, setModalVisible, setMobile } = props;

  async function enableAuth(mobile) {
    enableAuthSMS(mobile);
    setModalVisible(true);
    setMobile(mobile);
  }

  function validate(values) {
    const { mobile_mfa } = values;
    // if (mobile.indexOf('+') === -1) {
    //   mobile = '+' + mobile;
    // }
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
