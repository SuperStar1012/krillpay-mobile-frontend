import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Sale from './pages/sale';
import Landing from './pages/landing';
import RedeemVoucher from './pages/redeemVoucher';
import TopUp from './pages/topup';
import QR from './pages/qr';
import { useRehiveContext, useAccounts } from 'contexts';
import { useQuery } from 'react-query';
import { getManagerSellers } from 'utility/rehive';

const Screens = {
  Landing,
  Sale,
  QR,
  RedeemVoucher,
  TopUp,
};

const Stack = createStackNavigator();

export default function PoSNavigator(props) {
  const { context: rehiveContext } = useRehiveContext();
  const { context: accountsContext } = useAccounts();

  const { data, isLoading } = useQuery(
    [rehiveContext?.user?.id, 'manager-sellers'],
    getManagerSellers,
    { retry: false },
  );

  const sellers = data?.results ?? [];
  const seller = sellers?.[0] ?? {};

  const context = {
    ...rehiveContext,
    ...accountsContext,
    seller,
    loading: isLoading,
  };
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      backBehavior="initialRoute"
      screenOptions={{ headerShown: false }}>
      {Object.keys(Screens).map(key => (
        <Stack.Screen key={key} name={key}>
          {props => {
            const Screen = Screens?.[key];
            return <Screen {...props} context={context} />;
          }}
        </Stack.Screen>
      ))}
    </Stack.Navigator>
  );
}
