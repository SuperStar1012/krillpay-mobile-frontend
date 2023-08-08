import React, { useState } from 'react';
import { displayFormatDivisibility } from 'utility/general';
import { View } from 'components';

import { ModalFullscreen } from 'components/modals/ModalFullscreen';

import { TouchableOpacity } from 'react-native';
import { CurrencyCard } from '../../components/CurrencyCard';
import { getCurrencyCode } from '../../util/rates';

export default function CurrencySelector(props) {
  let { item, items, rates, onChange, disabled, currencies, title, children } =
    props;
  const [modalVisible, setModalVisible] = useState(false);

  const options = items.map(item => {
    return {
      label:
        getCurrencyCode(item.currency) +
        (currencies?.multipleAccounts
          ? ' (' + item.account_name + '): '
          : ': ') +
        displayFormatDivisibility(
          item.available_balance,
          item.currency.divisibility,
        ) +
        ' ' +
        getCurrencyCode(item.currency),
      value: item,
      key: item.account + ':' + item.currency.code,
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
        <CurrencyCard
          // overlay
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
        {options.map((item, index) => (
          <View pb={1} key={item.key}>
            <CurrencyCard
              item={item.value}
              currencies={currencies}
              rates={rates}
              onPressContent={() => {
                onChange(item.value);
                hideModal();
              }}
            />
          </View>
        ))}
      </ModalFullscreen>
    </React.Fragment>
  );
}
