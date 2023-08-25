import React, { useState } from 'react';
import { get } from 'lodash';
import { View, Text, Button, Spinner } from 'components';
import * as WebBrowser from 'expo-web-browser';
import { ModalFullscreen } from 'components/modals/ModalFullscreen';

import { TouchableOpacity, StyleSheet } from 'react-native';
import { useModal } from 'utility/hooks';
import { CardTitle } from 'components/card/CardTitle';
import { objectToArray, standardizeString } from 'utility/general';
import StripePayment from './StripePayment';

const PaymentMethodSelector = props => {
  let {
    // data,
    formikProps,
    title = 'Select payment method',
    loading,
    changeText,
    currency,
    providers,
    cardPaymentMethods,
    disabled,
  } = props;
  const [state, setState] = useState('');
  if (!formikProps) {
    return null;
  }
  const { values, setFieldValue } = formikProps;
  const { paymentMethod, stripeId } = values;
  const { modalVisible, hideModal, showModal } = useModal();

  function updateValue(item) {
    setFieldValue(
      'paymentMethod',
      item.type === 'card' ? 'stripe_card' : item.type,
    );
    setFieldValue('stripeId', item.type === 'card' ? item.id : '');

    handleModalDismiss();
  }

  function handleModalDismiss() {
    hideModal();
    setState('');
  }

  async function handleWebBrowser(link) {
    handleModalDismiss();
    await WebBrowser.openBrowserAsync(link);
  }

  const hasCard = providers.includes('stripe_card');
  const hasBank = providers.includes('bank');
  let data = [];

  if (hasBank) {
    data = [{ id: 'bank', type: 'bank' }];
  }
  if (hasCard) {
    data = data.concat(cardPaymentMethods);
  }

  let value = {
    id: 'bank',
    type: 'bank',
  };
  if (paymentMethod === 'stripe_card') {
    if (!stripeId) {
      value = cardPaymentMethods[0];
    } else {
      value = cardPaymentMethods.find(item => item.id === stripeId);
    }
  }

  return (
    <React.Fragment>
      <TouchableOpacity onPress={showModal} disabled={disabled}>
        {loading ? (
          <Spinner containerStyle={{ minHeight: 98 }} />
        ) : value ? (
          <View
            style={{ paddingBottom: 16, paddingRight: 8 }}
            fD="row"
            aI="center">
            <PaymentMethodSelectorCard
              disabled
              item={value}
              containerStyle={{ padding: 8, flex: 1 }}
            />
            {!disabled && (
              <Text c="primary" width="auto">
                {changeText}
              </Text>
            )}
          </View>
        ) : (
          <View h={100} aI="center" jC="center" w="100%">
            <Text c="primary">{title}</Text>
          </View>
        )}
      </TouchableOpacity>

      <ModalFullscreen
        action={
          state === 'add'
            ? { label: 'Cancel', onPress: () => setState('') }
            : { label: 'Add new card', onPress: () => setState('add') }
        }
        visible={modalVisible}
        scrollView
        title={state === 'add' ? 'Add new card' : title}
        onDismiss={handleModalDismiss}
        docked>
        <View pb={1} w={'100%'} ph={0.25}>
          {state === 'add' ? (
            <StripePayment
              currency={currency}
              handleWebBrowser={handleWebBrowser}
            />
          ) : (
            data.map((item, index) => (
              <PaymentMethodSelectorCard
                key={item.id}
                onPress={() => updateValue(item)}
                item={item}
                p={0.5}
              />
            ))
          )}
        </View>
      </ModalFullscreen>
    </React.Fragment>
  );
};

export default PaymentMethodSelector;

const config = {
  stripe_card: {
    title: 'Card',
  },
};

export const PaymentMethodSelectorCard = props => {
  let { item, ...restProps } = props;
  if (!item) {
    return <View style={{ padding: 8, flex: 1 }} />;
  }

  const { type = '', card } = item;
  let title = get(config, [item.type, 'title'], standardizeString(item.type));
  let description = '';
  let brand = '';
  let brandIcon = false;

  if (type.match(/stripe_card|card/) && card) {
    brand = get(card, ['brand']);
    brandIcon = brand.match(/visa|amex|mastercard/);
    if (brandIcon) {
      title = title + ' **' + get(card, ['last4']);
    } else {
      description =
        standardizeString(brand ? brand : 'Other') +
        ' **' +
        get(card, ['last4']);
    }
  }

  const Content = (
    <Button containerStyle={{ padding: 8 }} {...restProps}>
      <CardTitle
        containerStyle={{ paddingTop: 0 }}
        title={title}
        subtitle={description}
        badge={brandIcon ? brand : ''}
        customIcon={item.type}
      />
      {/* {description ? <Content text={description} /> : <View />} */}
    </Button>
  );

  // if (isCard) {
  //   return <Card onPress={onPress}>{Content}</Card>;
  // }
  return Content;
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: 'lightgray',
    margin: 8,
    borderRadius: 20,
  },
});
