import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SendPage from 'screens/accounts/pages/send';
import SendNaira from 'screens/accounts/pages/sendNaira';
import ReviewTransaction from 'screens/accounts/pages/review/ReviewTransaction';
import TransactionCompleteScreen from 'screens/accounts/pages/transactionCompleteScreen';
const Stack = createStackNavigator();

export default function SendNairaNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animationEnabled: false }}>
      <Stack.Screen name="SendNaira" component={SendNaira} />
      <Stack.Screen name="Send" component={SendPage} />
      <Stack.Screen name="Review_Transaction" component={ReviewTransaction} />
      <Stack.Screen
        name="Transaction_Complete"
        component={TransactionCompleteScreen}
      />
    </Stack.Navigator>
  );
}
