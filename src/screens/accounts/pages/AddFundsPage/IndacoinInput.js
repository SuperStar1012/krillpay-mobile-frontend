import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import FormikInput from 'components/inputs/FormikInput';
import ErrorOutput from 'components/outputs/ErrorOutput';
import { Button } from 'components';
import { getIndacoinRate } from 'utility/rehive';
import { formatDivisibility } from 'utility/general';
import { getCurrencyCode } from '../../util/rates';

export default function IndacoinInput(props) {
  const { formikProps, indacoinUser, currency, setState } = props;
  const { values, setFieldValue } = formikProps;
  const { amount, indacoinRate } = values;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer = null;

    async function fetchRate() {
      const resp = await getIndacoinRate(
        'EUR',
        get(currency, ['currency', 'code']),
        parseFloat(amount),
        'lfetoken',
        indacoinUser,
      );
      if (resp > 0) {
        setFieldValue('indacoinRate', resp);
      } else {
        setError(
          'This service is not available at the moment. Please check back later.',
        );
      }
      setLoading(false);
    }

    if (parseFloat(amount) >= 30) {
      setLoading(true);
      timer = setTimeout(() => {
        fetchRate();
      }, 500);
    } else {
      setFieldValue('indacoinRate', 0);
      setError('');
    }
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, indacoinUser, amount]);

  const helper = indacoinRate
    ? '~' +
      formatDivisibility(parseFloat(indacoinRate), 0) +
      ' ' +
      getCurrencyCode(currency.currency)
    : 'Minimum 30 EUR';

  return (
    <React.Fragment>
      <FormikInput
        field={{ label: 'Amount [EUR]', id: 'amount', helper }}
        formikProps={formikProps}
      />
      <ErrorOutput>{error}</ErrorOutput>
      <Button
        wrapperStyle={{ marginBottom: 16, marginTop: 8, padding: 0 }}
        {...{
          label: 'CONTINUE',
          wide: true,
          color: 'primary',
          disabled:
            loading || !get(formikProps, ['values', 'indacoinRate']) > 0,
          loading: loading,
          onPress: () => setState('confirm'),
        }}
      />
    </React.Fragment>
  );
}
