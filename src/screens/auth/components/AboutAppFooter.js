import React from 'react';
import { View, Text, Button } from 'components';
import { useCompany } from 'contexts/CompanyContext';

export default function AboutAppFooter(props) {
  const { onAbout } = props;
  const { company: client } = useCompany();

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
