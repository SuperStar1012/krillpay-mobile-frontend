import React, { useState, useEffect } from 'react';
import { View } from 'components/layout/View';
import { pick, groupBy, isString, isEmpty, omit, omitBy } from 'lodash';
import { createAddress } from 'utility/rehive';
import { useOnboarding } from 'utility/contexts/onboarding';
import { Pressable, Keyboard } from 'react-native';
import OnboardingSectionForm from '../../onboarding/components/OnboardingSectionForm';
import { FullScreenForm } from 'components';

import { useRehiveContext } from 'contexts/RehiveContext';
import { Formik } from 'formik';

export default function AddressRegistrationPage(props) {
  const { onSuccess, onBack, setLoading } = props;

  useEffect(() => {
    setLoading(false);
  }, [userConfig]);

  const {
    data: { userConfig, userAddresses, documents },
    methods: { fetch, refetchPaymentMethods },
  } = useOnboarding();

  let { sections = [], completedSections, isOnboardingComplete } = userConfig;
  // console.log(userConfig);

  let activeSection = { id: 'address' };
  async function updateUserAddresses(values) {
    let response = { status: 'success', errors: [] };
    for (let [key, value] of Object.entries(values)) {
      if (isString(value)) continue;

      let filledFields = omitBy(
        omit(value, ['created', 'id', 'status', 'updated', 'type']),
        x => !x,
      );

      if (isEmpty(filledFields)) continue;

      try {
        value = { ...value, country: value?.country?.cca2 ?? value?.country };
        if (value) {
          await createAddress({ type: key, ...value });
        }
      } catch (error) {
        response.errors.push(error.message);
      }
    }
    return response;
  }

  async function handleSubmit(values, { setSubmitting }) {
    let resp = await updateUserAddresses({ permanent: values });
  }

  async function handleSkip(values, { setSubmitting }) {
    console.log('skip');
  }

  return (
    <FullScreenForm
      textHeaderRight={'Skip'}
      textHeaderRightSize={20}
      headerStyle={{ minHeight: 40 }}
      onPressHeaderRight={handleSkip}>
      <Formik enableReinitialize sectionId={'address'} onSubmit={handleSubmit}>
        {formikProps => (
          <View f={1} fD={'column'} h={'100%'}>
            <View
              scrollView
              keyboardAvoiding
              keyboardAvoidingProps={{ keyboardVerticalOffset: 60 }}>
              <Pressable style={{ flexGrow: 1 }} onPress={Keyboard.dismiss}>
                <View>
                  <OnboardingSectionForm
                    {...props}
                    {...{
                      formikProps,
                      activeSection,
                      handleSubmit,
                    }}
                  />
                </View>
              </Pressable>
            </View>
          </View>
        )}
      </Formik>
    </FullScreenForm>
  );
}
