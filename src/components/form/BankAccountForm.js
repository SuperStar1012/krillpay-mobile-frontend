import React, { Component } from 'react';

import { Formik } from 'formik';
import { difference } from 'lodash';
import {
  updateItem,
  addBankAccountCurrency,
  deleteBankAccountCurrency,
} from 'utility/rehive';
import { EMPTY_BANK_ACCOUNT } from 'config/empty_objects';
import * as _inputs from 'config/inputs/inputs';
import { CardActions } from 'components/card';
import { Text, View, TextField } from 'components';
import context from 'components/context';
import AccountCurrencySelector from 'screens/accounts/components/AccountCurrencySelector';
import { bank_account, address } from 'config/inputs';
import FormikInput from 'components/inputs/FormikInput';
import WyreAddBankAccount from 'components/wyre/WyreAddBankAccount';
import { checkWyreService } from 'extensions/wyre/util';

class _BankAccountForm extends Component {
  state = {
    fields: [],
  };

  componentDidMount() {
    const fields = Object.keys(EMPTY_BANK_ACCOUNT).map(
      key => bank_account[key] ?? address[key],
    );

    this.setState({ fields });
  }

  async handleFormSubmit(props) {
    const { onSuccess } = this.props;
    const { values, setSubmitting, setStatus } = props; // FormikProps
    const newCurrencies = values.currencies;
    setSubmitting(true);
    try {
      let data = values;
      data.branch_address = { ...values };
      delete data.currencies;
      const resp = await updateItem('bank_account', data);
      const oldCurrencies = resp.currencies.map(item => item.code);
      const toAdd = difference(newCurrencies, oldCurrencies);
      let i = 0;
      for (i = 0; i < toAdd.length; i++) {
        await addBankAccountCurrency(resp.id, toAdd[i]);
      }
      const toRemove = difference(oldCurrencies, newCurrencies);
      for (i = 0; i < toRemove.length; i++) {
        await deleteBankAccountCurrency(resp.id, toRemove[i]);
      }
      onSuccess(resp);
    } catch (error) {
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

  render() {
    const { initialCurrency, item, design, context, onClose, onSuccess } =
      this.props;
    const { fields } = this.state;
    const initialValues = item
      ? {
          ...item,
          ...(item?.branch_address ?? {}),
          currencies: item.currencies.map(item => item.code),
        }
      : {
          ...EMPTY_BANK_ACCOUNT,
          currencies: initialCurrency ? [initialCurrency] : [],
        };

    const hasWyre = checkWyreService(context?.services ?? {});

    if (hasWyre)
      return (
        <WyreAddBankAccount
          reducedHeight
          onSuccess={onSuccess}
          onBack={onClose}
        />
      );

    return (
      <Formik
        ref={input => {
          this.BankAccountForm = input;
        }}
        initialValues={initialValues}>
        {props => (
          <View>
            <View bC={'surfaceCard'}>
              <AccountCurrencySelector
                setValue={value => props.setFieldValue('currencies', value)}
                values={props.values?.currencies ?? []}
                item={item}
              />
              {fields.map((field, index) =>
                field.id === 'currencies' ? null : (
                  <FormikInput
                    field={field}
                    key={field.id}
                    formikProps={props}
                  />
                ),
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
              }}
              actionOne={{
                id: 'cancel',
                type: 'text',
                onPress: onClose,
              }}
              borderRadius={design.cards.cornerRadius}
            />
          </View>
        )}
      </Formik>
    );
  }
}

const BankAccountForm = context(_BankAccountForm);

export { BankAccountForm };
