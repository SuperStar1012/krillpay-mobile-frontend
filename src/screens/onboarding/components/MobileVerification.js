import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { View } from 'components/layout/View';
import { Text } from 'components';
import { Spinner } from 'components/outputs/Spinner';
import { Button } from 'components/inputs/Button';
import { Icon } from 'components/outputs/Icon';
import { Formik } from 'formik';
import { isMobile } from 'utility/validation';
import { cleanMobile } from 'utility/general';
import {
  createMobile,
  submitOTP,
  resendMobileVerification,
  primaryItem,
} from 'utility/rehive';
import { CodeInput } from 'components/inputs/CodeInput';
import Input from 'components/inputs/FormikInput';
import { getCallingCode } from 'react-native-country-picker-modal';
import { useRehiveContext } from 'contexts/RehiveContext';
import { useToast } from 'contexts/ToastContext';

export default function MobileVerification(props) {
  const {
    formikProps,
    name,
    setLayout,
    existing,
    activeSection = {},
    setCurrentSection,
    currentSection,
  } = props;
  const { completed } = activeSection;

  const { showToast } = useToast();

  const [fetching, setFetching] = useState(!Boolean(callingCode));
  const [callingCode, setCallingCode] = useState(existing?.callingCode);

  useEffect(() => {
    setCallingCode(existing?.callingCode);
  }, [existing]);

  useEffect(() => {
    async function fetchData() {
      if (existing?.user?.nationality) {
        const resp = await getCallingCode(existing?.user?.nationality);
        setCallingCode(resp);
      }
      setFetching(false);
    }

    if (fetching) {
      fetchData();
    }
  }, []);
  const { submitForm } = formikProps;
  const {
    context: { company },
  } = useRehiveContext();

  const [state, setState] = useState('form');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState();
  const [resendTimeLeft, setResendTimeLeft] = useState(0);
  const [createdMobile, setCreatedMobile] = useState();

  useEffect(() => {
    if (!resendTimeLeft) return;

    const intervalId = setInterval(
      () => setResendTimeLeft(resendTimeLeft - 1),
      1000,
    );

    return () => clearInterval(intervalId);
  }, [resendTimeLeft]);

  useEffect(() => {
    setLayout({
      displayImage: state === 'form',
      displayHeading: false,
      displayDescription: false,
      displayButton: false,
    });
  }, [state]);

  const config = {
    form: {
      heading: 'verify_mobile_description',
    },
    verify: {
      heading: 'verification_code_sent_to',
    },
  };

  async function handlePress({ values }) {
    if (completed && existing?.existing === values?.verify_mobile) {
      setCurrentSection(currentSection + 1);
    } else {
      setError(null);
      setSubmitting(true);

      if (state === 'form') {
        if (!values[name]) return submitForm();
        if (formikProps.values?.mobile === values[name]) {
          if (formikProps.values?.verification?.mobile) return submitForm();
          await resendMobileVerification(
            cleanMobile(values[name]),
            company?.id,
          );
        } else {
          try {
            const resp = await createMobile({
              number: cleanMobile(values[name]),
              primary: true,
            });

            setCreatedMobile(resp);
          } catch (e) {
            setSubmitting(false);
            return setError(e.message);
          }
        }
        setResendTimeLeft(20);
        setState('verify');
      } else {
        try {
          await submitOTP(values.code);
          await primaryItem('mobile', { id: createdMobile?.id });
          submitForm();
        } catch (e) {
          setError(e.message);
        }
      }

      setSubmitting(false);
    }
  }

  function resendVerificationCode(mobile) {
    resendMobileVerification(cleanMobile(mobile), company?.id);
    setResendTimeLeft(20);
    showToast({ text: `Verification code sent to ${mobile}` });
  }

  const validate = values => {
    const errors = {};

    if (values[name] && !isMobile(values[name])) {
      errors[name] = 'Please enter a valid mobile number (incl. country code)';
    }
    return errors;
  };
  const initialValues = {
    [name]: formikProps.values?.mobile ?? callingCode,
    code: formikProps.values?.mobile ? '' : callingCode,
  };

  return (
    <Formik
      enableReinitialize
      validate={validate}
      isInitialValid={isMobile(formikProps.values?.mobile ?? callingCode)}
      initialValues={initialValues}>
      {formikProps => (
        <View style={{ position: 'relative' }}>
          {state === 'verify' && (
            <React.Fragment>
              <TouchableOpacity
                onPress={() => setState('form')}
                style={{
                  position: 'absolute',
                  top: 0,
                  zIndex: 100,
                }}>
                <Icon
                  name={'arrow-back-ios'}
                  set={'MaterialIcons'}
                  size={18}
                  style={{
                    position: 'absolute',
                    top: 0,
                    padding: 10,
                    paddingLeft: 0,
                  }}
                />
              </TouchableOpacity>
            </React.Fragment>
          )}
          <View mb={1}>
            <View>
              <Text
                s={20}
                fW={'700'}
                lH={38}
                tA={'center'}
                id="verify_mobile_title"
              />
            </View>
            <Text s={18} lH={38} tA={'center'} id={config[state].heading} />
            {state === 'verify' && (
              <Text s={18} lH={24} tA={'center'} c={'primary'} fW={'500'}>
                {formikProps.values[name]}
              </Text>
            )}
          </View>
          {fetching ? (
            <Spinner size="small" />
          ) : state === 'form' ? (
            <Input
              field={{ name, label: 'Mobile number', type: 'mobile' }}
              formikProps={formikProps}
            />
          ) : (
            // <Input
            //   field={{ name: 'code', label: 'Verification code' }}
            //   formikProps={formikProps}
            //   textAlign={'center'}
            //   textContentType={Platform.OS === 'ios' ? 'oneTimeCode' : 'none'}
            //   style={{ letterSpacing: '10pt' }}
            // />
            <CodeInput
              // ref={refPinInput}
              secureTextEntry={false}
              activeColor="gray"
              autoFocus
              inactiveColor="lightgray"
              className="border-box"
              codeLength={5}
              space={14}
              size={30}
              inputPosition="center"
              onFulfill={code => handlePress({ values: { code } })}
            />
          )}
          {state === 'verify' && (
            <React.Fragment>
              <Text
                lH={21}
                tA={'center'}
                c={'grey4'}
                id="did_not_receive_the_code"
              />
              <TouchableOpacity
                disabled={resendTimeLeft > 0}
                onPress={() =>
                  resendVerificationCode(formikProps.values[name])
                }>
                <Text
                  lH={27}
                  tA={'center'}
                  c={resendTimeLeft > 0 ? 'grey4' : 'primary'}
                  fW={'500'}
                  id="resend"
                  context={{
                    time: resendTimeLeft > 0 ? 'in ' + resendTimeLeft : '',
                  }}
                />
              </TouchableOpacity>
              {submitting && (
                <View mt={1}>
                  <Spinner />
                </View>
              )}
            </React.Fragment>
          )}
          <View mt={2}>
            {error && (
              <View mb={1}>
                <Text tA={'center'} c={'red'}>
                  {error}
                </Text>
              </View>
            )}
            {state === 'form' && (
              <Button
                id={'continue'}
                variant={'contained'}
                loading={submitting}
                disabled={
                  (submitting || !formikProps.isValid) &&
                  !(
                    completed &&
                    existing?.existing === formikProps.values?.verify_mobile
                  )
                }
                color={'primary'}
                onPress={() => handlePress({ values: formikProps.values })}
                wide
              />
            )}
          </View>
        </View>
      )}
    </Formik>
  );
}
