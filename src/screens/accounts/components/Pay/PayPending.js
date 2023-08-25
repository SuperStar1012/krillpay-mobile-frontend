import React from 'react';

import PaymentPending from 'components/outputs/PaymentPending';
import { usePolling } from 'hooks/data';
import { getTransactionCollections } from 'utility/rehive';

export default function PayPending(props) {
  const { result, onSuccess: handleSuccess, setFormState } = props;
  const { id } = result ?? {};

  function onSuccess(resp) {
    setFormState('success');
    handleSuccess(resp);
  }

  function onFail(resp) {
    handleSuccess(resp);
    setFormState('error');
  }

  usePolling({
    queryId: ['transaction-collection', id],
    queryFn: () => getTransactionCollections({ id }),
    refetchInterval: 1000,
    timeout: 30000,
    onSuccess,
    onFail,
    enabled: !!id,
    successFn: item => item?.transactions?.[0]?.status === 'Complete',
    failFn: item => item?.transactions?.[0]?.status === 'Failed',
    getItem: data => data?.results?.[0],
  });

  return <PaymentPending pt={0} pb={2} mt={-1} />;
}
