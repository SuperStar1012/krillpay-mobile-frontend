import React from 'react';
import { Text, Button, View } from 'components';
import LottieImage from 'components/outputs/LottieImage';
import { useSelector } from 'react-redux';
import { userProfileSelector } from '@redux/rehive/reducer';
import { getUserCountryFromMSISDN } from 'utility/general';
import { Image } from 'react-native';
import { Flag } from '../../../../assets';

export default function OnboardingSuccess(props) {
  const { navigation } = props;
  const profile = useSelector(userProfileSelector);
  const user = profile?.data?.[0];

  function handleContinue() {
    // Tabs
    // navigation.navigate('Tabs');
    navigation.replace('Tabs', { screen: 'Home' });
    // navigation.navigate('Tabs', { screen: 'Home' });
    // navigation.navigate('Private', { screen: 'Home' })
    //  navigation.navigate('Home')
  }

  return (
    <View f={1}>
      <View aI={'center'} jC="center" fG={1} w={'100%'} p={2}>
        <View h={200} w={200} jC={'center'}>
          <LottieImage name="success" color="primary" size={300} loop={false} />
        </View>
        <View mv={1}>
          <Text s={25} fW={'700'} lH={29}>
            Howdy {user?.first_name}
          </Text>
        </View>
        <Text
          tA={'center'}
          s={16}
          lH={25}
          id="onboarding_success"
          style={{ color: '#000000' }}
        />
        <Text tA={'center'} style={{ color: '#000000' }} s={16} lH={25}>
          Your KrillPay wallet default currency is
          {getUserCountryFromMSISDN(user?.mobile) == 'NG' ? ' Naira' : ' USD'}.
        </Text>
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 40,
            borderWidth: 0,
            marginBottom: 16,
            marginTop: 16,
          }}
          source={
            getUserCountryFromMSISDN(user?.mobile) == 'NG'
              ? Flag.NIGERIA
              : Flag.USA
          }
        />
      </View>
      <View p={1.5}>
        <Button wide id="enter_app" onPress={handleContinue} />
      </View>
    </View>
  );
}
