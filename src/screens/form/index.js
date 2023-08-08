import React from 'react';

import { View } from 'components';
import Form from 'components/form';
import { cryptoCodeToType } from 'utility/general';
import HeaderNew from 'components/layout/HeaderNew';

export default function FormScreen(props) {
  const { navigation, route } = props;
  const {
    wallet,
    variant,
    onSuccess,
    context,
    ph = 1.5,
    isCrypto,
  } = route?.params ?? {};

  function handleSuccess(item) {
    onSuccess(item, true);
    navigation.goBack();
  }

  return (
    <View screen>
      <HeaderNew title={'add_' + variant} navigation={navigation} />
      <View pt={1} pb={3} ph={ph} scrollView keyboardAvoiding>
        <Form
          currency={wallet}
          listType={cryptoCodeToType(isCrypto)}
          type={isCrypto}
          variant={variant}
          initialCurrency={wallet?.currency?.code}
          onSuccess={handleSuccess}
          context={context}
        />
      </View>
    </View>
  );
}
