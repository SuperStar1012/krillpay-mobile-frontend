import React, { Component } from 'react';
import * as Inputs from 'config/inputs';
import { View, Checkbox, Text } from 'components';
import context from 'components/context';
import { updateItem, createAddress } from 'utility/rehive';
import { EMPTY_ADDRESS } from 'config/empty_objects';

import { Formik } from 'formik';
import { CardActions } from 'components/card/CardActions';
import CountryInput from 'components/modals/CountryInput';
import AddressTypeInput from '../../screens/profile/components/AddressTypeInput';
import { TextField } from 'components/inputs/TextField';

class _AddressForm extends Component {
  state = {
    fields: [],
  };

  componentDidMount() {
    const fields = Object.keys(EMPTY_ADDRESS).map(key => Inputs.address[key]);

    this.setState({ fields });
  }

  async handleFormSubmit(formikProps) {
    const { onClose, onSuccess, onSubmit } = this.props;
    const { values, setSubmitting, setStatus } = formikProps; // FormikProps
    const { types } = values;
    let data = {
      ...values,
      country: values?.country?.cca2,
    };
    if (typeof onSubmit === 'function') {
      onSubmit(data);
    } else {
      setSubmitting(true);
      try {
        let resp = null;
        if (types && types.length && types.length > 1) {
          for (let i = 0; i < types.length; i++) {
            data = {
              ...data,
              type: types?.[i] ?? 'permanent',
            };
            resp = await createAddress(data);
          }
        } else {
          data = {
            ...data,
            type: values?.type ? values?.type : types?.[0] ?? 'permanent',
          };
          resp = await updateItem('address', data);
        }
        onSuccess(resp, !Boolean(values?.id));
        onClose();
      } catch (error) {
        console.log('TCL: handleFormSubmit -> error', error);
        setStatus({ error: error.message });
      }
      setSubmitting(false);
    }
  }

  onSubmitEditing(index, props) {
    const { fields } = this.state;

    try {
      if (
        fields?.length > index + 1 &&
        typeof this?.[fields?.[index + 1]?.id]?.focus === 'function'
      ) {
        this[fields[index + 1].id]?.focus();
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
            {...item}
            toggleCheck={() => setFieldValue(id, !value)}
            value={value}
            error={touch && error}
            key={item.id}
          />
        );
      case 'country':
        return (
          <CountryInput
            {...item}
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
        {...item}
        label={item?.label ?? item?.id}
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
    const { item, addressType, type, design, onClose, context } = this.props;
    const { profileConfig } = context?.config ?? {};
    const { fields } = this.state;
    let initialValues = item ? item : EMPTY_ADDRESS;
    initialValues = {
      types: [], //addressType?? profileConfig?.addressTypes?.[0] ?? 'permanent'
      ...initialValues,
    };

    return (
      <Formik
        ref={input => {
          this[type + 'Form'] = input;
        }}
        enableReinitialize={!item}
        initialValues={initialValues}>
        {props => (
          <View f={1}>
            <View bC={'surfaceCard'}>
              {profileConfig?.addressTypes?.length > 1 && (
                <AddressTypeInput
                  profileConfig={profileConfig}
                  editing={Boolean(item)}
                  value={props.values.type}
                  values={props.values.types}
                  setFieldValue={props.setFieldValue}
                />
              )}
              {fields.map((field, index) =>
                this.renderInput(props, field, index),
              )}
              {props.status && props.status.error ? (
                <Text p={1} c={'error'} tA={'center'}>
                  {props.status.error}
                </Text>
              ) : null}
            </View>

            <CardActions
              type="vertical"
              actionTwo={{
                id: 'save',
                onPress: () => this.handleFormSubmit(props),
                disabled: !props.isValid || props.isSubmitting,
                loading: props.isSubmitting,
                wide: true,
              }}
              actionOne={{
                id: 'cancel',
                onPress: onClose,
                wide: true,
                type: 'text',
              }}
              borderRadius={design.cards.cornerRadius}
            />
          </View>
        )}
      </Formik>
    );
  }
}

const AddressForm = context(_AddressForm);

export { AddressForm };
