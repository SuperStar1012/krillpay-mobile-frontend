import React from 'react';
import { Text, TextField, Button, View } from 'components';
import { useTheme } from 'contexts/ThemeContext';
import { Controller } from 'react-hook-form';
import PageContent from 'components/layout/PageContent';
import CustomRecipient from '../../pages/contacts/CustomRecipient';
import Checkbox from 'components/inputs/CheckboxSimple';
import { send } from 'config/inputs';
import Info from 'components/layout/Info';
import { addCountryCode } from 'utility/general';
import { useQuery } from 'react-query';
import { getStellarKnownPublicAddresses } from 'utility/rehive';

export default function NoteStep(props) {
  const { form, context, pageId, config } = props;
  const { getValues, control } = form;
  const { wallet, wyreCurrency } = context;

  const { recipient, type, memoSkip, memo, contact } = getValues();
  const { colors } = useTheme();

  const wyreCrypto = wyreCurrency?.wyre_currency_code_for_deposit;

  const showMemo =
    pageId !== 'withdraw' &&
    Boolean(type === 'crypto' && (wallet?.crypto || wyreCrypto)?.match(/XLM/));

  const disabled = Boolean(showMemo && !(memoSkip || memo));
  const showCountryHelp = type === 'mobile' && contact?.[0] !== '+';

  const queryKnownPublicAddresses = useQuery(
    ['stellarKnownPublicAddresses'],
    getStellarKnownPublicAddresses,
    { enabled: showMemo },
  );
  const knownAddresses = queryKnownPublicAddresses?.data?.data ?? [];

  const requiresMemo =
    knownAddresses?.find(item => item.public_address === recipient)
      ?.requires_memo ?? false;

  return (
    <>
      <View f={1}>
        <Text s={20} tA="center" p={0.25} id={pageId + '_note_title'} />
        <PageContent>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="note"
                multiline={false}
                tintColor={colors.primary}
                //   style={styles.input}
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
              />
            )}
            name="note"
            // rules={{ required: true }}
            defaultValue=""
          />
        </PageContent>
        {Boolean(config) && (
          <>
            <PageContent dense>
              <View pb={0.5}>
                <Text s={12} fW="500" id={pageId + '_note_recipient_label'} />
              </View>
            </PageContent>
            <CustomRecipient
              {...props}
              label=""
              value={recipient}
              type={type}
              // onSelect={handleContactSelect}
              wallet={wallet}
            />
          </>
        )}

        {showMemo ? (
          <View>
            {!Boolean(memoSkip) && (
              <PageContent dense>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                      {...(send?.memo ?? {})}
                      tintColor={colors.primary}
                      //   style={styles.input}
                      onBlur={onBlur}
                      onChangeText={value => onChange(value)}
                      value={value}
                    />
                  )}
                  name="memo"
                  // rules={{ required: true }}
                  defaultValue=""
                />
              </PageContent>
            )}
            {requiresMemo ? (
              <Info variant="warning" mb={1}>
                This is a third party wallet or exchange that requires a memo,
                sometimes referred to as a tag or reference. Failing to provide
                the correct memo could result in losing your funds or a
                significant delay from the third party while they confirm your
                identity before they allocate the funds to your account.
              </Info>
            ) : (
              !Boolean(memo) && (
                <PageContent style={{ minHeight: 70 }} pl={1}>
                  <Checkbox
                    containerStyle={{ paddingBottom: 0, marginVertical: 0 }}
                    label={'memo_skip_transaction_label'}
                    onPress={() => form.setValue('memoSkip', !memoSkip)}
                    value={memoSkip}
                    key={'memoSkip'}
                    centerAlign
                  />
                </PageContent>
              )
            )}
          </View>
        ) : null}
        {!!showCountryHelp && (
          <Info>
            {'The country code ' +
              addCountryCode('', context?.user?.nationality) +
              ' was automatically added to your number, go back to the previous step to change it'}
          </Info>
        )}
      </View>
      <PageContent pb={1.5}>
        <Button disabled={disabled} id="next" wide onPress={props.onNext} />
      </PageContent>
    </>
  );
}
