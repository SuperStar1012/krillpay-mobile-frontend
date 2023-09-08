import React, { useRef } from 'react';
import { auth as authInputs } from 'config/inputs';
import { View, Button } from 'components';
import * as yup from 'yup';
import { get } from 'lodash';
import { trackFlow } from 'utility/tracking';
import { Formik } from 'formik';
import { Text } from 'react-native';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { validateMobile } from 'utility/validation';
import FormikInput from 'components/inputs/FormikInput';
import Logo from 'components/outputs/Logo';
import { initWithoutToken, login, initWithToken } from 'utility/rehive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormLayout from 'components/layout/Form';
import AboutAppFooter from '../components/AboutAppFooter';
import { useKeyboard } from 'hooks/keyboard';

function useInputs(authConfig) {
  const { identifier } = authConfig;

  let inputs = [];
  inputs.push({ name: identifier === 'mobile' ? identifier : 'email' });
  inputs.push({ name: 'password' });

  const fields = inputs.map(input => {
    const temp = authInputs[input.name];
    return { ...temp, value: '' };
  });
  return { inputs, fields };
}

function validate(values, config) {
  try {
    let { mobile } = values;

    let schema = {
      password: yup
        .string()
        .min(8, 'Must be more than 8 characters')
        .required('Password is required'),
    };

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

    // turn this into a schema type
    if (config.identifier === 'mobile') {
      if (mobile.indexOf('+') === -1) {
        mobile = '+' + mobile;
      }
      let error = validateMobile(mobile);
      if (error) {
        return { mobile: error };
      }
    }

    return {};
  } catch (e) {
    console.log('TCL: validation -> e', e);
  }
}

export default function LoginPage(props) {
  const {
    authConfig,
    company,
    onBack,
    onAbout,
    onSuccess,
    email,
    onRegister,
    onForgot,
    setTempAuth,
    onGroup,
  } = props;
  const { fields } = useInputs(authConfig);
  const passwordFieldRef = useRef();
  function onSubmitEditing(fieldID, formikProps) {
    try {
      if (
        fieldID !== 'password' &&
        typeof passwordFieldRef?.focus === 'function'
      ) {
        passwordFieldRef.focus();
      } else {
        if (formikProps.isValid) {
          handleSubmit(formikProps);
        } else {
          formikProps.validateForm();
        }
      }
    } catch (e) {
      console.log('onSubmitEditing', e);
    }
  }

  async function handleSubmit(formikBag) {
    const { setStatus, setFieldValue, setFieldTouched, values, setSubmitting } =
      formikBag;
    const { email, password, company: companyId, mobile } = values;
    // setSubmitting(true);
    const allow_session_durations = get(
      company,
      ['settings', 'allow_session_durations'],
      false,
    );
    const session_duration =
      authConfig?.session_duration?.mobile ?? authConfig?.session_duration;

    let success = false;

    try {
      let response;
      let data = {
        company: companyId,
        user: authConfig.identifier === 'mobile' ? mobile : email,
        password,
      };
      if (allow_session_durations && typeof session_duration === 'number') {
        data.session_duration = session_duration;
      }
      initWithoutToken();
      response = await login(data);
      setTempAuth(response);
      initWithToken(response.token);
      await AsyncStorage.setItem('user_info', JSON.stringify(response.user));
      await AsyncStorage.setItem('user_token', response.token);
      onSuccess();
      success = true;
    } catch (error) {
      console.log('handleSubmit', error);
      setFieldValue('password', '');
      setFieldTouched('password', false);
      setStatus({ error: error.message });
    } finally {
      trackFlow('login', 'form', null, 'submitted', {
        success,
      });
    }
    setSubmitting(false);
  }

  const { keyboardHeight } = useKeyboard();

  return (
    <Formik
      initialValues={{
        email: '',
        mobile: '',
        company: company.id,
        password: '',
      }}
      validate={values => validate(values, authConfig)}
      onSubmit={formikProps => handleSubmit(formikProps)}>
      {formikProps => (
        <FormLayout
          config={{
            title: 'login_title',
            description: 'login_description',
          }}
          onBack={onBack}
          imageComp={
            <View p={1} aI={'center'}>
              <Logo
                height={100}
                width={100}
                company={company}
                onAbout={onAbout}
              />
            </View>
          }
          // footer={

          // }
          id="register"
          // headerProps={{
          //   rightAction: <CompanyIconAboutButton {...props} />,
          // }}
        >
          <View jC="space-between">
            {fields.map(field => (
              <FormikInput
                // ref={refs[field.id]}
                key={field.id}
                formikProps={formikProps}
                field={field}
                hideHelper={true}
                onSubmitEditing={() => onSubmitEditing(field.id, formikProps)}
              />
            ))}

            <View fD={'row'} jC={'flex-end'}>
              <Button
                id={'forgot_password'}
                color="authScreenContrast"
                buttonStyle={{ paddingTop: 0, paddingRight: 0 }}
                type="text"
                onPress={() => {
                  trackFlow('login', 'form', ['forgot password'], 'clicked');
                  onForgot(formikProps?.values?.email ?? '');
                }}
                animation="fadeIn"
              />
            </View>

            <ErrorOutput>
              {formikProps.status && formikProps.status.error}
            </ErrorOutput>
            <View pv={0.5} w="100%">
              {/* <View fD="row" w="100%" f={1}> */}

              {/* <View f={1} pl={authConfig.disableRegister ? 0 : 0.5}> */}
              <Button
                id="login"
                color="primary"
                size="medium"
                onPress={() => handleSubmit(formikProps)}
                wide
                disabled={!formikProps.isValid || formikProps.isSubmitting}
                loading={formikProps.isSubmitting}
              />
              {/* </View> */}
              {/* </View> */}
              {!authConfig.disableRegister && (
                <View f={1}>
                  <Text></Text>
                  <Button
                    id={'sign_up'}
                    // buttonStyle={{ marginVertical: 8 }}
                    type="outlined"
                    onPress={() => {
                      trackFlow(
                        'login',
                        'form',
                        ['register button'],
                        'clicked',
                      );
                      const email = formikProps?.values?.email ?? '';
                      authConfig.group ? onGroup(email) : onRegister(email);
                    }}
                    wide
                  />
                </View>
              )}
              {!keyboardHeight && <AboutAppFooter {...props} />}
            </View>

            {/* <View pv={1} h={160}>
              <Button
                label={'LOG IN'}
                color="primary"
                size="medium"
                onPress={() => handleSubmit(formikProps)}
                wide
                disabled={!formikProps.isValid || formikProps.isSubmitting}
                loading={formikProps.isSubmitting}
              />
            </View> */}
          </View>
        </FormLayout>
      )}
    </Formik>
  );
}
