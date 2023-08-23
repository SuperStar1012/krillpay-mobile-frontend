import React, { useState } from 'react';
import { Formik } from 'formik';
import DropdownSelect from 'components/form/DropdownSelect';
import HeaderNew from 'components/layout/HeaderNew';
import { OutlinedTextField } from 'rn-material-ui-textfield';
import { View, TouchableOpacity, Text } from 'react-native';
import { AmountInAccountComponent } from './components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useSendNaira from './useSendNaira';
import * as yup from 'yup';
import FullScreenSpinner from 'components/outputs/FullScreenSpinner';

const initialValues = {
  accountNumber: '',
  amount: '',
  narration: '',
  bankDetails: null,
};

export default function SendNaira(navigationProps) {
  const { data, navigateToAmountSection, isLoading } =
    useSendNaira(navigationProps);

  return (
    <>
      <View style={{ paddingTop: 16, flex: 1, position: 'relative' }}>
        <FullScreenSpinner isLoading={isLoading}>
          <KeyboardAwareScrollView>
            <HeaderNew
              title="Transfer"
              navigation={navigationProps.navigation}
            />
            <View
              style={{
                padding: 16,
                flex: 1,
                position: 'relative',
              }}>
              <AmountInAccountComponent />
              <Formik
                onSubmit={values => navigateToAmountSection(values)}
                initialValues={initialValues}
                validationSchema={validationSchema}>
                {({
                  values,
                  isSubmitting,
                  isValid,
                  handleSubmit,
                  setFieldValue,
                }) => (
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
                      <TouchableOpacity onPress={handleSubmit}>
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

const validationSchema = yup.object().shape({
  accountNumber: yup.string().required('Account number is required'),
  amount: yup.string().required('Amount is required'),
  narration: yup.string(),
  bankDetails: yup
    .object()
    .nonNullable()
    .typeError('Please select receipient bank')
    .shape({
      bankCode: yup.string().required('Bank code is required'),
      bankName: yup.string().required('Bank name is required'),
    }),
});
