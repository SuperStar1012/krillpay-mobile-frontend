import React, { useState } from 'react';
import { View } from 'components';
import { CurrencyCard } from './CurrencyCard';
import { ModalFullscreen } from 'components/modals/ModalFullscreen';

import { TouchableOpacity } from 'react-native';
import { hideCurrency } from './WalletActionList';

const CurrencySelector = props => {
  let {
    item,
    items,
    rates,
    updateItem,
    disabled,
    title,
    children,
    action,
    config,
  } = props;

  const [modalVisible, setModalVisible] = useState(false);
  const hideModal = () => setModalVisible(false);
  if (!item) {
    return null;
  }

  if (action && config) {
    items = items.filter(item => !hideCurrency(action, config, item));
  }

  return (
    <React.Fragment>
      {children ? (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {children}
        </TouchableOpacity>
      ) : (
        <CurrencyCard
          item={item}
          onPressContentDisabled={disabled}
          rates={rates}
          onPressContent={() => setModalVisible(true)}
        />
      )}

      <ModalFullscreen
        visible={modalVisible}
        scrollView
        title={title ? title : 'Select currency'}
        onDismiss={hideModal}
        docked>
        <View pb={1} w={'100%'} ph={0.25}>
          {items.map((item, index) => (
            <CurrencyCard
              key={item.key}
              item={item}
              rates={rates}
              onPressContent={() => {
                const fullIndex = items.findIndex(
                  curr =>
                    curr.account === item.account &&
                    curr.currency.code === item.currency.code,
                );
                updateItem(items[fullIndex]);
                hideModal();
              }}
            />
          ))}
        </View>
      </ModalFullscreen>
    </React.Fragment>
  );
};

export default CurrencySelector;
