import React, { useState } from 'react';
import { auth as authInputs } from 'config/inputs';
import { View, Button, HeaderButton, Text, CustomIcon } from 'components';
import * as yup from 'yup';
import { get } from 'lodash';
import { trackFlow } from 'utility/tracking';
import { Formik } from 'formik';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { validateMobile, validateEmail } from 'utility/validation';
import FormikInput from 'components/inputs/FormikInput';
import {
  initWithoutToken,
  initWithToken,
  register,
  setRefereeCode,
} from 'utility/rehive';
import { useRehiveContext } from 'contexts/RehiveContext';
import CompanyIconAboutButton from '../components/CompanyIconAboutButton';
import AboutAppFooter from '../components/AboutAppFooter';
import FormLayout from 'components/layout/Form';
import { useKeyboard } from 'hooks/keyboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const availableIcons = ['merchant', 'supplier', 'customer'];

async function removeLocalStorage(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing item:', error);
  }
}

function useInputs(authConfig, company) {
  const {
    identifier,
    username,
    first_name,
    last_name,
    nationality,
    terms,
    confirm_password,
    birth_date,
  } = authConfig;

  //console.log(authConfig);
  const {
    context: { services },
    config: { profileConfig },
  } = useRehiveContext();

  let termsConfig = {
    id: 'terms',
    description: 'by_checking_this',
    linkText: 'privacy_policy',
    link: 'https://krillpay.com/page/privacy-policy',
    linkAction: () => {
      trackFlow('register', 'form', ['privacy policy'], 'clicked');
    },
    error: 'Please accept the terms & conditions',
    linkText2: 'terms_of_use',
    link2: 'https://krillpay.com/page/terms-and-conditions',
    link2Action: () => {
      trackFlow('register', 'form', ['terms'], 'clicked');
    },
    extra: terms,
  };

  try {
    const { settings } = company;
    if (settings.privacy_policy_url) {
      termsConfig = {
        ...termsConfig,
        link: settings.privacy_policy_url,
      };
    }
    if (settings.terms_and_conditions_url) {
      termsConfig = {
        ...termsConfig,
        link2: settings.terms_and_conditions_url,
        linkText2: 'Terms and Conditions',
      };
    }

    // termsConfig
  } catch (e) {}

  let inputs = [];
  inputs.push({ name: 'mobile' });
  inputs.push({ name: 'email' });

  if (username) {
    inputs.push({ name: 'username' });
  }
  if (first_name) {
    inputs.push({ name: 'first_name' });
  }
  if (last_name) {
    inputs.push({ name: 'last_name' });
  }
  if (nationality) {
    inputs.push({ name: 'nationality' });
  }
  inputs.push({ name: 'birth_date' });
  inputs.push({ name: 'password' });
  if (confirm_password) {
    inputs.push({ name: 'confirm_password' });
  }

  if (services?.rewards_service && profileConfig?.referral?.enabled)
    inputs.push({ name: 'referral' });

  let fields = inputs.map(input => {
    const temp = authInputs[input.name];
    return { ...temp, value: '' };
  });
  fields.push({ id: 'terms', type: 'terms', ...termsConfig });

  return { inputs, fields };
}

