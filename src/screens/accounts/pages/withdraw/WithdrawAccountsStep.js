import React, { useEffect, useState } from 'react';
import { Button, View } from 'components';
import WalletSelector from '../../components/selectors/WalletSelector';
import ContentLayout from 'components/layout/ContentLayout';
import ExternalAccountSelector from 'screens/accounts/components/selectors/ExternalAccountSelector';
import { useRehive } from 'hooks/rehive';
import { checkIfCrypto, checkIfStellar } from 'screens/accounts/util/crypto';
import { useWyreCurrency } from 'extensions/wyre/hooks';
import { union } from 'lodash';
import { Text } from 'react-native';

export default function WithdrawAccountsStep(props) {
  const { config = {}, form, context } = props;
  const { watch, setValue } = form;
  const { validation = true } = config;
  const { wallet, user, crypto, allowCryptoBankWithdraw } = context;

  const withdrawAccount = watch('withdrawAccount');
  const toCurrency = watch('toCurrency');
  const [init, setInit] = useState(false);
  const { data: wyreCurrency, isLoading } = useWyreCurrency(wallet);

  useEffect(() => {
    if (init) setValue('toCurrency', wallet?.currency);
    else setInit(true);
  }, [wallet?.currency?.code]);

  const isStellar = checkIfStellar({ wallet, wyreCurrency });
  const getCryptoCode = checkIfCrypto({ currency: toCurrency, crypto });
  const isCrypto = isStellar
    ? 'XLM'
    : getCryptoCode
    ? getCryptoCode
    : wyreCurrency?.is_crypto
    ? wyreCurrency?.wyre_code
    : false;

  let accountTypes = [isCrypto ? 'crypto_account' : 'bank_account'];
  if (allowCryptoBankWithdraw) accountTypes.push('bank_account');
  const { context: data, refresh } = useRehive(accountTypes, true, { user });
  const withdrawAccounts = union(
    data?.crypto_account?.items ?? [],
    data?.bank_account?.items ?? [],
  );

  return (
    <View f={1} pt={1.5} jC="space-between">
      <View>
        <ContentLayout pb={2}>
          <WalletSelector {...props} />
        </ContentLayout>

        <ContentLayout>
          <ExternalAccountSelector
            {...props}
            items={withdrawAccounts}
            loading={
              isLoading ||
              data?.crypto_account?.loading ||
              data?.bank_account?.loading
            }
            refresh={refresh}
            isCrypto={isCrypto}
            variant={isCrypto ? 'crypto_account' : 'bank_account'}
            label="withdraw_to"
            allowCryptoBankWithdraw={allowCryptoBankWithdraw}
          />
        </ContentLayout>
      </View>

      <ContentLayout pb={1.5}>
        <Button
          disabled={!withdrawAccount?.id && validation}
          id="next"
          wide
          onPress={props.onNext}
        />
      </ContentLayout>
    </View>
  );
}
