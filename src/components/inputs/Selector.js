import React, { useState, useRef } from 'react';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Picker from 'react-native-picker-select';
import { View } from '../layout/View';
import Text from '../outputs/Text';
import { Output } from '../outputs/Output';
import { Button } from './Button';
import { PopUpGeneral } from '../layout/PopUpGeneral';
import { useTheme } from '../context';
import { useTranslation } from 'react-i18next';

export default function Selector(props) {
  const {
    label,
    placeholder = 'picker_placeholder',
    formatValue = item => item?.label,
    multiline = false,
    bold,
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

  const { t } = useTranslation('common');
  let translatedItems = items.map(item => ({
    ...item,
    label: t(item?.label ?? item?.id),
  }));
  const placeholderLabel = t(placeholder);

  const [modalVisible, setModalVisible] = useState(false);
  let disabled = items?.length < 2;

  function renderValue(item) {
    return (
      <View
        pt={0.25}
        pr={0.25}
        w={'100%'}
        aI={'center'}
        style={{
          borderBottomWidth: 1,
          borderBottomEndRadius: 5,
          borderBottomColor: modalVisible
            ? colors?.primary ?? 'rgba(0, 0, 0, .37)'
            : 'rgba(0, 0, 0, .15)',
          paddingBottom: 1,
          marginBottom: 4,
        }}
        fD={'row'}
        jC={'flex-end'}>
        {bold ? (
          <Text
            tA={'right'}
            s={22}
            style={{
              paddingRight: 8,
            }}
            id={formatValue(item)}
          />
        ) : (
          <View f={1}>
            <Output
              labelColor={modalVisible ? colors.primary : colors.fontLight}
              label={item || placeholder ? label : ''}
              values={multiline ? formatValue(item) : null}
              value={
                !multiline
                  ? item
                    ? item?.label
                    : placeholder
                    ? placeholder
                    : label
                  : ''
              }
            />
          </View>
        )}
        {!disabled && (
          <Icon
            name="chevron-down"
            size={20}
            color={'black'}
            style={{ opacity: 0.8, paddingTop: 4 }}
          />
        )}
      </View>
    );
  }

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
            : renderValue(translatedItems.find(item => item.value === value))}
        </Button>
        <PopUpGeneral
          visible={modalVisible}
          // title={title}
          scrollView
          onDismiss={hideModal}
          docked>
          <View aI={'center'}>
            {translatedItems.map(item =>
              item ? (
                <View pb={0.5} w={'100%'}>
                  <Button
                    key={item.key}
                    id={item.label}
                    wide
                    onPress={() => {
                      onValueChange(item.value);
                      hideModal();
                    }}
                  />
                </View>
              ) : null,
            )}
            <Button label={'close'} type="text" wide onPress={hideModal} />
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
      placeholder={{ label: placeholderLabel }}
      onOpen={showModal}
      onClose={hideModal}
      items={translatedItems}
      onValueChange={value => onValueChange(value)}
      useNativeAndroidPickerStyle={false}
      hideIcon>
      {children
        ? children
        : renderValue(translatedItems.find(item => item.value === value))}
    </Picker>
  );
}
