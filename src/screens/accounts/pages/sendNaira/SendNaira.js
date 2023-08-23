import React from 'react';
import { Formik } from 'formik';
import DropdownSelect from 'components/form/DropdownSelect';
import HeaderNew from 'components/layout/HeaderNew';
import { OutlinedTextField } from 'rn-material-ui-textfield';
import {
  View,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useSendNaira from './useSendNaira';
import * as yup from 'yup';
import FullScreenSpinner from 'components/outputs/FullScreenSpinner';
import SearchBankComponent from './components/SearchBankComponent/SearchBankComponent';

const initialValues = {
  accountNumber: '',
  narration: '',
  bankDetails: null,
};

export default function SendNaira(navigationProps) {
  const { data, navigateToAmountSection, isLoading } =
    useSendNaira(navigationProps);

  return (
    <>
      <FullScreenSpinner isLoading={isLoading}>
        <HeaderNew
          title="Transfer"
          navigation={navigationProps.navigation}
          style={{ marginTop: 16 }}
        />

        <KeyboardAvoidingView
          behavior="padding"
          style={{ padding: 16, position: 'relative', paddingBottom: 480 }}>
          <Formik
            onSubmit={values => navigateToAmountSection(values)}
            initialValues={initialValues}
            validationSchema={validationSchema}>
            {({ handleSubmit, setFieldValue, values }) => (
              <>
                <OutlinedTextField
                  label="Beneficiary Account Number"
                  keyboardType="numeric"
                  labelTextStyle={{ fontFamily: 'Roboto_300Light' }}
                  innerTextStyle={{ fontFamily: 'Roboto_300Light' }}
                  onChangeText={e => {
                    setFieldValue('accountNumber', e);
                  }}
                />
                <SearchBankComponent
                  show
                  banks={data}
                  // show={values.accountNumber.length === 10}
                />
                <OutlinedTextField
                  label="What for? (optional)"
                  labelTextStyle={{ fontFamily: 'Roboto_300Light' }}
                  innerTextStyle={{ fontFamily: 'Roboto_300Light' }}
                  onChangeText={e => setFieldValue('narration', e)}
                />

                <TouchableOpacity onPress={handleSubmit}>
                  <View
                    style={{
                      paddingVertical: 16,
                      marginTop: 16,
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
              </>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </FullScreenSpinner>
    </>
  );
}

const validationSchema = yup.object().shape({
  accountNumber: yup.string().required('Account number is required'),
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
