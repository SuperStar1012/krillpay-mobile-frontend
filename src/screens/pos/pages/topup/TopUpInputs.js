import React from 'react';

import { View, ButtonList, TextField } from 'components';
import { getRecipientType } from 'screens/accounts/util/validation';
import PageContent from 'components/layout/PageContent';
import MobileInput from 'components/inputs/MobileInput';
import { useTheme } from 'contexts/ThemeContext';
import {
  standardizeString,
  arrayToPlaceholder,
  formatDivisibility,
} from 'utility/general';
import ContentLayout from 'components/layout/ContentLayout';
import NumpadOnly from 'components/inputs/NumpadOnly';
import WalletSmallSelector from 'components/selectors/WalletSmallSelector';

export default function TopUpFormInputs(props) {
  const { config, isSubmitting, onSubmit, form, wallet } = props;

  const setRecipient = value => form.setValue('recipient', value);

  const placeholder = standardizeString(
    arrayToPlaceholder(['email', 'mobile']).toLowerCase(),
  );

  const { colors } = useTheme();
  const { watch, setValue } = form;

  const { validation = true } = config;

  const { amount, recipient, accountRef } = watch();
  const isMobile = recipient?.[0] === '+';

  const { currency = {}, available_balance } = wallet;
  const convRate = 1;

  let maxFloat = formatDivisibility(
    available_balance * convRate,
    currency?.divisibility,
  );

  const insufficientBalance =
    amount && validation && parseFloat(amount) > maxFloat;
  const isValid =
    !!getRecipientType(recipient) && amount > 0 && !insufficientBalance;
  const actions = [
    {
      id: 'continue',
      loading: isSubmitting,
      disabled: isSubmitting || !isValid,
      onPress: onSubmit,
    },
  ];

  return (
    <View f={1} keyboardAvoiding>
      <View f={1}>
        <PageContent>
          {isMobile ? (
            <MobileInput value={recipient} onChangeText={setRecipient} />
          ) : (
            <TextField
              label="recipient"
              placeholder={placeholder}
              value={recipient}
              autoCapitalize={false}
              multiline={false}
              onChangeText={setRecipient}
              tintColor={colors.primary}
            />
          )}
        </PageContent>
        <PageContent>
          <View fD="row" jC="space-between" w="100%">
            <View f={2.5} style={{}}>
              <TextField
                label="amount"
                value={amount}
                multiline={false}
                tintColor={colors.primary}
                error={insufficientBalance && 'insufficient_balance'}
                showSoftInputOnFocus={false}
              />
            </View>
            <View w={'100%'} aI={'center'} jC="flex-end" fD={'row'} f={1}>
              <WalletSmallSelector
                form={form}
                config={{ allowedAccounts: [accountRef] }}
              />
            </View>
          </View>
        </PageContent>
        <View mh={2.5} mt={1} f={1}>
          <NumpadOnly
            currency={wallet}
            inputValue={amount}
            setValue={value => setValue('amount', value)}
          />
        </View>
      </View>
      <ContentLayout pb={1}>
        <ButtonList items={actions} />
      </ContentLayout>
    </View>
  );
}
