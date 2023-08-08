import React, { useRef, useState, useEffect } from 'react';
import { get } from 'lodash';

import { submitOTP, resendVerification, getProfile } from 'utility/rehive';
import { Spinner, View, Text, CustomImage } from 'components';
import { CodeInput } from 'components/inputs/CodeInput';
import ErrorOutput from 'components/outputs/ErrorOutput';
import PostAuthLayout from '../components/PostAuthLayout';
import { TouchableHighlight } from 'react-native';

export default function MobileVerifyPage(props) {
  const {
    onSuccess,
    onBack,
    initialUser,
    company,
    authConfig,
    loading: loadingMain,
    setLoading: setLoadingMain,
    showToast,
    tempAuth,
    setTempAuth,
  } = props;

  const [loading, setLoading] = useState(true);
  const [loadingResend, setLoadingResend] = useState(false);
  const [error, setError] = useState('');

  const refPinInput = useRef();
  const [user, setUser] = useState(initialUser);
  const mobile = get(user, ['mobile'], '');
  const skip = Boolean(authConfig.mobile === 'optional');

  useEffect(() => {
    if (
      !authConfig.mobile ||
      get(user, ['verification', 'mobile']) ||
      authConfig.identifier !== 'mobile'
    ) {
      onSuccess();
    } else {
      if (!user) {
        handleGetProfile();
      } else {
        setLoading(false);
      }
      setLoadingMain(false);
    }
  }, [user]);

  async function handleGetProfile() {
    // setLoading(true);
    // const resp = await getProfile();
    const tempUser = {
      ...user,
      verification: { email: true, mobile: true },
      status: 'verified',
    };
    setTempAuth({ ...tempAuth, user: tempUser });
    setUser(tempUser);
    // setLoading(false);
  }

  async function handleSubmitOTP(code) {
		// setLoading(true);
		try {
			// await submitOTP(code);
			// showToast({
			//   text: 'Mobile number verified successfully',
			// });
			handleGetProfile();
		} catch (e) {
			console.log(e);
			setError(e.message);
			setLoading(false);
			refPinInput.current?.clear();
		}
  }

  async function handleResend() {
		setLoadingResend(true);
		try {
			await resendVerification("mobile", { number: mobile }, { id: company?.id ?? company });
			showToast({
				text: "An SMS containing an OTP has been sent to " + mobile,
			});
		} catch (e) {
			console.log(e);
			setError(e.message);
			refPinInput.current?.clear();
		}
		setLoadingResend(false);
  }
  if (loadingMain) {
    return null;
  }

  return (
    <PostAuthLayout onBack={onBack} skip={skip} onSuccess={onSuccess}>
      <View f={1} jC={'flex-start'}>
        <CustomImage
          containerStyle={{ padding: 16 }}
          name={'mobileVerification'}
          width={120}
        />
        <Text
          tA={'center'}
          style={{
            paddingHorizontal: 30,
            paddingTop: 8,
          }}
          id="mobile_verify_description"
        />

        {Boolean(mobile) ? (
          <Text c={'primary'} tA={'center'}>
            {mobile}
          </Text>
        ) : (
          <Text
            tA={'center'}
            style={{
              paddingHorizontal: 30,
              paddingBottom: 8,
            }}
            id="your_number"
          />
        )}

        {/* <View p={0.5} /> */}
        {loading ? ( // TODO: move this to inside code input comp
          <Spinner size="small" />
        ) : (
          <CodeInput
            ref={refPinInput}
            secureTextEntry={false}
            activeColor="gray"
            autoFocus
            inactiveColor="lightgray"
            className="border-box"
            codeLength={5}
            space={14}
            size={30}
            inputPosition="center"
            onFulfill={code => handleSubmitOTP(code)}
          />
        )}
        <ErrorOutput>{error}</ErrorOutput>
        <View
          pt={0.25}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <Text t={'b2'} tA={'center'} id="did_not_receive_the_code" />

          {loadingResend ? (
            <Spinner size="small" style={{ height: 22, width: 52 }} />
          ) : (
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
          )}
        </View>
      </View>
    </PostAuthLayout>
  );
}
