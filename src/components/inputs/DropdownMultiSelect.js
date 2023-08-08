import React, { useState } from 'react';
import { Keyboard, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
// import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Icon } from '../outputs/Icon';
import SearchInput from '../inputs/SearchInput';
import { View } from '../layout/View';
import { TextField } from '../inputs/TextField';
import { ModalFullscreen } from '../modals/ModalFullscreen';
import { useTheme } from 'contexts/ThemeContext';

export default function DropdownMultiSelect(props) {
  const {
    label,
    value = [],
    displayField = 'id',
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
    if (!value) return null;

    return {
      label: 'DONE',
      onPress: () => {
        props.setFieldValue('search', '');
        Keyboard.dismiss();
        setModalVisible(false);
      },
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
          if (value.includes(item.id))
            return setValue(value.filter(x => x !== item.id));

          setValue([...value, item.id]);
        },
      },
    ];
  };

  function renderInput() {
    return (
      <View flex={'flex'} fD={'row'} aI={'center'}>
        <View style={{ flexGrow: 1 }}>
          <TextField
            value={value
              .map(x => items.find(y => y.id === x)?.[displayField])
              ?.join(', ')}
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
        />
      </View>
    );
  }

  function renderOutput() {
    return (
      <View w={'100%'} aI={'center'} fD={'row'} jC={'flex-end'}>
        <View f={1}>
          {/* <Output
        label={value ? label : ''}
        value={value ? value : label}
      /> */}
        </View>
        <Icon
          name="chevron-down"
          size={20}
          color={'black'}
          style={{ opacity: 0.8, paddingTop: 4 }}
        />
      </View>
    );
  }

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        disabled={disabled}>
        {input ? renderInput() : renderOutput()}
      </TouchableOpacity>
      <Formik
        initialValues={{
          search: '',
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
                selectedValues={value}
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
