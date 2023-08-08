import React, { useState } from 'react';
import { Formik } from 'formik';
import { getNames, getName, getCode } from 'country-list';
import { Keyboard, TouchableOpacity } from 'react-native';
import { View } from '../layout/View';
import SearchInput from '../inputs/SearchInput';
import { Output } from '../outputs/Output';
import { Icon } from '../outputs/Icon';
import { useTheme } from 'contexts/ThemeContext';

const CountryFilter = ({ id, filters, setFilters }) => {
  const { colors } = useTheme();
  const [editing, setEditing] = useState(false);

  const value = filters[id];
  const setValue = value =>
    setFilters({
      ...filters,
      [id]: [value],
    });

  const items = getNames().map(item => {
    return { value: item, id: item };
  });

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
          setValue(getCode(item.value));
          Keyboard.dismiss();
          setEditing(false);
        },
      },
    ];
  };

  const countryName = getName(value && value[0] ? value[0] : '');

  const onClear = () => {
    const tempFilters = { ...filters };
    delete tempFilters[id];
    setFilters(tempFilters);
    setEditing(false);
  };

  return (
    <View fD={'row'}>
      <View pb={2} pr={0.75} style={{ paddingTop: 0 }} w={'90%'}>
        <Formik
          enableReinitialize
          initialValues={{
            search: countryName,
          }}>
          {props =>
            editing ? (
              <SearchInput
                noTitle
                noImage
                label={''}
                value={props.values.search}
                onChangeText={value => props.setFieldValue('search', value)}
                onBlur={() => props.setFieldTouched('search')}
                containerBackgroundColor={'white'}
                tintColor={colors.primary}
                onSubmitEditing={() => {}}
                returnKeyType={'done'}
                autoFocus
                error={props.errors.search}
                autoCapitalize={'none'}
                sections={sections(props.values.search)}
              />
            ) : (
              <View style={{ paddingTop: 12 }}>
                <Output
                  editAction={() => setEditing(true)}
                  onPress={() => setEditing(true)}
                  edit
                  value={countryName ? countryName : 'None'}
                />
              </View>
            )
          }
        </Formik>
      </View>
      <TouchableOpacity onPress={onClear}>
        <View pt={editing ? 1.5 : 1}>
          <Icon name={'md-close'} size={26} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CountryFilter;
