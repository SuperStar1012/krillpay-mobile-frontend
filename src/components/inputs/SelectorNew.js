import React, { useState } from 'react';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import Picker from 'react-native-picker-select';
import { View } from '../layout/View';
import Text from '../outputs/Text';
import { Button } from './Button';
import { PopUpGeneral } from '../layout/PopUpGeneral';
import { useTheme } from '../context';
import { Platform } from 'react-native';

export default function Selector(props) {
  const {
    options,
    items = options,
    value,
    onValueChange,
    children,
    modal,
  } = props;

  const { colors } = useTheme();

  function showModal() {
    setModalVisible(true);
  }

  function hideModal() {
    setModalVisible(false);
  }

  const [modalVisible, setModalVisible] = useState(false);

  function renderValue(item) {
    let disabled = items.length < 2;
    return (
      <View
        pv={0.125}
        // pr={0.125}
        w={'100%'}
        aI={'center'}
        style={{
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#CECECE',
          // paddingBottom: 1,
          // marginBottom: 4,
        }}
        pl={0.25}
        fD={'row'}
        jC="space-between">
        <Text s={10} c="fontLight" id={item?.label} />

        {!disabled && Platform.OS === 'ios' && (
          <Icon
            name="arrow-drop-down"
            size={16}
            color={'black'}
            // style={{ opacity: 0.8, paddingTop: 4 }}
          />
        )}
      </View>
    );
  }

  let disabled = items.length < 2;
  if (items.length === 0) {
    items[0] = {
      label: '---',
      value: 'none:none',
      key: 'none',
    };
  }

  if (modal) {
    return (
      <React.Fragment>
        <Button
          disabled={disabled}
          onPress={() => (disabled ? null : showModal())}>
          {children
            ? children
            : renderValue(items.find(item => item.value === value))}
        </Button>
        <PopUpGeneral
          visible={modalVisible}
          // title={title}
          scrollView
          onDismiss={() => hideModal()}
          docked>
          <View aI={'center'}>
            {items.map(item =>
              item ? (
                <View pb={0.5} w={'100%'}>
                  <Button
                    key={item.key}
                    label={item.label}
                    wide
                    onPress={() => {
                      onValueChange(item.value);
                      hideModal();
                    }}
                  />
                </View>
              ) : null,
            )}
            <Button
              label={'CLOSE'}
              type="text"
              wide
              onPress={() => hideModal()}
            />
          </View>
        </PopUpGeneral>
      </React.Fragment>
    );
  }

  return (
    <Picker
      value={value}
      // placeholder={'Please select...'}
      disabled={disabled}
      onOpen={showModal}
      onClose={hideModal}
      items={items}
      onValueChange={value => onValueChange(value)}
      useNativeAndroidPickerStyle={false}
      hideIcon>
      {children
        ? children
        : renderValue(items.find(item => item.value === value))}
    </Picker>
  );
}
