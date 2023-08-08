import React from 'react';
import { View, Text, Button } from 'components';
import { useRehiveContext } from 'contexts/RehiveContext';
import PageContent from 'components/layout/PageContent';
import Images from 'components/images';

export default function MfaLanding(props) {
  const { onToken, onSms, authScreen } = props;

  const {
    config: {
      settingsConfig: { hideSmsMfa = false },
    },
  } = useRehiveContext();
  return (
    <View>
      {!!authScreen && (
        <PageContent pb={2}>
          <Images name="mfa" width={100} />
        </PageContent>
      )}
      <Text tA={'center'} id="mfa_auth_description"></Text>
      <View mt={2}>
        <View mb={0.5}>
          <Button id="token" color="primary" wide onPress={onToken} />
        </View>
        {!hideSmsMfa && (
          <Button id="sms" color="primary" wide onPress={onSms} />
        )}
      </View>
    </View>
  );
}