function validate(values, config) {
  const authConfig = config.config.auth;
  try {
    let { mobile, email } = values;

    let schema = {
      password: yup
        .string()
        .min(12, 'Password must be at least 12 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(
          /[a-zA-Z]+\d+|\d+[a-zA-Z]+/,
          'Password must contain a mixture of letters and numbers',
        )
        .matches(
          /[!@#?]/,
          'Password must contain at least one special character',
        ),
      // terms: yup
      //   .boolean()
      //   .required('Please accept terms')
      //   .oneOf([true], 'Please accept terms'),
    };

    if (mobile) {
      if (mobile.indexOf('+') === -1) {
        mobile = '+' + mobile;
      }
      let error = validateMobile(mobile);
      if (error) {
        return { mobile: error };
      }
    }

    if (email) {
      let error = validateEmail(email);
      if (error) {
        return { email: error };
      }
    }

    if (authConfig.first_name)
      schema.first_name = yup.string().required('First name is required');

    if (authConfig.last_name)
      schema.last_name = yup.string().required('Last name is required');

    if (authConfig.username)
      schema.username = yup.string().required('Username is required');

    if (authConfig.birth_date)
      schema.birth_date = yup.date().required('Date Of Birth is required');

    if (authConfig.nationality)
      schema.nationality = yup.string().required('Nationality is required');

    // if (authConfig.terms)
    //   schema.terms = yup
    //     .string()
    //     .required('Please check the terms & conditions');

    if (authConfig.confirm_password)
      schema.confirm_password = yup
        .string()
        .min(12, 'Password must be at least 12 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(
          /[a-zA-Z]+\d+|\d+[a-zA-Z]+/,
          'Password must contain a mixture of letters and numbers',
        )
        .matches(
          /[!@#?]/,
          'Password must contain at least one special character',
        );

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

    return {};
  } catch (e) {
    console.log('TCL: validation -> e', e);
  }
}

export default function RegisterPage(props) {
  const {
    authConfig,
    company,
    onBack,
    onGroup,
    onSuccess,
    email,
    onLogin,
    setTempAuth,
    tempAuth,
  } = props;
  const { fields } = useInputs(authConfig, company, useEmailToRegister);
  const { group = {}, noGroups } = tempAuth;
  const { name, label, icon } = group;
  const [retryingRefereeCode, setRetryingRefereeCode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [useEmailToRegister, setUseEmailToRegister] = useState(false);
  const [showFormSubmitError, setShowFormSubmitError] = useState(false);

  const steps = [
    {
      title: `Enter your ${
        useEmailToRegister ? 'email address' : 'mobile number'
      } to continue`,
      fields: useEmailToRegister ? ['email'] : ['mobile'],
    },
    {
      title: 'Enter your first and last name to continue',
      fields: ['first_name', 'last_name'],
    },
    {
      title: `Hello ${firstName}, welcome to KrillPay. \nWhat's your date of birth?`,
      fields: ['birth_date'],
    },
    {
      title:
        'Please choose a @krilltag. Your unique identifier to receive payments from anyone.',
      fields: ['username'],
    },
    {
      title: 'Create a strong password to protect your account',
      fields: ['password'],
    },
  ];

  // const test1 = JSON.stringify(steps);

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const backIcon = icon
    ? icon
    : availableIcons.includes(name)
    ? name
    : name === 'business'
    ? 'merchant'
    : 'user';

  async function handleSubmit(formikProps) {
    const { setStatus, setFieldValue, setFieldTouched, values, setSubmitting } =
      formikProps;
    setSubmitting(true);
    const {
      email,
      password,
      confirm_password,
      terms,
      company,
      first_name,
      last_name,
      birth_date,
      mobile,
      username,
      nationality,
      referral,
    } = values;

    const { group } = tempAuth;

    const formattedUsername = username.startsWith('@')
      ? username.substring(1)
      : username;

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
        company,
        email,
        mobile,
        first_name,
        birth_date,
        last_name,
        username: formattedUsername,
        language: authConfig?.language ? authConfig?.language : 'en',
        password1: password,
        password2: authConfig.confirm_password ? confirm_password : password,
        terms_and_conditions: true,
        privacy_policy: true,
        groups: [group ? group.name : ''],
      };
      if (allow_session_durations && typeof session_duration === 'number') {
        data.session_duration = session_duration;
      }
      if (nationality) {
        data.nationality = nationality;
      }

      if (!retryingRefereeCode) {
        initWithoutToken();
        response = await register(data);
        setTempAuth({ ...response, register: true });
        initWithToken(response.token);
      }

      if (referral)
        attachRefereeCode({ code: referral, setStatus })
          .then(() => onSuccess())
          .catch(error => console.log(error))
          .finally(() => setSubmitting(false));
      else onSuccess();
    } catch (error) {
      setFieldValue('password', '');
      setFieldTouched('password', false);
      setFieldValue('confirm_password', '');
      setFieldTouched('confirm_password', false);
      setCurrentStep(0);
      setShowFormSubmitError(true);
      setStatus({ error: error.message });
      console.log(error);
    } finally {
      trackFlow('register', 'form', null, 'submitted', {
        success,
      });
      setSubmitting(false);
      removeLocalStorage('get-verified');
    }
  }

  function attachRefereeCode({ code, setStatus }) {
    return new Promise((resolve, reject) => {
      setRefereeCode(code).then(resp => {
        if (resp.status === 'error') {
          setStatus({
            error:
              resp.message === 'Invalid referee code.'
                ? 'Invalid referral code'
                : resp.message,
          });
          setRetryingRefereeCode(true);
          reject();
        }
        resolve();
      });
    });
  }
  const { keyboardHeight } = useKeyboard();

  return (
    <Formik
      initialValues={{
        email: '',
        mobile: '',
        company: company.id,
        password: '',
        birth_date: '',
        confirm_password: '',
        nationality: authConfig.defaultNationality,
        first_name: '',
        last_name: '',
        username: '@',
        merchant: false,
        terms: false,
      }}
      validate={values => validate(values, company)}
      onSubmit={formikProps => handleSubmit(formikProps)}>
      {formikProps => (
        <FormLayout
          config={{
            title: 'register_title',
          }}
          onBack={() => (group && !noGroups ? onGroup() : onBack())}
          // footer={

          // }
          id="register"
          headerProps={{
            rightAction: <CompanyIconAboutButton {...props} />,
          }}>
          <View f={1} pb={0.0001}>
            {fields.map((field, index) => {
              if (!steps[currentStep].fields.includes(field.id)) {
                return null;
              }

              return (
                <View f={1} key={index}>
                  {(steps[currentStep].fields.length == 1 ||
                    field.id == 'first_name') && (
                    <Text
                      style={{
                        textAlign: 'center',
                        marginBottom: 20,
                      }}>
                      {steps[currentStep].title}
                    </Text>
                  )}
                  <FormikInput
                    formikProps={formikProps}
                    key={field.id}
                    field={{
                      ...field,
                      disabled: retryingRefereeCode && field.id !== 'referral',
                    }}
                    onChange={value => {
                      formikProps.setFieldValue(field.id, value);
                      if (field.id === 'first_name') setFirstName(value);
                    }}
                  />
                  {currentStep == 0 && (
                    <View>
                      <ErrorOutput>
                        {formikProps.status && formikProps.status.error}
                      </ErrorOutput>
                    </View>
                  )}
                  <View
                    f={1}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 20,
                    }}>
                    {steps[currentStep].fields.length == 1 && (
                      <>
                        {currentStep != 0 && (
                          <Button
                            id={'Back'}
                            color="primary"
                            size="medium"
                            onPress={() => {
                              handlePrevStep();
                            }}
                            loading={formikProps.isSubmitting}
                          />
                        )}
                        {currentStep == 0 && <Text />}
                        {currentStep < steps.length - 1 && (
                          <Button
                            id={'Next'}
                            color="primary"
                            size="medium"
                            onPress={() => {
                              handleNextStep();
                            }}
                            disabled={
                              !formikProps.values[field.id] ||
                              validate(formikProps.values, company)[field.id]
                                ? true
                                : false
                            }
                            loading={formikProps.isSubmitting}
                          />
                        )}
                        {currentStep == steps.length - 1 && (
                          <Button
                            id={'Next'}
                            color="primary"
                            size="medium"
                            onPress={async () => {
                              await handleSubmit(formikProps);
                            }}
                            disabled={
                              !formikProps.values[field.id] ||
                              validate(formikProps.values, company)[field.id]
                                ? true
                                : false
                            }
                            loading={formikProps.isSubmitting}
                          />
                        )}
                      </>
                    )}
                    {steps[currentStep].fields.length != 1 &&
                      field.id != 'first_name' && (
                        <>
                          {currentStep != 0 && (
                            <Button
                              id={'Back'}
                              color="primary"
                              size="medium"
                              onPress={() => {
                                handlePrevStep();
                              }}
                              loading={formikProps.isSubmitting}
                            />
                          )}
                          <Button
                            id={'Next'}
                            color="primary"
                            size="medium"
                            onPress={() => {
                              handleNextStep();
                            }}
                            disabled={
                              !formikProps.values[fields[index - 1].id] ||
                              !formikProps.values[field.id] ||
                              validate(formikProps.values, company)[
                                fields[index - 1].id ? true : false
                              ] ||
                              validate(formikProps.values, company)[field.id]
                                ? true
                                : false
                            }
                            loading={formikProps.isSubmitting}
                          />
                        </>
                      )}
                  </View>
                </View>
              );
            })}
          </View>
        </FormLayout>
      )}
    </Formik>
  );
}

{
  /* <HeaderBackButton
            handleBack={() => (group && showGroups ? onGroup() : onBack())}>
            {showGroups && (
              <React.Fragment>
                {Boolean(backIcon) && <CustomIcon name={backIcon} size={24} />}
                <Text
                  style={{ paddingLeft: 8 }}
                  id={label ? label : standardizeString(name)}></Text>
              </React.Fragment>
            )}
          </HeaderBackButton> */
}
