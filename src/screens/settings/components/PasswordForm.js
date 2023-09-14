import React, { Component } from 'react';
import * as Inputs from 'config/inputs';
import { View, Button, TextField, Text } from 'components';
import context from 'components/context';
import { changePassword } from 'utility/rehive';
import * as yup from 'yup';

import { Formik } from 'formik';

class _PasswordForm extends Component {
  async handleFormSubmit(props) {
    const { onSuccess, context = {} } = this.props;
    const { authConfig } = context;
    const { values, setSubmitting, setStatus } = props; // FormikProps
    const { old_password, new_password, confirm_password } = values;
    setSubmitting(true);
    try {
      const data = {
        old_password: old_password,
        new_password1: new_password,
        new_password2: authConfig?.confirm_password
          ? confirm_password
          : new_password,
      };
      await changePassword(data);
      this.props?.showToast({
        id: 'password_updated',
        variant: 'success',
      });
      // onSuccess();
      this.props.navigation.goBack();
    } catch (error) {
      console.log('PasswordForm', error);
      setStatus({ error: error.message });
    }
    setSubmitting(false);
  }

  onSubmitEditing(index, props) {
    try {
      if (index === 0 && typeof this.new_password.focus === 'function') {
        this.new_password.focus();
      } else {
        this.handleFormSubmit(props);
      }
    } catch (e) {
      console.log('onSubmitEditing', e);
    }
  }

  renderInput(props, item, index) {
    const { colors } = this.props;
    const { values, touched, errors, setFieldTouched, setFieldValue } = props;
    const id = item.id;
    const min = item.validation && item.validation.min;
    const max = item.validation && item.validation.max;
    const value = values[id];
    const touch = touched[id];
    const error = errors[id];
    return (
      <TextField
        ref={input => {
          this[item.id] = input;
        }}
        autoCompleteType="off"
        textContentType="none"
        autoCorrect={false}
        label={item.label}
        placeholder={item.placeholder}
        helper={item.helper}
        min={min}
        max={max}
        value={value}
        error={id !== 'new_password' && touch && error}
        type={item.type}
        onBlur={() => setFieldTouched(item.id)}
        onChangeText={value => setFieldValue(item.id, value)}
        tintColor={colors.primary}
        onSubmitEditing={() => this.onSubmitEditing(index, props)}
        selectTextOnFocus
        spellCheck={false}
        name={item.id}
        key={item.id}
        hideHelper={item.helper === ''}
      />
    );
  }

  render() {
    const { context = {} } = this.props;
    const { authConfig } = context?.config ?? {};

    const initialValues = {
      old_password: '',
      new_password: '',
    };
    if (authConfig?.confirm_password) {
      initialValues.confirm_password = '';
    }
    const fields = Object.keys(initialValues).map(key => Inputs.password[key]);
    const passwordSchema = yup
      .string()
      .min(
        8,
        fields.helper && fields.password.helper
          ? fields.password.helper
          : 'Must be more than 8 characters',
      )
      .required(
        fields.error && fields.password.error
          ? fields.password.error
          : 'Password is required',
      );

    const newPasswordSchema = yup
      .string()
      .min(12, 'Password must be at least 12 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(
        /[a-zA-Z]+\d+|\d+[a-zA-Z]+/,
        'Password must contain a mixture of letters and numbers',
      )
      .matches(/[!@#?]/, 'Password must contain at least one special character')
      .required(
        fields.error && fields.password.error
          ? fields.password.error
          : 'Password is required',
      );

    let schemaObject = {
      old_password: passwordSchema,
      new_password: newPasswordSchema,
    };

    if (authConfig?.confirm_password) {
      schemaObject.confirm_password = yup
        .string()
        .min(
          8,
          fields.helper && fields.confirm_password.helper
            ? fields.confirm_password.helper
            : 'Must be more than 8 characters',
        )
        .required(
          fields.error && fields.confirm_password.error
            ? fields.confirm_password.error
            : 'Confirm password is required',
        );
    }
    const schema = yup.object().shape(schemaObject);

    return (
      <Formik
        validateOnMount={true}
        ref={input => {
          this.passwordForm = input;
        }}
        initialValues={initialValues}
        validationSchema={schema}>
        {props => (
          <View scrollView keyboardAvoiding f={1}>
            {fields.map((field, index) => {
              return this.renderInput(props, field, index);
            })}
            {props.status && props.status.error ? (
              <Text c={'error'} tA={'center'}>
                {props.status.error}
              </Text>
            ) : null}

            <View mt={1}>
              <Button
                id="confirm"
                color="primary"
                wide
                disabled={!props.isValid || props.isSubmitting}
                loading={props.isSubmitting}
                onPress={() => this.handleFormSubmit(props)}
              />
            </View>
          </View>
        )}
      </Formik>
    );
  }
}

const PasswordForm = context(_PasswordForm);

export { PasswordForm };
