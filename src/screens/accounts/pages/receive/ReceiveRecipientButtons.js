import React from 'react';
import { View, Button } from 'components';

export default function ReceiveRecipientButtons(props) {
  const { modalProps, formikProps, context } = props;
  const { values, setFieldValue } = formikProps;
  const { email, recipientType, mobile } = values;

  const { crypto, wallet, actionsConfig, wyreReceiveAddress } = context;

  const cryptoUser = crypto?.[wallet.crypt]?.user?.crypto ?? {};

  let config = actionsConfig?.receive?.config ?? {};
  let { recipient: recipientConfig = ['email', 'mobile', 'crypto'] } = config;

  if (wallet?.crypto || wyreReceiveAddress) {
    const hideCurrencies = (
      actionsConfig?.withdraw?.condition?.hideCurrency ?? []
    ).map(x => x?.toLowerCase());

    if (hideCurrencies.includes(wallet?.currency?.code.toLowerCase()))
      recipientConfig = recipientConfig.filter(item => item !== 'crypto');
  } else {
    recipientConfig = recipientConfig.filter(item => item !== 'crypto');
  }
  if (!mobile) {
    recipientConfig = recipientConfig.filter(item => item !== 'mobile');
  }

  if (recipientConfig?.length < 2) return null;

  return (
    <View fD={'row'} jC={'space-between'} pt={1} mh={-0.5}>
      {email && recipientConfig.includes('email') ? (
        <View f={1} mh={0.5}>
          <Button
            color={'primary'}
            type={recipientType === 'email' ? 'contained' : 'outlined'}
            onPress={() => {
              setFieldValue('recipientType', 'email');
              setFieldValue('memoSelected', false);
            }}
            id="email"
            size="small"
            wide
          />
        </View>
      ) : null}
      {mobile && recipientConfig.includes('mobile') ? (
        <View f={1} mh={0.5}>
          <Button
            color={'primary'}
            type={recipientType === 'mobile' ? 'contained' : 'outlined'}
            onPress={() => {
              setFieldValue('recipientType', 'mobile');
              setFieldValue('memoSelected', false);
            }}
            id="mobile_short"
            size="small"
            wide
          />
        </View>
      ) : null}
      {(wallet?.crypto || wyreReceiveAddress) &&
      recipientConfig.includes('crypto') ? (
        <View f={1} mh={0.5}>
          <Button
            color={'primary'}
            type={recipientType === 'crypto' ? 'contained' : 'outlined'}
            onPress={() => {
              if (wallet.crypto === 'XLM' || wallet.crypto === 'TXLM') {
                setFieldValue(
                  'memo',
                  cryptoUser.username
                    ? cryptoUser.username
                    : cryptoUser.memo
                    ? cryptoUser.memo
                    : '',
                );
                setFieldValue('memoSelected', true);
                setFieldValue('noteSelected', false);
                modalProps.showModal();
              }
              setFieldValue('recipientType', 'crypto');
            }}
            id="crypto"
            size="small"
            wide
          />
        </View>
      ) : null}
    </View>
  );
}
