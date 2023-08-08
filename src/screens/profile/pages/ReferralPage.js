import React from 'react';
import Header from 'components/layout/HeaderNew';

import { View, Text, TextField } from 'components';
import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'components/context';
import { useRehive } from 'hooks/rehive';
import Images from '../components/images';
import { useRehiveContext } from 'contexts/RehiveContext';

export default function ReferralScreen(props) {
  const { colors } = useTheme();
  const {
    context: { user, init },
  } = useRehiveContext();

  const {
    context: { referralCode },
  } = useRehive(['referralCode'], init, { user });

  const styles = StyleSheet.create({
    titleContainer: {
      alignItems: 'center',
    },
    title: {
      fontSize: 21,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 15,
    },
    contentHeading: {
      fontWeight: '500',
      marginBottom: 10,
    },
    content: {
      fontSize: 14,
      color: '#797979',
    },
  });

  const IMAGE_WIDTH = Dimensions.get('window').width - 48;

  return (
    <View screen>
      <Header navigation={props.navigation} back id="referral_title" />
      <View scrollView={true}>
        <View style={styles.titleContainer} p={1} w="100%">
          <Images
            name="referral"
            height={(IMAGE_WIDTH * 3) / 5}
            width={IMAGE_WIDTH}
          />
          {/* <InviteFriends width={IMAGE_WIDTH} height={IMAGE_WIDTH / 1.8} /> */}
          <View mt={1.5}>
            <Text s={20} fW={'500'} id="referral_prompt" />
          </View>
        </View>
        <View ph={1.5}>
          <TextField
            editable={false}
            type={'copy'}
            label={'referral_code'}
            value={referralCode?.items?.data?.referral_code}
            tintColor={colors.primary}
            noMargin={true}
            containerStyle={{ marginBottom: 30 }}
          />
          <Text
            style={styles.contentHeading}
            fW={'500'}
            id="how_does_it_work"
          />
          <Text style={styles.content} id="referral_how" />
        </View>
      </View>
    </View>
  );
}
