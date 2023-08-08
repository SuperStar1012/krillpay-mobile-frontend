import React from 'react';

import { View, ButtonList } from 'components';
import ErrorOutput from 'components/outputs/ErrorOutput';
import OutputList from 'components/outputs/OutputList';
import QRCode from 'components/outputs/QRCode';

export default function MfaToken(props) {
  const { token, error, setModalVisible, onBack } = props;
  const { issuer, account, key } = token;
  const url =
    'otpauth://totp/' +
    issuer +
    ':' +
    account +
    '?secret=' +
    key +
    '&digits=6&issuer=' +
    issuer;
  const encUrl = encodeURI(url);

  async function enableAuth() {
    // enableAuthToken();
    setModalVisible(true);
  }

  const outputs = [
    { label: 'issuer', value: issuer, copy: true },
    { label: 'account', value: account, copy: true },
    { label: 'key', value: key, copy: true },
  ];

  const buttons = [
    { id: 'enable', onPress: () => enableAuth() },
    { id: 'back', onPress: onBack, type: 'text' },
  ];

  return (
    <View>
      {/* <View style={{ height: 8 }} /> */}
      <ErrorOutput>{error}</ErrorOutput>
      <QRCode encUrl={encUrl} p={0.5} />
      <View pt={0.5} pb={0.75} w="100%">
        <OutputList
          items={outputs}
          outputProps={{
            horizontal: true,
            viewStyleContainer: { marginVertical: 2 },
          }}
        />
      </View>
      <View style={{ height: 24 }} />
      <ButtonList items={buttons} />
    </View>
  );
}
