import React, { useState, useEffect } from 'react';
import { TextField } from './TextField';
import { IsEmail } from '../../utility/validation';
import { useTheme } from 'contexts/ThemeContext';

export default function EmailInput(props) {
  let { value, onChangeText } = props;
  const { colors } = useTheme();
  const [email, setEmail] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (value) setEmail(value);
  }, [value]);

  function _onChangeText(input) {
    setEmail(input);
    setError(!IsEmail(input) ? 'Please enter a valid email address' : null);
    onChangeText(input);
  }

  return (
    <TextField
      tintColor={colors.primary}
      type={'email_custom'}
      value={email}
      shrink
      autoFocus
      label={'email_address'}
      onClear={() => onChangeText('')}
      error={error}
      onChangeText={input => _onChangeText(input)}
    />
  );
}
