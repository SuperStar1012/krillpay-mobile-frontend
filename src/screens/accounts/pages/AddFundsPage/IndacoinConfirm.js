import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { cryptoSelector } from '@redux/selectors';
import { createIndacoinTransaction } from 'utility/rehive';
import { Text } from 'components';
import ConfirmPage from 'components/layout/ConfirmPage';
import { formatAmountString } from '../../util/rates';
import { formatDivisibility } from 'utility/general';

export default function IndacoinConfirm(props) {
  const { formikProps, config, currency, setState } = props;
  const { values, setFieldValue, setFieldTouched } = formikProps;
  const { amount, indacoinRate } = values;
  const [quote, setQuote] = useState(null);
  const crypto = useSelector(cryptoSelector);

  useEffect(() => {
    async function handleCreate() {
      const { memo = '', public_address = '' } = get(
        crypto,
        ['XLM', 'user', 'crypto'],
        {},
      );
      let data = {
        cur_in: 'EUR',
        cur_out: currency.currency.code,
        amount_in: parseFloat(amount) * 100,
        tag: '',
      };
      if (currency.currency.code === 'INTT') {
        data.target_address = '0xA5A87aC428c0D78c93F9E86DCE6Fde53dfb4fA71';
        data.tag = 'test';
      } else {
        data.target_address = public_address;
        data.tag = memo;
      }
      const resp = await createIndacoinTransaction(data);
      if (resp.status === 'success') {
        setQuote(resp.data);
      }
    }

    handleCreate();
  }, [amount, config, crypto, currency?.account, currency.currency.code]);

  const B = props => (
    <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>
  );
  const TextComp = (
    <Text tA={'center'} p={1}>
      {'You are about to purchase '}
      <B>{formatAmountString(indacoinRate, currency.currency)}</B>
      {' for '}
      <B>{formatDivisibility(parseFloat(amount) * 100, 2) + ' EUR'}</B>
    </Text>
  );

  return (
    <ConfirmPage
      onConfirm={() => {
        setState('');
        setFieldValue('amount', '');
        setFieldTouched('amount', '');
      }}
      href={quote ? quote.payment_url : ''}
      text={
        'You will be directed to Indacoin.com. Services relating to credit card payments are provided by Indacoin, which is a separate platform owned by a third party.'
      }
      disabled={!Boolean(quote)}
      textVariant="body2"
      textComp={TextComp}
      onBack={() => setState('')}
      formikProps={formikProps}
      backButtonText={'CANCEL'}
    />
  );
}
