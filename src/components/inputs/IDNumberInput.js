import React, { useState } from 'react';
import { TextField } from '..';
import { useRehiveContext } from 'contexts';
import { validateSSN } from 'utility/validation';

export default function IDNumberInput(props) {
  const { name, value = '', onChangeText, formikProps } = props;
  const { values, setFieldValue } = formikProps ?? {};

  const { user } = useRehiveContext();
  const isUsNationality =
    (values?.nationality
      ? values?.nationality === 'US' ||
        values?.nationality?.cca2 === 'US' ||
        values?.nationality === 'United States of America'
      : user?.nationality === 'US') ?? false;

  const [visibility, toggleVisibility] = useState(false);

  function handleChange(inputValue) {
    let newSSN = '';
    const tempValue =
      (value?.[value?.length - 1] === '-'
        ? value?.slice(0, value.length - 1)
        : value) ?? '';
    if (inputValue.length < tempValue?.length) {
      newSSN = tempValue.slice(0, inputValue.length);
    } else {
      const temp = inputValue.slice(tempValue?.length - inputValue.length);
      newSSN = formatSsn(tempValue + temp);
    }
    const error = validateSSN(newSSN);
    if (typeof formikProps.setFieldError === 'function')
      formikProps.setFieldError(name, error);

    if (typeof setFieldValue === 'function') setFieldValue(name, newSSN);
    else if (typeof onChangeText === 'function') onChangeText(newSSN);
  }

  const ssnOverrides = isUsNationality
    ? {
        label: 'ssn',
        value: formatSsn(value, !visibility),
        placeholder: 'e.g. 123-45-9000',
        onChangeText: handleChange,
      }
    : {
        onChangeText: value => {
          if (typeof setFieldValue === 'function') setFieldValue(name, value);
          else if (typeof onChangeText === 'function') onChangeText(value);
        },
      };

  return (
    <TextField
      {...props}
      {...ssnOverrides}
      keyboardType="numeric"
      visibility={visibility}
      toggleVisibility={toggleVisibility}
    />
  );
}

const formatSsn = (ssn = '', hide) => {
  return !ssn
    ? ''
    : ssn.length > 11
    ? ssn.substr(0, 11)
    : ssn
        .replace(/[^\d*]/g, '')
        .replace(/^\d{1,5}/, x => (hide ? x.replace(/./g, '*') : x)) ///(?=\d{5})\d/
        .replace(
          /^(.{1,3})(.{1,2})?(.{1,4})?.*$/,
          (_, x, y, z) => x + (y ? `-${y}` : '') + (z ? `-${z}` : ''),
        );
};
