import React, { useState, useEffect } from 'react';
import { get } from 'lodash';

import * as yup from 'yup';
import { View, Button } from 'components';

import { Formik } from 'formik';

import ResultPage from 'components/layout/ResultPage';

import PrepaidVoucherList from './PrepaidVoucherList';
import PaymentMethodSelector from './PaymentMethodSelector';
import CurrencySelector from '../../components/CurrencySelector';
import {
  getStripePaymentMethods,
  getIndacoinUser,
} from 'utility/rehive';
import ErrorOutput from 'components/outputs/ErrorOutput';
import IndacoinConfirm from './IndacoinConfirm';

import BankConfirm from './BankConfirm';
import IndacoinInput from './IndacoinInput';
import StripeCardConfirm from './StripeCardConfirm';
// import VoucherConfirm from './VoucherConfirm';
// import VoucherInput from './VoucherInput';

const PrepaidForm = props => {
  const {
    currency,
    currencies,
    initialValues,
    actionsConfig,
    onSuccess,
    indacoinTransactionsHook,
  } = props;

  const prepaidConfig = get(actionsConfig, [
    'prepaid',
    'config',
    get(currency, ['currency', 'code']),
  ]);

  const { defaultProvider, providers = [] } = prepaidConfig;

  const hasCard = providers.includes('stripe_card');
  const hasBank = providers.includes('bank');
  const hasIndacoin = providers.includes('indacoin');
  const singleProvider = providers.length === 1;
  const showPaymentMethodSelector =
    !singleProvider || providers[0] === 'stripe_card';

  const defaultPayment = defaultProvider
    ? defaultProvider
    : providers.length
    ? providers[0]
    : '';
  const isCardDefaultPayment =
    (hasCard && defaultPayment === 'stripe_card') ||
    (singleProvider && providers[0] === 'stripe_card');

  const [state, setState] = useState('');

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(isCardDefaultPayment);
  const [cardPaymentMethods, setCardPaymentMethods] = useState([]);
  const [indacoinUser, setIndacoinUser] = useState(null);
  const [voucherCompany, setVoucherCompany] = useState(null);

  useEffect(() => {
    async function handleGetPaymentMethods() {
      const resp = await getStripePaymentMethods();
      if (resp && resp.status === 'success' && resp.data) {
        let { data } = resp;
        setCardPaymentMethods(data);
      } else {
        // onSuccess();
      }
      setLoading(false);
    }
    async function handleIndacoin() {
      const resp = await getIndacoinUser();
      setIndacoinUser(get(resp, ['data', 'id']));
      setLoading(false);
    }

    if (hasCard) {
      handleGetPaymentMethods();
    }
    if (hasIndacoin) {
      handleIndacoin();
    }
  }, [hasBank, hasCard, hasIndacoin, isCardDefaultPayment]);

  if (!hasCard && !hasBank && !hasIndacoin && !hasVoucher) {
    return <ErrorOutput>This app has not set up adding funds</ErrorOutput>;
  }

  if (!currency) {
    return null;
  }

  const validationSchema = yup.object().shape({
    amount: yup
      .string()
      .required((hasIndacoin ? 'Amount' : 'Voucher') + ' is required'),
    paymentMethod: yup.string().required('Payment method is required'),
  });
  const defaultVoucher = get(prepaidConfig, ['fixed', 'default'], '');

  const formInitialValues = {
    amount: defaultVoucher,
    paymentMethod: defaultPayment,
    stripeId: get(cardPaymentMethods, [0, 'id'], ''),
    ...initialValues,
  };

  const sharedProps = {
    currency,
    setState,
    config: prepaidConfig,
    setLoading,
    setResult,
    voucherCompany,
    loading,
    cardPaymentMethods,
    onSuccess,
  };

  function handleCurrencyUpdate(currency, formikProps) {
    formikProps.setFieldValue('currency', currency);
  }

  function handleSuccess() {
    if (result.status === 'success' || result.status === 'succeeded') {
      setState('');
      setResult(null);
      props.navigation.replace('CurrencyDetail', {
        currencyCode: get(currency, ['currency', 'code']),
        accountRef: get(currency, 'account'),
      });
    } else {
      setState('');
      setResult(null);
    }
  }

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      enableReinitialize={isCardDefaultPayment || hasIndacoin}
      isInitialValid={
        ((cardPaymentMethods.length && hasCard) || hasBank) && defaultVoucher
      }>
      {formikProps =>
        result ? (
          <ResultPage
            {...sharedProps}
            formikProps={formikProps}
            onReset={handleSuccess}
            onSuccess={handleSuccess}
            result={result}
            text={
              result.status === 'succeeded' || result.status === 'success'
                ? 'Payment successful'
                : 'Something went wrong'
            }
          />
        ) : state === 'confirm' ? (
          <AddFundsConfirm {...sharedProps} formikProps={formikProps} />
        ) : (
          <View scrollView p={1} w="100%">
            <CurrencySelector
              // rates={rates}
              config={actionsConfig}
              action="prepaid"
              item={get(formikProps, ['values', 'currency'])}
              // returnIndex
              items={currencies.data}
              updateItem={item => handleCurrencyUpdate(item, formikProps)}
            />
            {showPaymentMethodSelector && (
              <PaymentMethodSelector
                loading={loading}
                providers={providers}
                changeText={
                  cardPaymentMethods.length > 1 || hasBank
                    ? 'Change'
                    : 'Add card'
                }
                {...sharedProps}
                formikProps={formikProps}
              />
            )}
            <AddFundsInput
              {...sharedProps}
              formikProps={formikProps}
              indacoinUser={indacoinUser}
            />
          </View>
        )
      }
    </Formik>
  );
};

export default PrepaidForm;

function AddFundsInput(props) {
  const { formikProps, setState } = props;
  const paymentMethod = get(formikProps, ['values', 'paymentMethod']);

  switch (paymentMethod) {
    case 'indacoin':
      return <IndacoinInput {...props} />;
    default:
      return (
        <React.Fragment>
          <PrepaidVoucherList {...props} />
          <Button
            wrapperStyle={{ marginBottom: 16, marginTop: 24, padding: 0 }}
            {...{
              label: 'CONTINUE',
              wide: true,
              color: 'primary',
              disabled: !formikProps.isValid || formikProps.isSubmitting,
              loading: formikProps.isSubmitting,
              onPress: () => setState('confirm'),
            }}
          />
        </React.Fragment>
      );
  }
}

function AddFundsConfirm(props) {
  const { formikProps } = props;
  const paymentMethod = get(formikProps, ['values', 'paymentMethod']);

  switch (paymentMethod) {
    case 'indacoin':
      return <IndacoinConfirm {...props} />;
    case 'card':
    case 'stripe_card':
      return <StripeCardConfirm {...props} />;
    default:
      return <BankConfirm {...props} />;
  }
}
