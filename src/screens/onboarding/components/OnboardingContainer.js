import React from 'react';
import { Pressable, Keyboard } from 'react-native';
import { Formik } from 'formik';
import { FullScreenForm } from 'components';
import { View } from 'components/layout/View';
import OnboardingSectionPanel from './OnboardingSectionPanel';
import OnboardingSectionForm from './OnboardingSectionForm';
import { useToast } from 'contexts';
import { logoutUser } from 'utility/auth/actions';
import { useDispatch } from 'react-redux';

export default function OnboardingContainer(props) {
  const {
    setCurrentSection,
    initialValueMapper,
    handleSubmit,
    activeSection,
    isOnboardingComplete,
    canSkip,
    navigation,
    setState,
  } = props;

  const { showToast } = useToast();

  const canGoBack = navigation.canGoBack();
  function handleSkip() {
    if (canSkip || isOnboardingComplete) {
      if (canGoBack) navigation.goBack();
      else navigation.navigate('Tabs', { screen: 'Home' });
    } else showToast({ variant: 'error', id: 'unable_to_skip_onboarding' });
  }
  const dispatch = useDispatch();

  async function handleLogout() {
    dispatch(logoutUser());
    navigation.navigate('Public', { screen: 'Auth' });
  }
  return (
    <FullScreenForm
      textHeaderLeft={!canSkip && 'logout'}
      onPressHeaderLeft={handleLogout}
      textHeaderRight={!canSkip && 'skip'}
      textHeaderRightSize={20}
      headerStyle={{ minHeight: 40 }}
      onPressHeaderRight={() => setState('success')}>
      <Formik
        initialValues={initialValueMapper(activeSection.id)}
        enableReinitialize
        sectionId={activeSection.id}
        onSubmit={handleSubmit}>
        {formikProps => (
          <View f={1} fD={'column'} h={'100%'}>
            {/* <OnboardingSectionPanel
              {...props}
              {...{
                activeSection,
                setCurrentStep: setCurrentSection,
              }}
            /> */}
            <View
              mt={activeSection?.id === 'wyre' ? 0 : 1}
              scrollView
              keyboardAvoiding
              keyboardAvoidingProps={{ keyboardVerticalOffset: 60 }}>
              <Pressable style={{ flexGrow: 1 }} onPress={Keyboard.dismiss}>
                <View ph={activeSection?.id === 'wyre' ? 0 : 1.5}>
                  <OnboardingSectionForm
                    {...props}
                    {...{
                      formikProps,
                      noPadding: activeSection?.id === 'wyre',
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
