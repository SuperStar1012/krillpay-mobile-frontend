import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import FormikInput from 'components/inputs/FormikInput';

export const MobileVerification = ({
  company,
  mobile,
  handleNextStep,
  setShowMobileAuthentication,
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleResend = async () => {
    setIsVerifying(true);
    setErrorMessage('');

    try {
      // await resendMobileVerification(mobile, company);
      setErrorMessage('Verification code sent successfully.');
    } catch (error) {
      console.log(error);
      setErrorMessage('Failed to send verification code.');
    }

    setIsVerifying(false);
  };

  return (
    <View>
      <FormikInput
        id="mobile_verification_code"
        label="Verification Code"
        placeholder="Enter Verification Code"
        keyboardType="number-pad"
        // formikProps={formikProps}
        field={{ id: 'mobile_verification_code' }}
        // onChange={value => onChange(value)}
      />
      {errorMessage ? (
        <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text>
      ) : null}

      <View>
        <Button
          title="Resend Verification Code"
          onPress={handleResend}
          disabled={isVerifying}
        />
      </View>
    </View>
  );
};
