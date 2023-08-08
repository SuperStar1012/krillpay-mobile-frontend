import React, { useState } from 'react';

import { AccountCard } from 'components/cards';
import { Text, View } from 'components';
import { ModalFullscreen } from 'components/modals/ModalFullscreen';

const AccountSelector = ({ data, index, currency, handleChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <React.Fragment>
      <AccountCard
        label="To account" //'Withdrawal account'
        item={data[index]}
        currency={currency}
        selected={-1}
        onPress={() => setModalVisible(true)}
      />

      <ModalFullscreen
        close
        scrollView
        title={'Select withdraw account'}
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}>
        <View>
          {data.map((item, ind) => (
            <View key={item.code} mb={1}>
              <AccountCard
                item={item}
                index={ind}
                currency={currency}
                selected={index}
                onPress={() => {
                  handleChange(ind);
                  setModalVisible(false);
                }}
              />
            </View>
          ))}
        </View>
      </ModalFullscreen>
    </React.Fragment>
  );
};

export default AccountSelector;
