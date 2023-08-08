import React from 'react';
import { PopUpGeneral, Text, View, Button } from 'components';
import { Icon } from 'components/outputs/Icon';
import { useNavigation } from '@react-navigation/native';

const configs = {
  pending: {
    color: 'primary',
    title: 'documents_pending',
    description: 'documents_pending_description',
  },
  failed: {
    color: 'fail',
    title: 'documents_failed',
    description: 'documents_failed_description',
  },
  kyc: {
    color: 'warning',
    title: 'kyc_pending',
    description: 'kyc_pending_description',
  },
};

export default function DepositBlocker(props) {
  const { onDismiss, isVisible } = props;

  const navigation = useNavigation();
  function handleRedirect() {
    onDismiss();
    if (isKYC) navigation.navigate('WebView', { id: 'WyreKYC' });
    else
      navigation.navigate('Profile', {
        screen: 'ProfilePage',
        params: { id: 'document' },
      });
  }
  const isKYC = isVisible === 'kyc';

  if (!Boolean(isVisible)) return null;

  const config = configs?.[isVisible];
  if (!Boolean(config)) return null;

  const { color, title, description } = config;

  const buttonProps = {
    id: isKYC ? 'go_to_kyc' : 'go_to_documents',

    onPress: handleRedirect,
  };

  return (
    <PopUpGeneral visible={Boolean(isVisible)} onDismiss={onDismiss}>
      <View w="100%" aI="center" jC="center" h={90} mb={1.5}>
        <View
          h={90}
          w={90}
          bR={90}
          style={{ opacity: 0.2 }}
          bC={color}
          pos="absolute"></View>
        <Icon
          set="MaterialCommunityIcons"
          name="file-document"
          size={45}
          color={color}
        />
      </View>
      <Text
        id={title}
        fW="700"
        c={color}
        s={16}
        tA="center"
        options={{ capitalize: true }}
      />
      <View mv={1}>
        <Text id={description} s={14} tA="center" lH={26} />
      </View>
      <View p={0.5}>
        <Button color={color} wide {...buttonProps} />
      </View>
    </PopUpGeneral>
  );
}
