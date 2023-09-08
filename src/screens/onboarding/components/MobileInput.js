import React, { useRef, useState, useEffect } from 'react';
import PhoneInput from 'react-native-phone-number-input';
import { TextField } from 'components/inputs/TextField';

export default function MobileInput(props) {
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [valid, setValid] = useState(false);

  const phoneInput = useRef();

  useEffect(() => {}, [value]);

  return (
    <PhoneInput
      ref={phoneInput}
      defaultValue={value}
      defaultCode={'US'}
      onChangeText={text => {
        setValue(text);
      }}
      onChangeFormattedText={text => {
        setFormattedValue(text);
      }}
      containerStyle={{ width: '100%' }}
      textContainerStyle={{ backgroundColor: 'transparent' }}
    />
  );
}
