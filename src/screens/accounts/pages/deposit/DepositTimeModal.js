import React from 'react';
import { PopUpGeneral, Text, View, Button } from 'components';
import { Icon } from 'components/outputs/Icon';

export default function DepositTimeModal(props) {
  const { onDismiss, isVisible, onAccept } = props;
  if (!Boolean(isVisible)) return null;

  return (
    <PopUpGeneral visible={Boolean(isVisible)} onDismiss={onDismiss}>
      <View w="100%" aI="center" jC="center" h={90} mb={1.5}>
        <View
          h={90}
          w={90}
          bR={90}
          style={{ opacity: 0.2 }}
          bC="info"
          pos="absolute"></View>
        <Icon
          set="MaterialCommunityIcons"
          name="alert-circle-outline"
          size={45}
          color="info"
        />
      </View>
      <Text
        id="deposit_time"
        fW="700"
        c="info"
        s={16}
        tA="center"
        options={{ capitalize: true }}
      />
      <View mv={1}>
        <Text
          id="wyre_deposit_time_description"
          s={14}
          tA="center"
          lH={26}
          options={{ boldColor: 'info' }}
        />
      </View>
      <View p={0.5}>
        <Button id="i_acknowledge" color="info" wide onPress={onAccept} />
      </View>
    </PopUpGeneral>
  );
}
