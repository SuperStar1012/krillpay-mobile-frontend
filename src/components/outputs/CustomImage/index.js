import React, { Component } from 'react';
import { Image, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { View } from '../../layout/View';
import { CustomIcon } from '../CustomIcon';
import context from '../../context';
import CardBlocks from './general/CardBlocks';
import RehiveLogo from './general/RehiveLogo';
import CardCircles from './general/CardCircles';
import Circles from './general/Circles';
// import Success from './general/Success';
// import Error from './general/Error';
import Success from './general/success.svg';
import Voucher from './general/Voucher';
import Fail from './general/fail.svg';
import PinPlaceholder from './auth/PinPlaceholder';
import BiometricsPlaceholder from './auth/BiometricsPlaceholder';
import LocalAuthPlaceholder from './auth/LocalAuthPlaceholder';
import MfaPlaceholder from './auth/MfaPlaceholder';
import OtpPlaceholder from './auth/OtpPlaceholder';
import EmailVerifyPlaceholder from './auth/EmailVerifyPlaceholder';
import MobileVerifyPlaceholder from './auth/MobileVerifyPlaceholder';
import FaceIdPlaceholder from './auth/FaceIdPlaceholder';

import BuyProductsPlaceholder from './onboarding/BuyProductsPlaceholder';
import EarnRewardsPlaceholder from './onboarding/EarnRewardsPlaceholder';
import ExchangePlaceholder from './onboarding/ExchangePlaceholder';
import MassSendPlaceholder from './onboarding/MassSendPlaceholder';
import SendToEmailPlaceholder from './onboarding/SendToEmailPlaceholder';

import UserDetails from './onboarding/UserDetails';
import Mobile from './onboarding/Mobile';
import Address from './onboarding/Address';
import Identity from './onboarding/Identity';
import AddressVerify from './onboarding/AddressVerify';
import Bank from './onboarding/Bank';
import Documents from './onboarding/Documents';
import MobileVerify from './onboarding/MobileVerify';
import OnboardingSuccess from './onboarding/Success';
import RequestSuccess from './request/Success';

import UserVerify from './cards/UserVerify';
import UserVerifyPending from './cards/UserVerifyPending';
import UserVerifyFailed from './cards/UserVerifyFailed';
import UserVerifySuccess from './cards/UserVerifySuccess';
import UserDocFailed from './cards/UserDocFailed';
import UserBank from './cards/Bank';
import Crypto from './cards/Crypto';

import Sale from './pos/Sale';
import TopUp from './pos/TopUp';

import QR from './general/QR';

import Document from 'components/images/Document';

// TODO: Rename to PlaceholderSVG

const SCREEN_WIDTH = Dimensions.get('window').width;

class _CustomImage extends Component {
  renderUrlImage(width, height, image) {
    if (!image) return null;
    return <Image style={{ width, height }} source={{ uri: image }} />;
  }

  renderIcon(width, height, icon) {
    const { colors } = this.props;
    return (
      <View h={height} w={width} aI={'center'} jC={'center'}>
        <Icon
          name={icon}
          size={height * 0.75}
          color={colors.primary}
          // style={{ opacity: 0.8, paddingTop: 4 }}
        />
      </View>
    );
  }

  renderCustomIcon(width, height, icon) {
    const { colors } = this.props;
    return (
      <View h={height} w={width} aI={'center'} jC={'center'}>
        <CustomIcon name={icon} size={height * 0.7} color={colors.primary} />
      </View>
    );
  }

  renderSVG() {
    const {
      width,
      height,
      card,
      rem,
      padded,
      name,
      colors,
      primary,
      primaryContrast,
    } = this.props;

    const w = padded ? width - 2 * rem * padded : width;
    const h = height ? height : card ? w / 2.5 : w;

    const imageProps = {
      width: w,
      height: h,
      colors,
      primary,
      primaryContrast,
    };
    switch (name) {
      case 'blocks-card':
        return <CardBlocks {...imageProps} />;
      case 'rehive':
        return <RehiveLogo {...imageProps} />;
      case 'circles-card':
        return <CardCircles {...imageProps} />;
      case 'circles':
        return <Circles {...imageProps} />;
      case 'success':
        return <Success {...imageProps} />;
      case 'error':
        return <Fail {...imageProps} />;
      case 'info':
        return this.renderIcon(w, h, 'information-outline');
      case 'alert':
        return this.renderIcon(w, h, 'alert-circle-outline');
      case 'product':
        return this.renderIcon(w, h, 'cart-outline');
      case 'reward':
        return this.renderCustomIcon(w, h, 'Rewards');

      case 'pin':
        return <PinPlaceholder {...imageProps} />;
      case 'biometrics':
        return <BiometricsPlaceholder {...imageProps} />;
      case 'faceId':
        return <FaceIdPlaceholder {...imageProps} />;
      case 'localAuth':
        return <LocalAuthPlaceholder {...imageProps} />;
      case 'mfa':
        return <MfaPlaceholder {...imageProps} />;
      case 'otp':
        return <OtpPlaceholder {...imageProps} />;
      case 'emailVerify':
        return <EmailVerifyPlaceholder {...imageProps} />;
      case 'mobileVerify':
        return <MobileVerifyPlaceholder {...imageProps} />;

      case 'buyProducts':
        return <BuyProductsPlaceholder {...imageProps} />;
      case 'earnRewards':
        return <EarnRewardsPlaceholder {...imageProps} />;
      case 'exchange':
        return <ExchangePlaceholder {...imageProps} />;
      case 'massSend':
        return <MassSendPlaceholder {...imageProps} />;
      case 'sendToEmail':
        return <SendToEmailPlaceholder {...imageProps} />;

      case 'userDetails':
        return <UserDetails {...imageProps} />;
      case 'mobile':
        return <Mobile {...imageProps} />;
      case 'address':
        return <Address {...imageProps} />;
      case 'identity':
        return <Identity {...imageProps} />;
      case 'addressVerify':
        return <AddressVerify {...imageProps} />;
      case 'bank':
        return <Bank {...imageProps} />;
      case 'documents':
        return <Documents {...imageProps} />;
      case 'document':
        return <Document {...imageProps} />;
      case 'mobileVerification':
        return <MobileVerify {...imageProps} />;
      case 'onboardingSuccess':
        return <OnboardingSuccess {...imageProps} />;

      case 'voucher':
        return <Voucher {...imageProps} />;
      case 'scan':
      case 'qr':
        return <QR {...imageProps} />;

      case 'userVerify':
        return <UserVerify {...imageProps} />;
      case 'userVerifyPending':
        return <UserVerifyPending {...imageProps} />;
      case 'userVerifyFailed':
        return <UserVerifyFailed {...imageProps} />;
      case 'userVerifySuccess':
        return <UserVerifySuccess {...imageProps} />;
      case 'userDocFailed':
        return <UserDocFailed {...imageProps} />;
      case 'userBank':
        return <UserBank {...imageProps} />;
      case 'crypto':
        return <Crypto {...imageProps} />;

      case 'sale':
        return <Sale {...imageProps} />;
      case 'top_up':
        return <TopUp {...imageProps} />;

      case 'request':
        return <RequestSuccess {...imageProps} />;

      default:
        return this.renderUrlImage(w, h, name);
    }
  }

  render() {
    return (
      <View
        style={[
          {
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          },
          this.props.containerStyle,
        ]}>
        {this.renderSVG()}
      </View>
    );
  }
}

_CustomImage.propTypes = {
  backgroundColor: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  colors: PropTypes.object,
};

_CustomImage.defaultProps = {
  backgroundColor: 'white',
  width: SCREEN_WIDTH,
  height: 120,
  padding: 0,
  colors: {},
};

const CustomImage = context(_CustomImage);

export { CustomImage };
