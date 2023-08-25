import React from 'react';
import { View, Text } from 'components';
import { usePoS } from 'screens/pos/util/hooks';
import { Dimensions, Pressable } from 'react-native';
import ProfilePlaceholder from 'screens/profile/components/ProfilePlaceholder';
import Image from 'components/outputs/Image';
import QRCode from 'components/outputs/QRCode';
import Header from 'components/layout/HeaderNew';
// import BusinessSelector from 'screens/pos/components/BusinessDrawer/BusinessSelector';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function StaticQR(props) {
  const {
    context: { business, user },
  } = usePoS();

  const { name, icon, logo, account } = business;
  const image = icon ?? logo;

  const qrString =
    'pay:' +
    user?.id +
    '?name=' +
    name +
    '&image=' +
    encodeURIComponent(image).replace('%', '%25') +
    '&type=pos&&account=' +
    'sales' +
    '&subtype=sale_pos&subtype_debit=purchase_pos';

  return (
    <View w="100%" screen>
      <Header
        navigation={props.navigation}
        // title={isPost ? '' : title}
        // handleBack={handleBack}
        back
        backIcon={{
          set: 'SimpleLineIcons',
          name: 'grid',
          size: 20,
          color: 'primary',
          style: { padding: 4 },
        }}
        // rightAction={
        //   <View w={180} pt={0.45}>
        //     <BusinessSelector />
        //   </View>
        // }
      />
      <View w="100%" f={1} pt={3}>
        <View pb={1} aI="center" w="100%">
          {image ? (
            <Image
              width={SCREEN_WIDTH / 3.5}
              height={SCREEN_WIDTH / 3.5}
              style={{
                borderRadius: 20,
                borderWidth: 0,
              }}
              src={image}
            />
          ) : (
            <ProfilePlaceholder size={SCREEN_WIDTH / 3.5} /> // TODO: update this?
          )}
        </View>

        {Boolean(name) && <Text tA={'center'} s={20} id={name} fW="700" />}

        <Pressable
          underlayColor={'white'}
          activeOpacity={0.2}
          // onPress={() => this._copyQR(address, values.currency)}
        >
          <View p={1}>
            <QRCode encUrl={qrString} width={SCREEN_WIDTH / 2} mt={0.5} />
          </View>
        </Pressable>

        <Text tA={'center'} s={16} id="scan_qr_code_to_pay" fW="500" />
      </View>
    </View>
  );
}
