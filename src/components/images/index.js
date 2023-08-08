import React from 'react';
import { Image } from 'react-native';

import { View } from 'components/layout/View';
import Currency from './Currency';
// import PrimaryCurrency from './DisplayCurrency';
import Language from './Language';
import Bank from './Bank';
import Crypto from './Crypto';
import FaceID from './FaceID';
import Devices from './Devices';
import Fingerprint from './Fingerprint';
import MFA from './Mfa';
import Notifications from './Notifications';
import OTP from './OTP';
import Password from './Password';
import Pin from './Pin';
import { useTheme } from 'components/context';
import Basic from './BasicInfo';
import Email from './Email';
import Mobile from './Mobile';
import Document from './Document';
import Tier1 from './Tier1';
import Tier2 from './Tier2';
import Tier3 from './Tier3';
import Address from './Address';
import ProductPlaceholder from './ProductPlaceholder';

import WyreLogo from './wyre.svg';
import PlaidIcon from './plaid.svg';
import WyreIcon from './wyre-icon.svg';
import CurrencyPlaceholderImage, {
  images,
} from 'components/outputs/CurrencyBadge/CurrencyPlaceholderImage';

export default function Images(props) {
  const { width, height = width, card, rem, padded, name } = props;

  const { colors } = useTheme();

  function renderSVG() {
    const w = padded ? width - 2 * rem * padded : width;
    const h = height ? height : card ? w / 2.5 : w;

    const imageProps = { width: w, height: h, colors };

    switch (name) {
      case 'address':
        return <Address {...imageProps} />;
      case 'profile':
        return <Basic {...imageProps} />;
      case 'email':
        return <Email {...imageProps} />;
      case 'mobile':
        return <Mobile {...imageProps} />;
      case 'document':
        return <Document {...imageProps} />;
      case 'tier1':
        return <Tier1 {...imageProps} />;
      case 'tier2':
        return <Tier2 {...imageProps} />;
      case 'tier3':
        return <Tier3 {...imageProps} />;
      case 'bank':
        return <Bank {...imageProps} />;
      case 'crypto':
        return <Crypto {...imageProps} />;
      case 'displayCurrency':
      case 'primaryCurrency':
        return <Currency {...imageProps} />;
      case 'pin':
        return <Pin {...imageProps} />;
      case 'FaceID':
      case 'localAuth':
        return <FaceID {...imageProps} />;
      case 'fingerprint':
        return <Fingerprint {...imageProps} />;
      case 'devices':
        return <Devices {...imageProps} />;
      case 'password':
        return <Password {...imageProps} />;
      case 'mfa':
        return <MFA {...imageProps} />;
      case 'otp':
        return <OTP {...imageProps} />;
      case 'notifications':
        return <Notifications {...imageProps} />;
      case 'language':
        return <Language {...imageProps} />;
      case 'wyre':
      case 'wyre-logo':
        return <WyreLogo {...imageProps} />;
      case 'wyre-icon':
        return <WyreIcon {...imageProps} />;
      case 'plaid':
      case 'plaid-logo':
        return <PlaidIcon {...imageProps} />;
      // case 'mobile':
      //   return <Mobile {...imageProps} />;

      case 'product':
        return <ProductPlaceholder {...imageProps} />;

      default:
        return <Image style={{ width: w, height: h }} source={{ uri: name }} />;
    }
  }
  if (images[name]) {
    return (
      <CurrencyPlaceholderImage name={name} height={height} width={width} />
    );
  }

  return (
    <View
      style={[
        {
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        },
        props.containerStyle,
      ]}>
      {renderSVG()}
    </View>
  );
}

// _CustomImage.propTypes = {
//   backgroundColor: PropTypes.string,
//   width: PropTypes.number,
//   height: PropTypes.number,
//   padding: PropTypes.number,
//   colors: PropTypes.object,
// };

// _CustomImage.defaultProps = {
//   backgroundColor: 'white',
//   width: SCREEN_WIDTH,
//   height: 120,
//   padding: 0,
//   colors: {},
// };
