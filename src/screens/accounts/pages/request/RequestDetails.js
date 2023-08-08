import React from 'react';
import { Text, View } from 'components';
import { Pressable, Share, Platform } from 'react-native';
import { Icon } from 'components/outputs/Icon';

export default function RequestDetails(props) {
  const { result } = props;

  return result?.data?.status != 'paid' ? (
    <Pressable
      onPress={() =>
        Share.share({
          ...Platform.select({
            ios: {
              url: result?.data?.redirect_url,
            },
            android: {
              message: result?.data?.redirect_url,
            },
          }),
        })
      }>
      <View fD="row">
        <Text id="share_payment_link" s={12} c="primary" />
        <Icon
          pl={0.5}
          name="link-variant"
          size={16}
          color="primary"
          set="MaterialCommunityIcons"
        />
      </View>
    </Pressable>
  ) : null;
}
