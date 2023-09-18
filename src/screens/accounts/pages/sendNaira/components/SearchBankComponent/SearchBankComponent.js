//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { OutlinedTextField } from 'rn-material-ui-textfield';
import BankButton from './components';
import useSearchBankComponent from './useSearchBankComponent';
import useGetNipAccount from './useGetNipAccount';
import { EvilIcons } from '@expo/vector-icons';

/**
 *
 * @param {{show: boolean, banks: import('../../api/getBankCodes').NIPBank[]}} param0
 * @returns
 */
const SearchBankComponent = ({
  banks = [],
  header,
  footer,
  onSelect,
  formValues,
  setAccountName,
}) => {
  const {
    onSelectBank,
    searchBankText,
    setSearchBankText,
    filteredBanks,
    showBankList,
    bankInputRef,
    onFocus,
    onBlur,
  } = useSearchBankComponent({ banks, onSelect });

  const { isLoading, data } = useGetNipAccount({
    beneficiaryDetail: formValues,
    setAccountName,
  });

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 16 }}
      stickyHeaderIndices={[0]}
      ListFooterComponent={footer}
      ListFooterComponentStyle={{ marginTop: 8 }}
      ListHeaderComponentStyle={{ backgroundColor: 'white' }}
      initialNumToRender={10}
      ListHeaderComponent={
        <>
          {header}
          <OutlinedTextField
            value={searchBankText}
            onFocus={onFocus}
            onBlur={onBlur}
            inputRef={bankInputRef}
            label="Beneficiary Bank"
            containerStyle={{ backgroundColor: 'white', marginTop: 8 }}
            labelTextStyle={{ fontFamily: 'Roboto_300Light' }}
            innerTextStyle={{ fontFamily: 'Roboto_300Light' }}
            onChangeText={e => {
              setSearchBankText(e);
            }}
          />
          <View style={{ alignItems: 'flex-end' }}>
            {isLoading ? (
              <EvilIcons name="spinner-3" size={24} color="blue" />
            ) : (
              <Text style={{ color: 'blue' }}>{data?.accountName}</Text>
            )}
          </View>
        </>
      }
      data={filteredBanks}
      keyExtractor={(item, index) => item.bankCode}
      renderItem={({ item }) =>
        showBankList && <BankButton bankDetail={item} onPress={onSelectBank} />
      }
    />
  );
};

//make this component available to the app
export default SearchBankComponent;
