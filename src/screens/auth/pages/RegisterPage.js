import React, { useState } from 'react';
import { auth as authInputs } from 'config/inputs';
import { View, Button, HeaderButton, Text, CustomIcon } from 'components';
import * as yup from 'yup';
import { get } from 'lodash';
import { trackFlow } from 'utility/tracking';
import { Formik } from 'formik';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { validateMobile } from 'utility/validation';
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

const availableIcons = ['merchant', 'supplier', 'customer'];

function useInputs(authConfig, company) {
  const {
    identifier,
    username,
    first_name,
    last_name,
    nationality,
    terms,
    confirm_password,
  } = authConfig;

  const {
    context: { services },
    config: { profileConfig },
  } = useRehiveContext();

  let termsConfig = {
    id: 'terms',
    description: 'by_checking_this',
    linkText: 'privacy_policy',
    link: 'https://www.iubenda.com/privacy-policy/83456137',
    linkAction: () => {
      trackFlow('register', 'form', ['privacy policy'], 'clicked');
    },
    error: 'Please accept the terms & conditions',
    linkText2: 'terms_of_use',
    link2: 'https://rehive.com/end-user-terms/',
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
  inputs.push({ name: identifier === 'mobile' ? identifier : 'email' });

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
    let { mobile } = values;
    let schema = {
      password: yup
        .string()
        .min(8, 'Must be more than 8 characters')
        .required('Password is required'),
      terms: yup
        .boolean()
        .required('Please accept terms')
        .oneOf([true], 'Please accept terms'),
    };

    if (authConfig.identifier !== 'mobile')
      schema.email = yup
        .string()
        .email('Please enter a valid email')
        .required('Email is required');

    if (authConfig.first_name)
      schema.first_name = yup.string().required('First name is required');

    if (authConfig.last_name)
      schema.last_name = yup.string().required('Last name is required');

    if (authConfig.username)
      schema.username = yup.string().required('Username is required');

    if (authConfig.nationality)
      schema.nationality = yup.string().required('Nationality is required');

    if (authConfig.terms)
      schema.terms = yup
        .string()
        .required('Please check the terms & conditions');

    if (authConfig.confirm_password)
      schema.confirm_password = yup
        .string()
        .min(8, 'Must be more than 8 characters')
        .required('Confirm password is required');

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
    if (authConfig.identifier === 'mobile') {
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
  const { fields } = useInputs(authConfig, company);
  const { group = {}, noGroups } = tempAuth;
  const { name, label, icon } = group;
  const [retryingRefereeCode, setRetryingRefereeCode] = useState(false);

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
      username,
      mobile,
      nationality,
      referral,
    } = values;
    const { group } = tempAuth;

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
        last_name,
        username,
        language: authConfig?.language ? authConfig?.language : 'en',
        password1: password,
        password2: authConfig.confirm_password ? confirm_password : password,
        terms_and_conditions: terms,
        privacy_policy: terms,
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
      console.log('handleSubmit', error);
      setFieldValue('password', '');
      setFieldTouched('password', false);
      setFieldValue('confirm_password', '');
      setFieldTouched('confirm_password', false);
      setStatus({ error: error.message });
    } finally {
      trackFlow('register', 'form', null, 'submitted', {
        success,
      });
      setSubmitting(false);
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
        email,
        mobile: '',
        company: company.id,
        password: '',
        confirm_password: '',
        nationality: authConfig.defaultNationality,
        first_name: '',
        last_name: '',
        username: '',
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
          <View pb={0.0001}>
            {fields.map((field, index) => (
              <FormikInput
                key={field.id}
                formikProps={formikProps}
                field={{
                  ...field,
                  disabled: retryingRefereeCode && field.id !== 'referral',
                }}
                onChange={value => formikProps.setFieldValue(field.id, value)}
              />
            ))}

            <ErrorOutput>
              {formikProps.status && formikProps.status.error}
            </ErrorOutput>
            <View pv={0.5} w="100%">
              {/* <View fD="row" w="100%" f={1}> */}

              <View f={1}>
                <Button
                  id={
                    retryingRefereeCode
                      ? formikProps.values.referral
                        ? 'retry'
                        : 'continue'
                      : 'register'
                  }
                  color="primary"
                  size="medium"
                  onPress={() => handleSubmit(formikProps)}
                  wide
                  disabled={!formikProps.isValid || formikProps.isSubmitting}
                  loading={formikProps.isSubmitting}
                />
              </View>
              <View f={1}>
                <Button
                  type="outlined"
                  id={'login'}
                  onPress={() => {
                    trackFlow('register', 'form', ['login button'], 'clicked');
                    onLogin(formikProps?.values?.email ?? '');
                  }}
                  wide
                />
              </View>
              {/* </View> */}

              {!keyboardHeight && <AboutAppFooter {...props} />}
            </View>
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
