//import liraries
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// create a component
const AmountInAccountComponent = () => {
  const [showAmount, setShowAmount] = useState(false);

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
          {/*//!Add Correct amount here from Rehive */}
          {showAmount ? 'NGN 20,000' : '*****'}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: 'white',
            fontFamily: 'Roboto_400Regular',
          }}>
          {/* //! Add correct account name from Rehive */}
          Account Name
        </Text>
      </View>
      <View style={{ justifyContent: 'center', padding: 8 }}>
        <Ionicons
          onPress={() => setShowAmount(prev => !prev)}
          name={showAmount ? 'eye-sharp' : 'eye-off-sharp'}
          size={32}
          color="white"
        />
      </View>
    </View>
  );
};

//make this component available to the app
export default AmountInAccountComponent;
