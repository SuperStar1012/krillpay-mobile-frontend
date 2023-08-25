import React, { useState } from 'react';

import { TouchableOpacity } from 'react-native';
import AccountsCard from '../../components/AccountsCard';
import { View } from 'components';
import { ModalFullscreen } from 'components/modals/ModalFullscreen';

export default function AccountSelector(props) {
  let { item, items, rates, onChange, disabled, title, children } = props;
  const [modalVisible, setModalVisible] = useState(false);

  const options = items.map(item => {
    return {
      value: item.reference,
      item,
      key: item?.reference,
    };
  });
  const hideModal = () => setModalVisible(false);

  return (
    <React.Fragment>
      {children ? (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {children}
        </TouchableOpacity>
      ) : (
        <AccountsCard
          // overlay
          item={item}
          onPressContentDisabled={disabled}
          rates={rates}
          onPress={() => setModalVisible(true)}
        />
      )}

      <ModalFullscreen
        visible={modalVisible}
        scrollView
        title={title ? title : 'Select account'}
        onDismiss={hideModal}
        docked>
        {options.map((item, index) => (
          <View pb={1} key={item.key}>
            <AccountsCard
              item={item.item}
              rates={rates}
              onPress={() => {
                onChange(item.item);
                hideModal();
              }}
            />
          </View>
        ))}
      </ModalFullscreen>
    </React.Fragment>
  );
}
