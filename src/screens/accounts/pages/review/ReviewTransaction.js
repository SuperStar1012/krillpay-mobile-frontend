//import liraries
import HeaderNew from 'components/layout/HeaderNew';
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import TopUpPage from 'screens/pos/pages/topup';
import useReviewTransaction from './useReviewTransaction';
import { Spinner } from 'components';
import FullScreenSpinner from 'components/outputs/FullScreenSpinner';

// create a component
// ! Add Heading icons
// ! Add loading state
const ReviewTransaction = ({ navigation, route }) => {
  const { data, isLoading } = useReviewTransaction({ route });

  return (
    <>
      <View style={{ paddingTop: 32 }}>
        <FullScreenSpinner isLoading={isLoading}>
          <HeaderNew title="Review" navigation={navigation} />
          <ScrollView>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  padding: 16,
                  flex: 1,
                  gap: 16,
                  position: 'relative',
                }}>
                <InformationContainer {...FromContainer} />
                <InformationContainer {...ToContainer(data)} />
                <InformationContainer {...DetailsContainer(data)} />
                <TouchableOpacity>
                  <View
                    style={{
                      paddingVertical: 16,
                      backgroundColor: 'blue',
                      borderRadius: 8,
                      justifyContent: 'center',
                      marginBottom: 96,
                      paddingHorizontal: 32,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        fontFamily: 'Roboto_400Regular',
                      }}>
                      Proceed to Payment
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </FullScreenSpinner>
      </View>
    </>
  );
};

const Information = ({ field, value, bold }) => (
  <View
    style={{
      backgroundColor: '#00000007',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 64,
      padding: 16,
      alignItems: 'center',
    }}>
    <Text style={{ fontSize: 16, fontFamily: 'Roboto_300Light' }}>{field}</Text>
    <Text
      numberOfLines={1}
      style={{
        color: 'blue',
        fontSize: bold ? 20 : 16,
        width: 'auto',
        maxWidth: '75%',
        fontFamily: bold ? 'Roboto_700Bold' : 'Roboto_400Regular',
      }}>
      {value}
    </Text>
  </View>
);

const InformationContainer = ({ title, fields }) => (
  <View style={{ gap: 2 }}>
    <Text style={{ fontFamily: 'Roboto_700Bold', fontSize: 18 }}>{title}</Text>
    <View style={{ gap: 4 }}>
      {fields.map((field, index) => (
        <Information
          key={field.key}
          field={field.key}
          value={field.value}
          bold={field.bold}
        />
      ))}
    </View>
  </View>
);

const ToContainer = ({ bankName, accountNumber, accountName }) => ({
  title: 'To',
  fields: [
    { key: 'Name', value: accountName },
    { key: 'Account Number', value: accountNumber },
    { key: 'Bank', value: bankName },
  ],
});

const FromContainer = {
  title: 'From',
  fields: [
    { key: 'Name', value: 'My Providus Account' },
    { key: 'Account Number', value: '9948849954' },
    { key: 'Bank', value: 'Providus Bank' },
  ],
};

const DetailsContainer = ({ amount }) => ({
  title: 'Transaction Detail',
  fields: [
    { key: 'Commission', value: 'NGN 100.25' },
    { key: 'Total Debit', value: `NGN ${+amount + 100.25}`, bold: true },
  ],
});

export default ReviewTransaction;
