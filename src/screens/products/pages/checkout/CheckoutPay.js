import React, { useState } from 'react';
import { View, Button } from 'components';
import { standardizeString } from 'utility/general';
import { formatAmountString, useConversion } from 'utility/rates';
import RecipientHeader from 'components/layout/RecipientHeader';
import AmountLayout from 'components/layout/Amount';
import { CurrencyCard } from 'screens/accounts/components/CurrencyCard';
import PageContent from 'components/layout/PageContent';
import { updateOrder, createOrderPayment } from 'utility/rehive';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import {
  primaryCurrenciesSelector,
  conversionRatesSelector,
} from 'screens/accounts/redux/reducer';

export default function CheckoutPay(props) {
  const { cart, onSuccess, onCancel, orderData, company, services } = props;

  const primaryCurrencies = useSelector(primaryCurrenciesSelector);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const rates = useSelector(conversionRatesSelector);

  const currency = primaryCurrencies?.items?.find(
    item => item?.currency?.code === props?.currency?.code,
  );

  const { seller, total_price } = cart ?? {};

  const priceString = formatAmountString(total_price, currency?.currency, true);

  const insufficientFunds =
    cart && (currency?.available_balance ?? 0) < cart.total_price; // TODO:

  const { convAvailable, convRate } = useConversion(
    total_price,
    services,
    currency?.currency,
    true,
  );

  async function confirmPurchase() {
    setLoading(true);
    try {
      if (!isEmpty(orderData)) await updateOrder(cart.id, orderData);
      const resp = await createOrderPayment(cart.id);
      if (resp.status === 'success') {
        onSuccess(resp);
      } else {
        let error = '';
        if (
          resp.message.includes('transaction') &&
          resp.message.includes('amount')
        ) {
          if (resp.message.includes(' 0.0')) {
            error = `You're unable to complete this purchase, required tier not met.`;
          } else {
            error = `You've reached your purchase limit, required tier not met.`;
          }
        } else {
          error =
            'Unable to complete purchase' +
            (resp.message ? ': ' + resp.message : '');
        }

        setError(error);
      }
    } catch (error) {
      console.log(error);
      setError(error?.message);
    }

    setLoading(false);
  }

  return (
    <View scrollView>
      <RecipientHeader
        name={seller?.name ?? company?.name ?? standardizeString(company?.id)}
        image={seller?.icon ?? company?.icon ?? 'product'}
      />
      <PageContent>
        <AmountLayout
          // onEdit={showEdit ? () => setFieldValue('editing', true) : null}
          amount={priceString}
          convAmount={convAvailable}
          convCurrency={rates.displayCurrency}
          currency={currency}
          rate={convRate}
          hideRate
        />
      </PageContent>
      <PageContent>
        <CurrencyCard item={currency} rates={rates} />
      </PageContent>

      <PageContent>
        <ErrorOutput>{error}</ErrorOutput>
      </PageContent>

      {/* <AccountCurrencySelector
        rates={rates}
        // accountItems={[]}
        // accountItem={n}
        currencyItems={currencyItems}
        currencyItem={wallet}
        onAccountChange={item => setAccountRef(item.reference)}
        onCurrencyChange={item => {
          setCurrencyCode(item?.currency?.code);
          setConversionQuote(null);
        }}
      /> */}

      <View ph={1.5}>
        <Button
          color={'primary'}
          id={'pay'}
          wide
          loading={loading}
          disabled={loading || insufficientFunds}
          onPress={() => confirmPurchase()}
        />
        <Button wide type={'text'} id={'cancel'} onPress={onCancel} />
      </View>
    </View>
  );
}
