import React, { useState } from 'react';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import { PopUpGeneral } from 'components/layout/PopUpGeneral';
import AccountCurrencyCard from 'components/cards/AccountCurrencyCard';

export default function TransferCurrencySelector(props) {
  const {
    options,
    items = options,
    onValueChange,
    children,
    disabled,
    title,
  } = props;

  const [modalVisible, setModalVisible] = useState(false);

  function showModal() {
    setModalVisible(true);
  }

  function hideModal() {
    setModalVisible(false);
  }

  function onPress(item) {
    onValueChange(item.account);
    hideModal();
  }

  return (
    <React.Fragment>
      <Button
        disabled={disabled}
        onPress={() => (disabled ? null : showModal())}>
        {children}
      </Button>
      <PopUpGeneral
        visible={modalVisible}
        title={title}
        scrollView
        onDismiss={() => hideModal()}
        docked>
        <View aI={'center'}>
          {items.map(item => (
            <View key={item.account} pb={0.5} w={'100%'}>
              <AccountCurrencyCard item={item} onPress={onPress} />
            </View>
          ))}
        </View>
      </PopUpGeneral>
    </React.Fragment>
  );
}
