//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
const AmountInAccountComponent = () => {
  return (
    <View
      style={{
        width: '100%',
        borderRadius: 8,
        backgroundColor: 'blue',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
      }}>
      <View
        style={{
          gap: 4,
        }}>
        <Text
          style={{
            color: 'white',
            // fontWeight: 'bold',
            fontSize: 32,
            fontFamily: 'Roboto_700Bold',
          }}>
          N 20,000.00
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: 'white',
            fontFamily: 'Roboto_400Regular',
          }}>
          Account Name
        </Text>
      </View>
      <View style={{ justifyContent: 'center', padding: 8 }}>
        <Text style={{ color: 'white', fontFamily: 'Roboto_400Regular' }}>
          Show
        </Text>
      </View>
    </View>
  );
};

//make this component available to the app
export default AmountInAccountComponent;
