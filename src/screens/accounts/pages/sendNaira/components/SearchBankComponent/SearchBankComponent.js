//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { OutlinedTextField } from 'rn-material-ui-textfield';
import BankButton from './components';
import useSearchBankComponent from './useSearchBankComponent';

/**
 *
 * @param {{show: boolean, banks: import('../../api/getBankCodes').NIPBank[]}} param0
 * @returns
 */
const SearchBankComponent = ({ show, banks = [] }) => {
  const { onSelectBank } = useSearchBankComponent();

  return (
    <FlatList
      stickyHeaderIndices={[0]}
      ListHeaderComponent={() => (
        <OutlinedTextField
          label="Beneficiary Bank"
          containerStyle={{ backgroundColor: 'white' }}
          labelTextStyle={{ fontFamily: 'Roboto_300Light' }}
          innerTextStyle={{ fontFamily: 'Roboto_300Light' }}
          onFocus={() => console.log('focused')}
          onBlur={() => console.log('blurred')}
          // onChangeText={e => {
          //   setFieldValue('accountNumber', e);
          // }}
        />
      )}
      data={banks}
      keyExtractor={(item, index) => item.bankCode}
      renderItem={({ item }) => (
        <BankButton bankDetail={item} onPress={onSelectBank} />
      )}
    />
  );
};

//make this component available to the app
export default SearchBankComponent;
