import React from 'react';
import { View, Text } from 'components';
import { Dimensions, Pressable } from 'react-native';
import Image from 'components/outputs/Image';
import OutputList from 'components/outputs/OutputList';
import ProfilePlaceholder from 'screens/profile/components/ProfilePlaceholder';
import { generateReceive } from 'utility/receive';
import QRCode from 'components/outputs/QRCode';
import ReceiveRecipientButtons from './ReceiveRecipientButtons';
import * as Clipboard from 'expo-clipboard';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ReceiveQR(props) {
  const { formikProps, context, showToast } = props;

  const { crypto, wallet, rates, services, user, config, wyreReceiveAddress } =
    context;
  const { values } = formikProps;

  const photoLink = user.profile;
  const { amount, recipientType } = values;
  const name = user.first_name + (user.last_name ? ' ' + user.last_name : '');

  let {
    recipient: recipientConfig = ['email', 'mobile', 'crypto'],
    showRecipientButtonsQr = false,
  } = config;
  if (recipientConfig?.length === 0) {
    recipientConfig = ['email', 'mobile', 'crypto'];
  }

  const { receiveQRString, sentenceString, outputItems, address } =
    generateReceive({
      services,
      rates,
      currency: wallet,
      values,
      crypto,
      wyreReceiveAddress,
    });

  const text = amount ? (
    <Text tA={'center'} c="primary" s={30} fW="500">
      {sentenceString}
    </Text>
  ) : recipientType !== 'crypto' ? (
    <Text tA={'center'} s={16} fW="400" c={'#848484'}>
      {address}
    </Text>
  ) : null;

  function copyQR() {
    Clipboard.setString(receiveQRString);
    showToast({
      id: 'receive_copy' + (wallet?.crypto.includes('XLM') ? '_stellar' : ''),
      duration: 3000,
      context: { receiveString: receiveQRString },
    });
  }

  return (
    <React.Fragment>
      <View pb={name ? 1 : 0.25} w={'100%'} aI="center">
        {showRecipientButtonsQr && (
          <View ph={1.5} w="100%">
            <ReceiveRecipientButtons {...props} />
          </View>
        )}
        <View pt={1}>
          {photoLink ? (
            <Image
              width={SCREEN_WIDTH / 3.5}
              height={SCREEN_WIDTH / 3.5}
              style={{
                borderRadius: 200,
                borderWidth: 0,
              }}
              src={photoLink}
              key={photoLink}
            />
          ) : (
            <ProfilePlaceholder size={SCREEN_WIDTH / 3.5} />
          )}
        </View>
      </View>
      {Boolean(name) && <Text tA={'center'} s={20} id={name} />}

      {Boolean(text) && (
        <View p={1} w={'100%'} style={{ paddingBottom: 0 }}>
          {text}
        </View>
      )}
      <Pressable underlayColor={'white'} activeOpacity={0.2} onPress={copyQR}>
        <QRCode
          encUrl={encodeURIComponent(receiveQRString)}
          width={SCREEN_WIDTH / 2.2}
          mt={0.5}
        />
      </Pressable>

      {Boolean(amount) && recipientType !== 'crypto' ? (
        <View p={1} pt={0.01} w={'100%'}>
          <Text tA={'center'} o={0.67}>
            {address}
          </Text>
        </View>
      ) : outputItems?.length ? null : (
        <Text tA={'center'} s={16} fW="400" id="scan_qr_code_to_pay" />
      )}
      <View aI={'flex-start'} p={1} pt={0.25} ph={1.5}>
        <OutputList items={outputItems} />
      </View>
    </React.Fragment>
  );
}
