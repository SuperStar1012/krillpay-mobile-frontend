import React from 'react';
import { Text, Button, View } from 'components';
import LottieImage from 'components/outputs/LottieImage';

export default function OnboardingSuccess(props) {
  const { navigation } = props;

  function handleContinue() {
    navigation.navigate('Tabs', { screen: 'Home' });
  }

  return (
    <View f={1}>
      <View aI={'center'} jC="center" fG={1} w={'100%'} p={2}>
        <View h={200} w={200} jC={'center'}>
          <LottieImage name="success" color="primary" size={300} loop={false} />
        </View>
        <View mv={1}>
          <Text s={25} fW={'700'} lH={29} id="success_"></Text>
        </View>
        <Text
          tA={'center'}
          s={16}
          lH={25}
          id="onboarding_success"
          c="fontLight"
        />
      </View>
      <View p={1.5}>
        <Button wide id="enter_app" onPress={handleContinue} />
      </View>
    </View>
  );
}
