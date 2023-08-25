import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { uniqBy } from 'lodash';
import { View, Output, Button } from 'components';

import { ModalFullscreen } from 'components/modals/ModalFullscreen';
import Checkbox from 'components/inputs/CheckboxSimple';
import { useAccounts } from 'contexts';

const styles = StyleSheet.create({
  text: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    // display: 'flex',
    // flexDirection: 'row',
    // width: '100%',
    // // paddingHorizontal: 16,
    // justifyContent: 'space-between',
  },
  edit: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'flex-end',
  },
});

export default function AccountCurrencySelector(props) {
  const { values, setValue } = props;

  const [modalVisible, setModalVisible] = useState(false);
  const [tempValues, setTempValues] = useState(values);

  const {
    context: { wallets },
  } = useAccounts();
  const codes = uniqBy(
    wallets?.data
      // .filter(currency => !currency.crypto)
      .map(currency => ({
        label: currency?.currency?.display_code,
        value: currency?.currency?.code,
      })),
    'value',
  );
  const items = codes.map(item => {
    return {
      ...item,
      checked: tempValues?.findIndex(val => val === item.value) !== -1,
    };
  });

  const valuesString = (
    values?.length > 0
      ? values.map(code => {
          const codeItem = items?.find(item => item.value === code);
          return codeItem ? codeItem.label : code;
        })
      : []
  ).join(', ');
  console.log(valuesString);

  const handleChange = item => {
    if (!item.checked) {
      setTempValues([...tempValues, item?.value]);
    } else {
      setTempValues(tempValues?.filter(val => val !== item?.value));
    }
  };

  return (
    <React.Fragment>
      <View style={styles.container}>
        <Button onPress={() => setModalVisible(true)}>
          <Output
            label={valuesString ? 'currencies' : ''}
            value={valuesString ? valuesString : ''}
            placeholder="currency_selector_placeholder"
          />
        </Button>
      </View>
      <ModalFullscreen
        close
        scrollView
        title={'select_currencies'}
        visible={modalVisible}
        action={{
          id: 'done',
          capitalize: true,
          onPress: () => {
            setValue(tempValues);
            setModalVisible(false);
          },
        }}
        onDismiss={() => {
          setTimeout(() => setTempValues(values), 1000);
          setModalVisible(false);
        }}>
        <View pv={0.5} mh={-0.5} w={'100%'}>
          {items.map(item => (
            <Checkbox
              key={item.value}
              name={item.value}
              value={item.checked}
              label={item.label}
              onPress={() => {
                handleChange(item);
              }}
            />
          ))}
        </View>
      </ModalFullscreen>
    </React.Fragment>
  );
}
