import React, { useState } from 'react';

import { View, Text, Button } from 'components';
import Cart from '../../components/CartNew';

import { useCart } from '../../util/contexts/CartContext';
import HeaderNew from 'components/layout/HeaderNew';
import CheckoutRequired from './CheckoutRequired';
import Stepper from 'components/layout/Stepper';
import CheckoutPay from './CheckoutPay';
import EmptyListPlaceholderImage from 'components/outputs/CustomImage/empty/EmptyListPlaceholderImage';
import { useRehiveContext } from 'contexts/RehiveContext';
import { useDispatch } from 'react-redux';
import { fetchAccounts } from 'screens/accounts/redux/actions';
import { getOrderPayment } from 'utility/rehive';
import CheckoutPending from './CheckoutPending';
import { usePolling } from 'hooks/data';

export default function Checkout(props) {
  const { navigation } = props;
  const cartContext = useCart();
  const {
    context: { company, services },
  } = useRehiveContext();
  const dispatch = useDispatch();
  const refreshAccounts = () => dispatch(fetchAccounts(services));
  const { currency, cart, items, resetCart } = cartContext;

  const [orderData, setOrderData] = useState({});
  const [step, setStep] = useState('cart');
  const [paymentId, setPaymentId] = useState('');

  function handleSuccess(result) {
    if (result?.data?.status === 'pending') {
      setPaymentId(result?.data?.id);
      setStep('pending');
    } else if (result?.status === 'success') {
      refreshAccounts();
      resetCart();
      navigation.navigate('CheckoutResult', { result, cart, items });
    }
  }

  usePolling({
    queryId: ['orderPayment', cart.id, paymentId],
    queryFn: () => getOrderPayment(cart.id, paymentId),
    refetchInterval: 1000,
    timeout: 30000,
    enabled: step === 'pending' && !!paymentId,
    onSuccess: data => handleSuccess({ status: 'success', data }),
    successFn: item => item?.status === 'complete',
  });

  if (!currency || !cart || !cart?.total_price) {
    return (
      <View screen>
        <HeaderNew navigation={navigation} />
        <Text p={2} tA="center" id="cart_empty"></Text>
        <EmptyListPlaceholderImage id="product" text="" />
        <View ph={2}>
          <Button wide id="cart_back_button" onPress={navigation.goBack} />
        </View>
      </View>
    );
  }

  const {
    requires_billing_address,
    requires_contact_email,
    requires_contact_mobile,
    requires_shipping_address,
  } = cart;
  const showRequired =
    requires_billing_address ||
    requires_contact_email ||
    requires_contact_mobile ||
    requires_shipping_address;

  let steps = ['cart'];
  if (showRequired) steps.push('details');
  steps.push('checkout');

  const stepIndex = steps.findIndex(item => item === step);
  const stepperProps = { steps, step, setStep };

  function handleBack() {
    if (stepIndex === 0) {
      navigation.goBack();
    } else {
      setStep(steps?.[stepIndex - 1] ?? '');
    }
  }

  // TODO: Add logic to disable stepper if conditions not met
  return (
    <View screen>
      <HeaderNew navigation={navigation} handleBack={handleBack} />
      {!step?.match(/checkout|pending/) && <Stepper {...stepperProps} />}

      {step === 'checkout' ? (
        <CheckoutPay
          {...cartContext}
          company={company}
          services={services}
          orderData={orderData}
          onCancel={handleBack}
          onSuccess={handleSuccess}
        />
      ) : step === 'details' ? (
        <CheckoutRequired
          {...cartContext}
          orderData={orderData}
          setOrderData={setOrderData}
          onCancel={handleBack}
          onSuccess={() => setStep('checkout')}
        />
      ) : step === 'pending' ? (
        <CheckoutPending />
      ) : (
        <Cart
          {...cartContext}
          onSuccess={() => setStep(steps?.[1])}
          onCancel={handleBack}
        />
      )}
    </View>
  );
}
