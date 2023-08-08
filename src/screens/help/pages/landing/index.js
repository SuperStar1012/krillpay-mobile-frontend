import React from 'react';
import { View, Text, HeaderButton } from 'components';
import IconButton from 'components/inputs/IconButton';
import { Dimensions, I18nManager } from 'react-native';
import Disclaimer from '../../../auth/components/Disclaimer';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function LandingPage(props) {
  const { navigation } = props;

  return (
    <View screen bC={'white'} w="100%">
      {/* <Header navigation={navigation} back title="Landing" /> */}
      <View
        fD="row"
        w="100%"
        aI="center"
        h={80}
        ph={1}
        style={{ borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}>
        <HeaderButton
          contained={false}
          onPress={() => navigation.goBack()}
          icon={I18nManager.isRTL ? 'chevron-right' : 'chevron-left'}
          size={32}
          color={'fontDark'}
          containerStyle={{ padding: 10, paddingTop: 8, paddingBottom: 0 }}
        />
        <View w="70%" pt={0.25}>
          <Text tA="center" width="100%" s={20} id="help_center" />
        </View>
      </View>
      <View f={1} jC="space-between" pt={1} ph={1}>
        <View f={1}>
          <IconButton
            {...{
              label: 'contact_support',
              icon: 'chat',
              padded: false,
              size: 35,
              altStyle: true,
              // disabled: hideSessions,
              onPress: () => navigation.navigate('Support'),
            }}
          />
          {/* <IconButton
            {...{
              label: 'articles',
              icon: 'support',
              padded: false,
              altStyle: true,
              size: 35,

              // disabled: hideSessions,
              onPress: () => navigation.navigate('HelpCenter'),
            }}
          /> */}
          <IconButton
            {...{
              label: 'faqs',
              icon: 'support',
              padded: false,
              altStyle: true,
              size: 35,

              // disabled: hideSessions,
              onPress: () => navigation.navigate('FAQs'),
            }}
          />
          <IconButton
            {...{
              label: 'about',
              icon: 'information',
              padded: false,
              size: 35,
              altStyle: true,
              // disabled: hideSessions,
              onPress: () => navigation.navigate('About'),
            }}
          />
        </View>
      </View>
      <Disclaimer title />
    </View>
  );
}
