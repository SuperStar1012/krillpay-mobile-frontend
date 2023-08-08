import React, { useState, useRef } from 'react';

import { TouchableHighlight } from 'react-native';
import { View, Text } from 'components';

import ButtonList from 'components/inputs/ButtonList';
import { resendVerification, fetchItem, submitOTP } from 'utility/rehive';
import { useToast } from 'contexts/ToastContext';
import { Spinner } from 'components/outputs/Spinner';
import { CodeInput } from '../inputs/CodeInput';

// function useTimer(length){

//   const [loading, setLoading] = useState(true);
//   const [expired, setExpired] = useState(false);
//   const [data, setData] = useState(null);
//   const [remaining, setRemaining] = useState();

//   useEffect(() => {
//     let timer = null;
//     async function startTimer() {
//       timer = setTimeout(() => {
//         if (data && data.created) {
//           const CurrentDate = moment();
//           const ExpiredDate = moment(data.expires);
//           const diff = ExpiredDate.diff(CurrentDate, 'seconds');
//           const formatted = formatTime(diff);
//           setRemaining(formatted);
//           if (diff <= 0) {
//             setExpired(true);
//             return () => clearTimeout(timer);
//           }
//         }
//         startTimer();
//       }, 1000);
//     }
//     startTimer();
//     return () => clearTimeout(timer);
//   }, [data]);

// }

export default function VerifyLayout(props) {
  const { type, item = {}, context = {}, onCancel, onSuccess } = props;
  const { company } = context;
  const isMobile = type === 'mobile';
  const value = item?.[isMobile ? 'number' : type] ?? '';
  const { showToast } = useToast();
  const refPinInput = useRef();

  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    setLoading('verify');
    const resp = await fetchItem(type, item?.id);
    if (resp?.verified) {
      showToast({
        id: 'verification_success',
        context: { value },
      });
      onSuccess();
    } else {
      showToast({
        id: type + '_not_verified',
        context: { value },
      });
    }
    setLoading(false);
  }

  async function handleResend() {
    try {
      setLoading('resend');
      await resendVerification(type, value, company);
      showToast({
        id: type + '_verification_resend',
        context: { value },
      });
    } catch (e) {
      console.log(e);
      showToast({
        id: 'verification_error',
        text: e?.message ? ': ' + e?.message : '',
      });
      // setError(e.message);
      refPinInput.current.clear();
    }
    setLoading(false);
  }

  const buttons = [
    {
      id: 'next',
      color: 'primary',
      onPress: handleVerify,
      // wide: true,
      disabled: isMobile || loading === 'verify',
      loading: loading === 'verify',
    },
    {
      id: 'verify_later',
      // color: 'primary',
      onPress: onCancel,
      // wide: true,
      type: 'text',
    },
  ];

  async function handleSubmitOTP(code) {
    setLoading('verify');
    try {
      await submitOTP(code);
      showToast({
        id: 'verification_success',
      });
      onSuccess();
      // handleGetProfile();
    } catch (e) {
      console.log(e);
      // setError(e.message);
      setLoading(false);
      refPinInput.current.clear();
    }
  }

  return (
    <View aI={'center'}>
      {value ? (
        <>
          <Text
            pv={0.5}
            tA={'center'}
            s={18}
            c="fontLight"
            id={
              isMobile
                ? 'mobile_verification_helper'
                : 'email_verification_helper'
            }
          />
          <Text c={'primary'} s={18} fW="500">
            {value}
          </Text>
        </>
      ) : (
        <Text
          c="authScreenContrast"
          tA={'center'}
          s={18}
          id={'unable_to_find_' + type}
        />
      )}
      {isMobile && (
        <View mt={1.5}>
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
        </View>
      )}
      <View
        ph={1}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}>
        <View mt={1.5} w="100%" fD={'column'} aI={'center'}>
          <Text t={'b2'} c="#848484" s={18} id={'did_not_receive_' + type} />
          {loading === 'resend' ? (
            <Spinner
              size="small"
              containerStyle={{ paddingBottom: 0, paddingTop: 11 }}
            />
          ) : (
            <TouchableHighlight
              underlayColor={'transparent'}
              onPress={() => handleResend()}>
              <Text
                s={18}
                c={'primary'}
                fW={'500'}
                p={0.5}
                id="resend"
                context={{ time: '' }}
              />
            </TouchableHighlight>
          )}
        </View>
      </View>
      <View pv={0.5} />
      <ButtonList items={buttons} w="100%" />
    </View>
  );
}
