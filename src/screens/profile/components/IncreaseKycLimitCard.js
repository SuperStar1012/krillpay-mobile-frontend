import { useNavigation } from '@react-navigation/native';
import { View } from 'components';
import { useRehiveContext } from 'contexts';
import React from 'react';
import PromptCard from 'screens/home/components/PromptCard';
import { checkWyreModeUsers } from 'extensions/wyre/util';

export default function IncreaseKycLimitCard(props) {
  const { backgroundColor, ...restProps } = props;
  const navigation = useNavigation();
  const { services, config, user } = useRehiveContext();
  const hasWyreKYC = checkWyreModeUsers(services, config);
  if (!hasWyreKYC || user?.status === 'verified') return null;

  const cardProps = {
    id: 'kyc',
    title: 'increase_deposit_limit',
    description: 'increase_deposit_limit_description',
    variant: 'kyc',
    enable: true,
    type: 'prompt',
    onPress: () => navigation.navigate('WebView', { id: 'WyreKYC' }),
    image: 'userVerify',
    backgroundColor,
  };

  return (
    <View {...restProps}>
      <PromptCard {...cardProps} />
    </View>
  );
}
