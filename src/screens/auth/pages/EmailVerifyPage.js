import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { TouchableHighlight } from 'react-native';
import { View, Text, Button, CustomImage } from 'components';
import { resendVerification, getProfile } from 'utility/rehive';

import ErrorOutput from 'components/outputs/ErrorOutput';
import PostAuthLayout from '../components/PostAuthLayout';

export default function EmailVerifyPage(props) {
  const {
    setLoading: setLoadingMain,
    loading: loadingMain,
    initialUser,
    company,
    authConfig,
    onSuccess,
    showToast,
    onBack,
  } = props;
  const [error, setError] = useState('');
  const skip = Boolean(authConfig.email === 'optional');
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [second, setSecond] = useState(false);
  const email = get(user, ['email'], '');

  useEffect(() => {
    if (
      !authConfig.email ||
      get(user, ['verification', 'email']) ||
      authConfig.identifier !== 'email'
    ) {
      onSuccess();
    } else {
      if (!user) {
        handleGetProfile();
      } else {
        if (second) {
          setError('Email not verified, please check your inbox');
        }
        setLoading(false);
      }
      setLoadingMain(false);
    }
  }, [user]);

  async function handleGetProfile() {
    const resp = await getProfile();
    setUser(resp);
    setLoading(false);
  }

  async function handleVerify() {
    setLoading(true);
    try {
      setSecond(true);
      handleGetProfile();
    } catch (e) {
      console.log(e);
      setLoading(false);
      setError(e.message);
    }
  }

  async function handleResend() {
    setLoading2(true);
    try {
      await resendVerification('email', { email }, company);
      showToast({
        text:
          'Instructions on how to verify your email have been sent to ' + email,
      });
      setError('');
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
    setLoading2(false);
  }
  if (loadingMain) {
    return null;
  }

  return (
    <PostAuthLayout onBack={onBack} skip={skip} onSuccess={onSuccess}>
      <View aI={'center'} ph={2}>
        <CustomImage
          containerStyle={{ padding: 16 }}
          name={'emailVerify'}
          width={150}
        />
        {email ? (
          <React.Fragment>
            <Text tA={'center'} p={0.5} id="email_verify_helper" />
            {Boolean(email) && (
              <Text c={'primary'} tA={'center'} s={18}>
                {email}
              </Text>
            )}
          </React.Fragment>
        ) : (
          <Text c="authScreenContrast" tA={'center'} id="no_email_error" />
        )}
        <ErrorOutput>{error}</ErrorOutput>
        <View pv={1} />
        <Button
          id="next"
          color="primary"
          onPress={() => handleVerify()}
          wide
          disabled={loading}
          loading={loading}
        />
        <View
          ph={1}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <View mt={1} f={1} fD={'row'} jC={'center'}>
            <Text t={'b2'} c="#848484" id="did_not_receive_the_email" />
            <Text> </Text>
            <TouchableHighlight
              underlayColor={'transparent'}
              onPress={() => handleResend()}>
              <Text
                t={'b2'}
                c={'primary'}
                fW={'500'}
                id="resend"
                context={{ time: '' }}
              />
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </PostAuthLayout>
  );
}
