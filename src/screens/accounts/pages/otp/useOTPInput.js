import React, { useRef, useState, useEffect } from 'react';

const MAX_OTP_LENGTH = 5;

export default function useOTPInput() {
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

  return {
    pinScreenRef,
    onKeyDown,
  };
}
