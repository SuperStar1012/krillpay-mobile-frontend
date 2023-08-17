//import liraries
import React, { useRef, useEffect, useState } from 'react';
import { PinScreen } from 'react-native-awesome-pin';
import Logo from '../../../../../assets/icons/splash.png';

const MAX_OTP_LENGTH = 5;
// create a component
const OTPInput = () => {
  const pinScreenRef = useRef();
  const [currentPin, setCurrentPin] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (currentPin.length === MAX_OTP_LENGTH && currentPin !== '12345') {
      setHasError(true);
      pinScreenRef?.current?.throwError('Invalid pin');
    }
  }, [currentPin]);

  function onKeyDown(value) {
    if (hasError && value.length !== MAX_OTP_LENGTH) {
      pinScreenRef?.current?.clearError();
    }
    setCurrentPin(value);
  }

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
      //   keyDown={this.recievePin.bind(this)}
    />
  );
};

export default OTPInput;
