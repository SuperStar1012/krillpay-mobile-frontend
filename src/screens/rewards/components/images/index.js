import React from 'react';
import Birthday from './Birthday';
import Email from './Email';
import Mobile from './Mobile';
import Recurring from './Recurring';
import Reward from './Reward';
import Transaction from './Transaction';
import { StyleSheet, View, Image } from 'react-native';
import { useTheme } from 'components/context';

export const images = {
  Birthday: Birthday,
  Email: Email,
  Recurring: Recurring,
  Mobile: Mobile,
  Reward: Reward,
  Transaction: Transaction,
};

export default function RewardPlaceholderImage(props) {
  let { name = '', src, detailsPage } = props;
  const { size = 90, rewardName = '', label, ...restProps } = props;

  if (src) {
    return (
      <Image
        style={{ height: size, width: '100%', borderRadius: 2 }}
        resizeMode={detailsPage ? 'contain' : 'cover'}
        source={{ uri: src }}
      />
    );
  }

  if (!name) {
    if (rewardName.includes('irthday')) {
      name = 'Birthday';
    } else if (rewardName.includes('mobile number')) {
      name = 'Mobile';
    } else if (rewardName.includes('email')) {
      name = 'Email';
    }
    // else if (rewardName.includes('friend')) {
    //   name = 'Recurring'; //TODO:
    // }
    else if (rewardName.includes('transactions')) {
      name = 'Transaction';
    } else {
      name = 'Reward';
    }
  }

  const PlaceholderImage = images[name];
  const { colors } = useTheme();

  return (
    <View style={styles.container} {...restProps}>
      <PlaceholderImage colors={colors} size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
});
