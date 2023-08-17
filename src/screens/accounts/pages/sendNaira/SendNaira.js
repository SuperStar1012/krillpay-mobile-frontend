import React, { useState } from 'react';
import { Formik } from 'formik';
import DropdownSelect from 'components/form/DropdownSelect';
import HeaderNew from 'components/layout/HeaderNew';
import { OutlinedTextField } from 'rn-material-ui-textfield';
import { View, TouchableOpacity, Text } from 'react-native';
import { AmountInAccountComponent } from './components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useSendNaira from './useSendNaira';
import { Spinner } from 'components';
import FullScreenSpinner from 'components/outputs/FullScreenSpinner';

const initialValues = {
  accountNumber: '',
  amount: '',
  narration: '',
};

export default function SendNaira({ navigation }) {
  const { data, navigateToReview, isLoading } = useSendNaira({ navigation });

  return (
    <>
      <View style={{ paddingTop: 16, flex: 1, position: 'relative' }}>
        <FullScreenSpinner isLoading={isLoading}>
          <KeyboardAwareScrollView>
            <HeaderNew title="Transfer" navigation={navigation} />
            <View
              style={{
                padding: 16,
                flex: 1,
                position: 'relative',
              }}>
              <AmountInAccountComponent />
              <Formik initialValues={initialValues}>
                {({ values, isSubmitting, isValid, setFieldValue }) => (
                  <>
                    <View style={{ gap: 16 }}>
                      {/* Bank Code */}
                      <DropdownSelect
                        data={data}
                        onChange={e => {
                          setFieldValue('bankDetails', e.value);
                        }}
                        inputStyle={{
                          marginTop: 16,
                        }}
                      />
                      <OutlinedTextField
                        label="Beneficiary Account Number"
                        keyboardType="numeric"
                        labelTextStyle={{ fontFamily: 'Roboto_300Light' }}
                        innerTextStyle={{ fontFamily: 'Roboto_300Light' }}
                        onChangeText={e => {
                          setFieldValue('accountNumber', e);
                        }}
                      />
                      <OutlinedTextField
                        label="Amount"
                        keyboardType="numeric"
                        labelTextStyle={{ fontFamily: 'Roboto_300Light' }}
                        innerTextStyle={{ fontFamily: 'Roboto_300Light' }}
                        onChangeText={e => setFieldValue('amount', e)}
                      />
                      <OutlinedTextField
                        label="What for? (optional)"
                        labelTextStyle={{ fontFamily: 'Roboto_300Light' }}
                        innerTextStyle={{ fontFamily: 'Roboto_300Light' }}
                        onChangeText={e => setFieldValue('narration', e)}
                      />
                    </View>
                    <View
                      style={{
                        width: '100%',
                        marginTop: 16,
                        flex: 1,
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigateToReview({
                            ...values,
                            bankName: values.bankDetails.bankName,
                            bankCode: values.bankDetails.bankCode,
                          })
                        }>
                        <View
                          style={{
                            paddingVertical: 16,
                            backgroundColor: 'blue',
                            borderRadius: 8,
                            justifyContent: 'center',
                            paddingHorizontal: 32,
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              textAlign: 'center',
                              fontFamily: 'Roboto_400Regular',
                            }}>
                            Proceed
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </KeyboardAwareScrollView>
        </FullScreenSpinner>
      </View>
    </>
  );
}

function maskToCurrencyFormat(number) {
  try {
    // Convert the input number to a float to handle cases with decimal places
    number = parseFloat(number);
    // Check if the conversion resulted in a valid number
    if (isNaN(number)) {
      return '';
    }
    // Convert the number to an integer and format with commas for thousands separator
    const formattedNumber = Math.round(number)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedNumber;
  } catch (error) {
    // If the input cannot be converted to a float, return an error message
    return 'Error: ' + error.message;
  }
}
