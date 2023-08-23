//import liraries
import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';

/**
 * @param {{onPress: Function, bankDetail: import('../../../api/getBankCodes').NIPBank}} param0
 * @returns
 */
const BankButton = ({ onPress, bankDetail }) => {
  return (
    <TouchableOpacity onPress={_ => onPress(bankDetail)}>
      <View style={styles.buttonStyle}>
        <Text style={styles.textStyle}>{bankDetail.bankName}</Text>
        <Entypo name="chevron-small-right" size={24} color="black" />
      </View>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  buttonStyle: {
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    width: '100%',
    backgroundColor: '#00000011',
  },
  textStyle: {
    color: 'black',
    fontSize: 16,
  },
});

//make this component available to the app
export default memo(BankButton);
