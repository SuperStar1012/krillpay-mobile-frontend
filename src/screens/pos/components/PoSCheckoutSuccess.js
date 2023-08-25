import React from 'react';
import { View } from 'components';
import ResultPage from 'components/layout/ResultPageNew';
import PayDetails from 'screens/accounts/components/Pay/PayDetails';
import PosSuccessHeader from './PoSSuccessHeader';
import { useDispatch } from 'react-redux';
import { fetchAccounts } from '@redux/actions';
import { useQueryClient } from 'react-query';

export default function PoSCheckoutSuccess(props) {
  const { setState, setItems, data, context = {} } = props;
  console.log('PoSCheckoutSuccess -> props', props);
  const dispatch = useDispatch();
  const { user } = context;
  const queryClient = useQueryClient();

  function handleNext() {
    dispatch(fetchAccounts());
    queryClient.invalidateQueries([
      user?.id,
      'transactions',
      { account: data?.account, currency: data?.currency?.code },
    ]);
    setItems([]);
    setState('');
  }

  return (
    <View w="100%" screen f={1}>
      <ResultPage
        amount={data?.request_amount}
        title="RECEIVED"
        state="success"
        onNext={handleNext}
        header={<PosSuccessHeader {...props} />}
        detail={<PayDetails request={data} />}
        currency={data?.request_currency}
      />
    </View>
  );
}
