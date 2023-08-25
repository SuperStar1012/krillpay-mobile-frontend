import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Linking from 'expo-linking';
import { View, Text, EmptyListMessage } from 'components';
import Header from 'components/layout/HeaderNew';
import Disclaimer from '../../../auth/components/Disclaimer';
import { useRehiveContext } from 'contexts/RehiveContext';

export default function SupportPage(props) {
  const { navigation } = props;

  const {
    context: { company },
  } = useRehiveContext();

  const email = company?.contact_email ?? company?.support_email ?? '';

  return (
    <View screen bC={'white'}>
      <Header navigation={navigation} />
      <View scrollView>
        <View ph={1} pv={1.5}>
          <Text tA={'center'} fW={'bold'} s={20} id="contact_support" />

          {/* {faqConfig.description && (
            <View mv={1}>
              <Text tA={'center'} s={14} c={'grey4'}>
                {faqConfig.description}
              </Text>
            </View>
          )} */}

          {Boolean(email) ? (
            <View w={'100%'} p={1.5}>
              <Text tA={'center'} id="send_us_a_mail"></Text>
              <View mt={0.5}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`mailto:${email}`)}>
                  <Text tA={'center'} s={16} c={'primary'} fW={'500'}>
                    {email}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <EmptyListMessage>No support email provided</EmptyListMessage>
          )}
        </View>
      </View>
      <Disclaimer title />
    </View>
  );
}
