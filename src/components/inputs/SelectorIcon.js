import React from 'react';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import Picker from 'react-native-picker-select';
import { View } from '../layout/View';
import Text from '../outputs/Text';
import { CustomIcon } from 'components/outputs/CustomIcon';

export default function Selector(props) {
  const {
    label,
    options,
    items = options,
    value,
    onValueChange,
    children,
  } = props;

  function renderValue(item) {
    let disabled = items.length < 2;
    return (
      <View
        pt={0.5}
        pb={0.25}
        // pr={0.125}
        w={'100%'}
        aI={'center'}
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#CECECE',
          // paddingBottom: 1,
          // marginBottom: 4,
        }}
        ph={0.5}
        fD={'row'}
        jC="space-between">
        {!!label && (
          <View
            ph={0.5}
            bC="white"
            style={{ position: 'absolute', top: -8, left: 12 }}>
            <Text s={13}>{label}</Text>
          </View>
        )}
        <View fD="row" aI="center">
          <View pr={0.5}>
            <CustomIcon contained={false} name="wallet-filled" color="font" />
          </View>
          <Text s={16} c="fontDark">
            {item?.label}
          </Text>
        </View>

        {!disabled && <Icon name="arrow-drop-down" size={20} color={'black'} />}
      </View>
    );
  }

  let disabled = items.length < 2;

  return (
    <Picker
      value={value}
      disabled={disabled}
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
