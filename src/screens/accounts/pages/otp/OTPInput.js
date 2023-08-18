//import liraries
import React, { useRef, useEffect, useState } from 'react';
import { PinScreen } from 'react-native-awesome-pin';
import Logo from '../../../../../assets/icons/splash.png';
import useOTPInput from './useOTPInput';

// create a component
const OTPInput = () => {
  const { pinScreenRef, onKeyDown } = useOTPInput();

  return (
    <PinScreen
      onRef={ref => {}}
      ref={pinScreenRef}
      logoEnabled
      keyDown={onKeyDown}
      tagline="Please enter the OTP sent to your email"
      logo={Logo}
      keyTextStyle={{
        fontFamily: 'Roboto_400Regular',
      }}
      taglineStyle={{
        fontFamily: 'Roboto_400Regular',
        color: 'black',
        fontSize: 18,
      }}
      errorStyle={{
        backgroundColor: 'red',
      }}
      logoStyle={{ transform: [{ scale: 0.5 }] }}
      headerBackgroundColor="#FFF"
      pinStyle={{
        backgroundColor: 'black',
      }}
      containerStyle={{ backgroundColor: '#FFF', width: '100%' }}
    />
  );
};

export default OTPInput;
