import React, { useEffect, useState } from 'react';
import { Button, View, Text } from 'components';
import WalletSelector from '../../components/selectors/WalletSelector';
import ContentLayout from 'components/layout/ContentLayout';

export default function AccountsStep(props) {
  const { form, context } = props;
  const { setValue } = form;
  const { wallet } = context;

  const [init, setInit] = useState(false);

  useEffect(() => {
    if (init) setValue('toCurrency', wallet?.currency);
    else setInit(true);
  }, [wallet?.currency?.code]);

  return (
    <View f={1} jC="space-between">
      <View>
        <Text s={18} fW={'700'} paragraph tA={'center'} id="deposit_funds" />
        <Text
          s={14}
          paragraph
          tA={'center'}
          id="deposit_funds_accounts_description"
        />
      </View>
      <View f={1} pt={1}>
        <ContentLayout pb={2}>
          <WalletSelector {...props} />
        </ContentLayout>
      </View>

      <ContentLayout pb={1.5}>
        <Button
          // disabled={!withdrawAccount?.id && validation}
          id="next"
          wide
          onPress={props.onNext}
        />
      </ContentLayout>
    </View>
  );
}
