import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useRehiveContext } from 'contexts';
import { getWyreAccounts } from 'utility/rehive';
import WyreAddBankAccount from 'components/wyre/WyreAddBankAccount';
import { View } from 'components';

export default function WyreBankAccount(props) {
  const { completedSections, submitForm } = props;
  const {
    context: { user },
  } = useRehiveContext();

  const [refetchInterval, setRefetchInterval] = React.useState(1000);

  const { data: wyreAccounts, isLoading: loadingWyreAccounts } = useQuery(
    [user?.id, 'wyre-accounts'],
    getWyreAccounts,
    {
      enabled: true,
      refetchInterval,
    },
  );

  useEffect(() => {
    if (wyreAccounts?.results?.[0]) setRefetchInterval(false);
  }, [wyreAccounts]);

  const wyreAccount = {
    item: wyreAccounts?.results?.[0],
    loading: loadingWyreAccounts,
  };
  // useEffect(() => {
  //   if (!wyreAccounts?.results?.[0]) refetch();
  // }, [completedSections]);

  const context = {
    wyreAccount,
    user,
  };

  function handleSuccess() {
    submitForm();
  }

  return (
    <View ph={1}>
      <WyreAddBankAccount
        noPadding
        context={context}
        isOnboardingComplete={completedSections > 4}
        onSuccess={handleSuccess}
      />
    </View>
  );
}
