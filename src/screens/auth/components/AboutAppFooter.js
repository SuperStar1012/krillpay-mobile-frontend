import React from 'react';
import { View, Text, Button } from 'components';
import { standardizeString } from 'utility/general';
import client from 'config/client';

export default function AboutAppFooter(props) {
  const { company, onAbout } = props;

  if (Boolean(client?.company)) {
    return null;
  }
  return (
    <View fD="column" aI="center" jC="center" mb={1} w="100%" bC="white">
      <Text s={14} lH={21} id="auth_footer_disclaimer" />
      <Button onPress={onAbout}>
        <Text
          c="primary"
          s={14}
          lH={21}
          style={{ textDecorationLine: 'underline', marginLeft: 4 }}
          id="auth_footer_about"
        />
      </Button>
    </View>
  );
}
