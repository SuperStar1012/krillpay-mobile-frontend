import React, { useState } from 'react';
import { StyleSheet, Keyboard, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
// import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Icon } from '../outputs/Icon';
import SearchInput from '../inputs/SearchInput';
import { View } from '../layout/View';
import { TextField } from '../inputs/TextField';
import { Output } from '../outputs/Output';
import { ModalFullscreen } from './ModalFullscreen';
import { useTheme } from 'contexts/ThemeContext';

// const styles = StyleSheet.create({
//   text: {
//     width: '100%',
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   edit: {
//     display: 'flex',
//     flexDirection: 'column',
//     width: '100%',
//     justifyContent: 'flex-end',
//   },
// });

export default function SearchModal(props) {
  const {
    label,
    value,
    displayValue,
    items,
    setValue,
    disabled,
    onSearch,
    input = false,
    loading,
    inputChildren,
    textFieldProps,
  } = props;
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const action = props => {
    if (!props.values.search) {
      return null;
    }
    return {
      label: props.values.search ? 'CLEAR' : '',
      onPress: () => props.setFieldValue('search', ''),
    };
  };

  const sections = search => {
    return [
      {
        title: '',
        data: search
          ? items.filter(item =>
              item.value.toLowerCase().includes(search.toLowerCase()),
            )
          : items,
        listItemTitle: item => item.value,
        listItemOnPress: item => {
          setValue(item.id);
          Keyboard.dismiss();
          setModalVisible(false);
        },
      },
    ];
  };

  function renderInput() {
    return (
      <View
        flex={'flex'}
        fD={'row'}
        aI={'center'}
        style={{ position: 'relative' }}>
        <View style={{ flexGrow: 1 }}>
          <TextField
            value={displayValue ?? value}
            editable={false}
            caretHidden={true}
            label={label}
            {...textFieldProps}
          />
          {inputChildren}
        </View>
        <Icon
          name={'keyboard-arrow-down'}
          set={'MaterialIcons'}
          size={20}
          color={'grey3'}
          style={{ position: 'absolute', right: 0 }}
        />
      </View>
    );
  }

  function renderOutput() {
    return (
      <View
        w={'100%'}
        aI={'flex-end'}
        fD={'row'}
        style={{
          flex: 1,
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(0, 0, 0, .15)',
          // alignItems: 'flex-end',
        }}>
        <View f={1}>
          <Output label={value ? label : ''} value={value ? value : label} />
        </View>
        <Icon
          name="chevron-down"
          size={20}
          color={'grey3'}
          style={{ paddingBottom: 4 }}
        />
      </View>
    );
  }

  return (
    <React.Fragment>
      <View style={{ position: 'relative' }} mb={0.5} mt={value ? 0 : 0.5}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          disabled={disabled}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 100,
          }}
        />
        {input ? renderInput() : renderOutput()}
      </View>
      <Formik
        initialValues={{
          search: value,
        }}>
        {props => (
          <ModalFullscreen
            close
            visible={modalVisible}
            action={action(props)}
            onDismiss={() => setModalVisible(false)}>
            <View pb={1} w={'100%'}>
              <SearchInput
                noTitle
                noImage
                label={label}
                value={props.values.search}
                onChangeText={value => {
                  onSearch && onSearch({ search: value });
                  props.setFieldValue('search', value);
                }}
                onBlur={() => props.setFieldTouched('search')}
                containerBackgroundColor={'white'}
                tintColor={colors.primary}
                onSubmitEditing={() => {}}
                returnKeyType={'done'}
                autoFocus
                error={props.errors.search}
                autoCapitalize={'none'}
                sections={sections(props.values.search)}
                refreshing={loading}
                loading={loading}
              />
            </View>
          </ModalFullscreen>
        )}
      </Formik>
    </React.Fragment>
  );
}
