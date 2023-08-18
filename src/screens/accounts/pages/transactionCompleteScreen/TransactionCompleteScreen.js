import React from 'react';
import LottieView from 'lottie-react-native';
import CompletionAnim from '../../../../../assets/lottie/Complete_Animation.json';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function TransactionCompleteScreen() {
  return (
    <>
      <StatusBar />
      <View style={styles.Container}>
        <View>
          <LottieView
            source={CompletionAnim}
            autoPlay
            loop={false}
            style={{ width: '100%', height: 200 }}
          />
        </View>
        <Text style={styles.Heading}>Funds transferred successfully</Text>
        {/* <Text style={styles.SubHeading}>Some Text here</Text> */}
        <TouchableOpacity style={styles.ButtonContainer} onPress={() => {}}>
          <Text style={styles.ButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  Heading: {
    fontFamily: 'Roboto_700Bold',
    marginTop: 8,
    fontSize: 24,
    textAlign: 'center',
  },
  SubHeading: {
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Roboto_300Light',
    fontSize: 16,
  },
  ButtonContainer: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    width: '100%',
    marginTop: 32,
    borderRadius: 99,
    alignItems: 'center',
  },
  ButtonText: {
    color: 'white',
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
  },
});
