import React from 'react';
import { getTransactions } from 'utility/rehive';
import { usePolling } from 'hooks/data';
import PaymentPending from 'components/outputs/PaymentPending';

export default function SendPending(props) {
  const { send, result = {}, context, methods, setResult } = props;
  const { id } = result ?? {};
  const { user } = context;

  function onSuccess(resp) {
    send('NEXT');
    setResult(resp);
    methods?.refreshAccounts();
  }

  function onFail(resp) {
    setResult(resp);
    send('FAIL');
  }

  usePolling({
    queryId: [user?.id, 'transaction', id],
    queryFn: () => getTransactions({ id }),
    refetchInterval: 1000,
    timeout: 30000,
    onSuccess,
    onFail,
    enabled: !!id,
    successFn: item => item?.status === 'Complete',
    failFn: item => item?.status === 'Failed',
    getItem: data => data?.results?.[0],
  });

  return <PaymentPending />;

  // return (
  //   <ResultPage
  //     {...props}
  //     {...{
  //       amount,
  //       display,
  //       title: 'send',
  //       variant: 'new',
  //     }}
  //     // result={isConfirm ? { status: 'confirm' } : props.result}
  //     // secondaryAction={{
  //     //   label: 'Continue shopping',
  //     //   onPress: navigation.goBack,
  //     // }}
  //   />
  // );
}
