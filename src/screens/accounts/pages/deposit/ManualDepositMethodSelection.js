import React from 'react';
import { Text, View } from 'components';
import { FlatList } from 'react-native';
import ManualDepositAccountCard from './ManualDepositAccountCard';

export default function ManualDepositMethodSelection(props) {
  const {
    context: { combinedManualAccounts },
  } = props;

  const handleOnAccountSelect = account => {
    props?.context?.setSelectedManualAccount(account);
    props?.send('NEXT');
  };

  return (
    <View ph={1.5} f={1}>
      <Text s={18} fW={'700'} paragraph tA={'center'} id="deposit_method" />
      <Text s={14} paragraph tA={'center'} id="deposit_funds_description" />
      <View pv={0.5} />
      <FlatList
        keyboardShouldPersistTaps={'handled'}
        data={combinedManualAccounts}
        renderItem={({ item }) => (
          <ManualDepositAccountCard
            account={item}
            onAccountSelect={handleOnAccountSelect}
          />
        )}
        keyExtractor={item => item?.id}
      />
    </View>
  );
}
