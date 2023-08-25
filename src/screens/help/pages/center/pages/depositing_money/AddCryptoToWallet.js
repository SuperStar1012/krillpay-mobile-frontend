import React from 'react';
import { View } from 'components';
import NumberedList from 'screens/help/components/NumberedList';
import HelpText from 'screens/help/components/HelpText';

export default function AddCryptoToWallet(props) {
  return (
    <View mh={1.5} pt={1}>
      <HelpText id="how_do_i_add_crypto_to_my_wallet_text" />
      <Exchange />
      <Receive />
    </View>
  );
}
function Exchange(props) {
  return (
    <View pt={1}>
      <NumberedList id="add_crypto_exchange_step" length={3} title />
    </View>
  );
}

function Receive(props) {
  return (
    <View pt={1}>
      <NumberedList id="add_crypto_receive_step" length={2} title />
    </View>
  );
}
