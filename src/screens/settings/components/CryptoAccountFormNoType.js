import React, { Component } from 'react';

import { cryptoAccounts } from 'config/inputs';
import { View, TextField, Checkbox, Text } from 'components';
import context from 'components/context';
import { updateItem } from 'utility/rehive';
import { EMPTY_CRYPTO } from 'config/empty_objects';

import { Formik } from 'formik';
import { CardActions } from 'components/card/CardActions';
import { standardizeString } from 'utility/general';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { validateCrypto2, cryptoName, cryptoType } from 'utility/validation';
import RadioSelector from 'components/inputs/RadioSelector';

class _CryptoAccountFormNoType extends Component {
  handleSubmit = async props => {
    const { onSaveSuccess, item } = this.props;
    const { values, setSubmitting, setStatus } = props; // FormikProps
    const {
      name,
      testnet,
      memo,
      memoSkip,
      address,
      stellarTransactionType,
      crypto_type,
      network,
    } = values;

    setSubmitting(true);
    if (
      crypto_type.includes('XLM') &&
      stellarTransactionType === 'public' &&
      !(memo || memoSkip)
    ) {
      setStatus({ error: 'Please include a memo or check no memo required' });
    } else {
      const data = {
        address,
        metadata: { testnet, name },
        name,
        crypto_type,
        network,
      };
      if (values.memo && stellarTransactionType === 'public') {
        data.metadata = { ...data.metadata, memo };
      }
      if (item) {
        data.id = item.id;
      }
      try {
        const resp = await updateItem('crypto_account', data);
        onSaveSuccess('crypto_account', resp);
      } catch (error) {
        setStatus({ error: error.message });
      }
    }
    setSubmitting(false);
  };

  onSubmitEditing(index, props) {
    const { fields } = this.state;

    try {
      if (
        fields?.length > index + 1 &&
        typeof this?.[fields?.[index + 1]?.id]?.focus === 'function'
      ) {
        this[fields[index + 1].id].focus();
      } else {
        this.handleFormSubmit(props);
      }
    } catch (e) {
      console.log('onSubmitEditing', e);
    }
  }

  renderInput(props, item) {
    const { colors } = this.props;
    const { values, touched, errors, setFieldTouched, setFieldValue } = props;
    const id = item.id;
    const min = item.validation && item.validation.min;
    const max = item.validation && item.validation.max;
    let value = values[id];
    const touch = touched[id];
    const error = errors[id];
    const { crypto_type } = values;
    let { placeholder } = item;
    if (item.id === 'address') {
      placeholder =
        crypto_type.match(/TXLM|XLM/) &&
        values.stellarTransactionType === 'federation'
          ? 'e.g. username*domain.com'
          : crypto_type.match(/TXBT|XBT/)
          ? 'e.g. 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
          : item.placeholder;
    }

    switch (item.type) {
      case 'checkbox':
        return (
          <Checkbox
            link={item.link}
            description={item.label}
            toggleValue={() => setFieldValue(id, !value)}
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
        placeholder={placeholder}
        helper={item.helper}
        min={min}
        max={max}
        value={value}
        error={touch && error}
        type={item.type}
        onBlur={() => setFieldTouched(item.id)}
        onChangeText={value => setFieldValue(item.id, value)}
        tintColor={colors.primary}
        // onSubmitEditing={() => this.onSubmitEditing(index, props)}
        selectTextOnFocus
        spellCheck={false}
        name={item.id}
        key={item.id}
        multiline={item.multiline}
      />
    );
  }

  validation(values) {
    const { address, stellarTransactionType, testnet, crypto_type } = values;

    const error = validateCrypto2(address, crypto_type, testnet);

    if (error) {
      return { address: error };
    }
    if (crypto_type.match(/stellar/)) {
      if (
        stellarTransactionType === 'federation' &&
        address.indexOf('*') === -1
      ) {
        return { address: 'Not a valid federated stellar address' };
      }
    }
  }

  render() {
    const { type, onDetailClose, testnet, design } = this.props;
    const initialValues = {
      ...EMPTY_CRYPTO,
      crypto_type: cryptoType(type),
      network: testnet ? 'testnet' : 'mainnet',
      testnet,
      stellarTransactionType: 'public',
    };

    return (
      <Formik
        ref={form => {
          this.CryptoAccountsForm = form;
        }}
        validate={values => this.validation(values)}
        initialValues={initialValues}>
        {props => (
          <View>
            <View>
              <View pb={1}>
                <Text t="h6">
                  {standardizeString(
                    'Add new ' + cryptoName(type) + ' address',
                  )}
                </Text>
              </View>
              {type.includes('XLM') && (
                <RadioSelector
                  title="Address type"
                  items={[
                    { value: 'public', label: 'Public address & memo' },
                    { value: 'federation', label: 'Federation address' },
                  ]}
                  handleChange={value =>
                    props.setFieldValue('stellarTransactionType', value)
                  }
                  value={props.values.stellarTransactionType}
                />
              )}
              {this.renderInput(props, cryptoAccounts.name)}
              {this.renderInput(props, cryptoAccounts.address)}
              {(props.values.crypto_type === 'XLM' ||
                props.values.crypto_type === 'TXLM') &&
                props.values.stellarTransactionType === 'public' && (
                  <View>
                    {this.renderInput(props, cryptoAccounts.memo)}
                    <View pt={1}>
                      {this.renderInput(props, cryptoAccounts.memoSkip)}
                    </View>
                  </View>
                )}

              <ErrorOutput>{props.status && props.status.error}</ErrorOutput>
            </View>

            <CardActions
              actionOne={{
                id: 'save',
                onPress: () => this.handleSubmit(props),
                disabled: !props.isValid || props.isSubmitting,
                loading: props.isSubmitting,
              }}
              actionTwo={{
                id: 'cancel',
                onPress: onDetailClose,
              }}
              borderRadius={design.cards.cornerRadius}
            />
          </View>
        )}
      </Formik>
    );
  }
}

const CryptoAccountFormNoType = context(_CryptoAccountFormNoType);

export { CryptoAccountFormNoType };
