import React, { Component } from 'react';
import * as Inputs from 'config/inputs';
import { View, TextField, Checkbox, Text, Button } from 'components';
import context from 'components/context';
import { updateItem } from 'utility/rehive';

import * as Empty from 'config/empty_objects';

import { Formik } from 'formik';

import CountryInput from 'components/modals/CountryInput';
import TimezoneInput from 'components/modals/TimezoneInput';
// import DateInput from 'components/modals/DateInput';
import Input from 'components/inputs/FormikInput';

class _RehiveForm extends Component {
  state = {
    fields: [],
  };

  componentDidMount() {
    const { type } = this.props;
    const fields = Object.keys(getEmpty(type)).map(
      key => Inputs?.[type]?.[key],
    );

    this.setState({ fields });
  }

  async handleFormSubmit(props) {
    const { type, onDetailClose, onSaveSuccess, onSubmit } = this.props;
    const { values, setSubmitting, setStatus } = props; // FormikProps
    setSubmitting(true);
    try {
      if (typeof onSubmit === 'function') {
        onSubmit(values);
      } else {
        await updateItem(type, values);
        onSaveSuccess();
        onDetailClose();
      }
    } catch (error) {
      console.log('TCL: handleFormSubmit -> error', error);
      setStatus({ error: error.message });
    }
    setSubmitting(false);
  }

  onSubmitEditing(index, props) {
    const { fields } = this.state;

    try {
      if (
        fields?.length > index + 1 &&
        typeof this?.[fields?.[index + 1]?.id]?.focus === 'function'
      ) {
        this[fields[index + 1].id].focus();
      } else {
        // if (props.isValid) {
        this.handleFormSubmit(props);
        // } else {
        //   props.validateForm();
        // }
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
    let value = values[id];
    const touch = touched[id];
    const error = errors[id];

    switch (item.type) {
      case 'checkbox':
        return (
          <Checkbox
            link={item.link}
            description={item.description}
            title={item.title}
            toggleCheck={() => setFieldValue(id, !value)}
            value={value}
            error={touch && error}
            key={item.id}
          />
        );
      case 'country':
        return (
          <CountryInput
            label={item.label}
            setValue={value => setFieldValue(item.id, value)}
            value={value}
            error={touch && error}
            key={item.id}
          />
        );
      case 'date':
        return (
          <Input
            field={{ label: item.label, id: item.id, type: 'date' }}
            key={item.id}
            formikProps={props}
          />
        );
      // return (
      //   <DateInput
      //     label={item.label}
      //     setValue={value => setFieldValue(item.id, value)}
      //     value={value}
      //     error={touch && error}
      //     key={item.id}
      //   />
      // );
      case 'timezone':
        return (
          <TimezoneInput
            label={item.label}
            setValue={value => setFieldValue(item.id, value)}
            value={value}
            error={touch && error}
            key={item.id}
          />
        );
    }
    return (
      <TextField
        ref={input => {
          this[item.id] = input;
        }}
        label={item.label}
        placeholder={item.placeholder}
        helper={item.helper}
        min={min}
        max={max}
        value={value}
        error={touch && error}
        type={item.type}
        onBlur={() => setFieldTouched(item.id)}
        onChangeText={value => setFieldValue(item.id, value)}
        tintColor={colors.primary}
        onSubmitEditing={() => this.onSubmitEditing(index, props)}
        selectTextOnFocus
        spellCheck={false}
        name={item.id}
        key={item.id}
      />
    );
  }

  render() {
    const { initial, type, design, onDetailClose, profileConfig } = this.props;
    const { fields } = this.state;
    const initialValues = initial ? initial : getEmpty(type);

    return (
      <Formik
        ref={input => {
          this[type + 'Form'] = input;
        }}
        initialValues={initialValues}>
        {props => (
          <View pt={0.25}>
            {fields.map((field, index) => {
              if (field.id === 'id_number' && profileConfig.hideID) {
                return null;
              }
              return this.renderInput(props, field, index);
            })}
            {props.status && props.status.error ? (
              <Text p={1} c={'error'} tA={'center'}>
                {props.status.error}
              </Text>
            ) : null}
            <View mt={1}>
              <Button
                id={'save'}
                color="primary"
                size="medium"
                onPress={() => this.handleFormSubmit(props)}
                wide
                disabled={!props.isValid || props.isSubmitting}
                loading={props.isSubmitting}
              />
              <Button
                id={'cancel'}
                buttonStyle={{ paddingTop: 0 }}
                color="authScreenContrast"
                type="text"
                onPress={onDetailClose}
                wide
                containerStyle={{ marginTop: 18 }}
              />
            </View>
          </View>
        )}
      </Formik>
    );
  }
}

const RehiveForm = context(_RehiveForm);

export { RehiveForm };

const getEmpty = type => {
  switch (type) {
    case 'address':
      return Empty.EMPTY_ADDRESS;
    case 'bank_account':
      return Empty.EMPTY_BANK_ACCOUNT;
    case 'crypto_account':
      return Empty.EMPTY_CRYPTO;
    case 'email':
      return Empty.EMPTY_EMAIL;
    case 'mobile':
      return Empty.EMPTY_MOBILE;
    case 'profile':
      return Empty.EMPTY_PROFILE;
    default:
      return {};
  }
};
