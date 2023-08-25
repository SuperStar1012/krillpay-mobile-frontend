import React from 'react';
import { Dimensions, View } from 'react-native';

import BirthdayEarned from './earned/birthday-earned.svg';
import EmailEarned from './earned/email-earned.svg';
import GeneralEarned from './earned/general-earned.svg';
import MobileEarned from './earned/mobile-earned.svg';
import Tier1 from './earned/tier1.svg';
import Tier2 from './earned/tier2.svg';
import Tier3 from './earned/tier3.svg';

import Birthday from './rewards/birthday.svg';
import Earned from './rewards/earned.svg';
import General1 from './rewards/general.svg';
import General2 from './rewards/general-2.svg';
import General3 from './rewards/general-3.svg';
import ReferFriend from './rewards/refer-friend.svg';
import Transactions1 from './rewards/transactions-1.svg';
import Transactions2 from './rewards/transactions-2.svg';
import VerifyEmail from './rewards/verify-email.svg';
import VerifyMobile from './rewards/verify-mobile.svg';

const SCREEN_WIDTH = Dimensions.get('window').width;

const RewardPlaceholderImage = props => {
  let {
    width = SCREEN_WIDTH / 3,
    height = SCREEN_WIDTH / 3,
    name,
    rewardName,
  } = props;

  if (!name) {
    if (rewardName.includes('irthday')) {
      name = 'birthday';
    } else if (rewardName.includes('mobile number')) {
      name = 'verify-mobile';
    } else if (rewardName.includes('email')) {
      name = 'verify-email';
    } else if (rewardName.includes('friend')) {
      name = 'refer-friend';
    } else if (rewardName.includes('transactions')) {
      name = 'transactions';
    } else if (rewardName.includes('joining')) {
      name = 'general3';
    } else if (rewardName.includes('users')) {
      name = 'general2';
    } else {
      name = 'general1'; // + Math.ceil(Math.random() * 3);
    }
  }

  const imageProps = { width, height };
  const images = {
    'birthday-earned': <BirthdayEarned {...imageProps} />,
    'email-earned': <EmailEarned {...imageProps} />,
    'general-earned': <GeneralEarned {...imageProps} />,
    'mobile-earned': <MobileEarned {...imageProps} />,
    tier1: <Tier1 {...imageProps} />,
    tier2: <Tier2 {...imageProps} />,
    tier3: <Tier3 {...imageProps} />,
    birthday: <Birthday {...imageProps} />,
    earned: <Earned {...imageProps} />,
    general1: <General1 {...imageProps} />,
    general2: <General2 {...imageProps} />,
    general3: <General3 {...imageProps} />,
    'refer-friend': <ReferFriend {...imageProps} />,
    transactions: <Transactions1 {...imageProps} />,
    transactions2: <Transactions2 {...imageProps} />,
    'verify-email': <VerifyEmail {...imageProps} />,
    'verify-mobile': <VerifyMobile {...imageProps} />,
  };

  return <View style={styles.container}>{images[name]}</View>;
};

const styles = {
  container: {
    // width: '100%',
    // height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default RewardPlaceholderImage;
