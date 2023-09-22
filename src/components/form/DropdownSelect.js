//import liraries
import React from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import { Dimensions } from 'react-native';
import { Text, View } from 'components';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('screen').width;

const DropdownSelect = ({
  placeholder,
  data,
  onChange,
  label,
  dropdownText,
  headerLabel,
  inputStyle,
  searchPlaceholder,
}) => {
  return (
    <View>
      {headerLabel && (
        <Text style={{ fontSize: 14, marginBottom: 8 }}>{headerLabel}</Text>
      )}
      <SelectDropdown
        searchPlaceHolderColor="#AAA"
        onSelect={onChange}
        searchPlaceHolder={searchPlaceholder}
        renderSearchInputLeftIcon={() => (
          <Ionicons
            name="search-outline"
            size={24}
            style={{ marginRight: 8 }}
            color="#CCC"
          />
        )}
        buttonStyle={{
          width: '100%',
          borderRadius: 8,
          paddingHorizontal: 4,
          marginBottom: 8,
          height: 54,
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: '#AAA',
          ...inputStyle,
        }}
        dropdownStyle={{
          left: -4,
          width: '100%',
          height: '78%',
          marginTop: '-50%',
        }}
        defaultButtonText={placeholder}
        rowStyle={{ justifyContent: 'flex-start', paddingHorizontal: 8 }}
        buttonTextStyle={{
          textAlign: 'left',
          fontFamily: 'Roboto_300Light',
          fontSize: 16,
        }}
        searchInputTxtStyle={{
          fontFamily: 'Roboto_300Light',
          fontSize: 14,
        }}
        searchInputStyle={{
          width: SCREEN_WIDTH,
        }}
        rowTextStyle={{
          fontFamily: 'Roboto_300Light',
          fontSize: 16,
          textAlign: 'left',e
        }}
        data={data}
        search
        buttonTextAfterSelection={label || (selectedItem => selectedItem.label)}
        rowTextForSelection={dropdownText || (item => item.label)}
        renderDropdownIcon={() => (
          <Ionicons
            name="caret-down"
            size={12}
            style={{ marginRight: 12 }}
            color="#CCC"
          />
        )}
      />
    </View>
  );
};

//make this component available to the app
export default DropdownSelect;
