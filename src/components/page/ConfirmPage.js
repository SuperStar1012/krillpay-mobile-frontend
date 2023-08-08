import React, { useState, useEffect } from 'react';
import { View } from '../layout/View';
import { StyleSheet, TextInput } from 'react-native';
import { Button } from '../inputs/Button';
import Text from '../outputs/Text';
import { CustomImage } from '../outputs/CustomImage';
// import LottieImage from '../outputs/LottieImage';
import { intersection } from 'lodash';
import { formatTime, addCountryCode } from 'utility/general';
import { Controller } from 'react-hook-form';
import PageContent from 'components/layout/PageContent';
import Checkbox from 'components/inputs/CheckboxSimple';
import CustomRecipient from '../../screens/accounts/pages/contacts/CustomRecipient';
import { TextField } from 'components';
import Info from 'components/layout/Info';
import { useRehiveContext } from 'contexts/RehiveContext';
import { send } from 'config/inputs';
import { AntDesign } from '@expo/vector-icons';
import ButtonList from 'components/inputs/ButtonList';
import { useTheme } from 'contexts/ThemeContext';
import { useContacts } from 'contexts/ContactsContext';
import { Spinner } from 'components/outputs/Spinner';
import { useQuery } from 'react-query';
import { getStellarKnownPublicAddresses } from 'utility/rehive';
import { formatAmountString } from 'utility/rates';

export default function ConfirmPage(props) {
  let {
    header: Header,
    detail: Detail,
    onNext,
    primaryAction,
    secondaryAction,
    state = '',
    bC = 'background',
    submitting,
    hasResultConfig,
    result,
    form,
    pageId,
    hasNote,
    setRecipientDetails,
    config,
    context,
    configs,
  } = props;

  const test = JSON.stringify(props.config);

  const isConfirm = state === 'confirm';
  const date =
    result?.data?.updated ??
    result?.data?.created ??
    result?.updated ??
    result?.created ??
    '';
  const {
    context: { user },
  } = useRehiveContext();
  const dateString = date ? formatTime(date, 'lll', user) : '';
  const [showDetail, setShowDetail] = useState(isConfirm);
  useEffect(() => {
    setShowDetail(isConfirm);
  }, [isConfirm]);

  let buttons = [
    {
      onPress: onNext,
      loading: submitting,
      id: isConfirm ? 'Send Now' : 'close',
      ...primaryAction,
    },
  ];
  if (secondaryAction)
    buttons.push({
      type: 'text',
      ...secondaryAction,
    });

  const hasDetail = Boolean(Detail && result?.data?.status !== 'paid');

  const { wallet, wyreCurrency } = context;
  const { currency } = wallet;

  const values = form.getValues();
  const { conversionQuote, fromWallet, toWallet } = values;
  const { currency: convCurrency } = fromWallet ?? toWallet ?? {};

  const hasConversion = convCurrency && currency?.code !== convCurrency?.code;
  const isLoading = hasConversion && !conversionQuote;
  if (isLoading) return <Spinner />;

  const { getValues, control } = form;

  const { recipient, type, memoSkip, memo, contact } = getValues();
  const { colors } = useTheme();
  const recipientTypes = intersection(['email', 'mobile']);
  const { context: contacts } = useContacts(recipientTypes);

  const recipientDetails =
    contacts?.phone?.krillpayUsers?.find(x => x.contact == recipient) ??
    contacts?.phone?.contacts?.find(x => x.contact == contact);

  const nonKrillPayUser = contacts?.phone?.contacts?.some(
    contact => contact?.contact === recipientDetails?.contact,
  );

  useEffect(() => {
    if (recipientDetails) {
      setRecipientDetails(recipientDetails);
    }
  }, [recipientDetails]);

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

  const styles = StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: colors.grey,
      color: '#000000',
      borderRadius: 5,
      padding: 10,
      paddingTop: 20,
      paddingBottom: 20,
      marginTop: 20,
    },
    text: {
      textAlign: 'center',
      textAlignVertical: 'center',
    },
  });

  return (
    <View f={1} bC={bC}>
      <View f={1} scrollView>
        {!hasNote && (
          <View
            mh={1.5}
            mt={1}
            p={1.5}
            bC={isConfirm ? 'primary' : state}
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              ...(!hasDetail
                ? { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }
                : {}),
            }}>
            <Header {...props} />
          </View>
        )}

        {!hasNote && hasDetail ? (
          <View
            mh={1.5}
            p={1.5}
            bC="white"
            style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
            <Button
              disabled={hasResultConfig}
              onPress={() => setShowDetail(!showDetail)}>
              <View fD="row" jC="space-between">
                <Text fW="700" s={16} id="details" capitalize />
                {!hasResultConfig && (
                  <AntDesign
                    name={showDetail ? 'caretup' : 'caretdown'}
                    size={18}
                    color="black"
                  />
                )}
              </View>
            </Button>
            {(showDetail || hasResultConfig) && (
              <View mt={1}>
                <Detail {...props} />
              </View>
            )}
          </View>
        ) : null}

        {hasNote && (
          <>
            <View
              mh={1.5}
              mt={1}
              p={1.5}
              style={{
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                ...(!hasDetail
                  ? { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }
                  : {}),
              }}>
              <Header {...props} recipientDetails={recipientDetails} />
            </View>

            {recipientDetails && !nonKrillPayUser && (
              <View f={1}>
                <PageContent>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        label=""
                        // multiline={true}
                        tintColor={colors.primary}
                        // style={styles.input}
                        placeholder="Type a short message here"
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        // maxLength={100}
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
                        <Text
                          s={12}
                          fW="500"
                          id={pageId + '_note_recipient_label'}
                        />
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
                        This is a third party wallet or exchange that requires a
                        memo, sometimes referred to as a tag or reference.
                        Failing to provide the correct memo could result in
                        losing your funds or a significant delay from the third
                        party while they confirm your identity before they
                        allocate the funds to your account.
                      </Info>
                    ) : (
                      !Boolean(memo) && (
                        <PageContent style={{ minHeight: 70 }} pl={1}>
                          <Checkbox
                            containerStyle={{
                              paddingBottom: 0,
                              marginVertical: 0,
                            }}
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
              </View>
            )}
          </>
        )}
        {recipientDetails &&
          (!nonKrillPayUser ? (
            <Text p={1.5} style={styles.text}>
              Please review the info above to make sure this is your intended
              recipient. Once you send, your transaction cannot be reversed.
            </Text>
          ) : (
            <View
              f={1}
              style={{
                margin: 20,
                paddingTop: 20,
                paddingBottom: 20,
              }}>
              <Text
                p={1.5}
                style={{
                  ...styles.text,
                  color: '#ff0000',
                  borderColor: '#ff0000',
                  borderWidth: 2,
                }}>
                Since{' '}
                <Text
                  style={{
                    ...styles.text,
                    color: '#ff0000',
                    fontWeight: '700',
                  }}>
                  {recipientDetails?.name || recipientDetails?.contact}
                </Text>{' '}
                is a non-KrillPay user, this transaction cannot be completed.
              </Text>
              <View
                style={{
                  marginTop: 30,
                }}>
                <Button p={1.5} disabled wide id="Send Now" />
              </View>
            </View>
          ))}
        {recipientDetails && !nonKrillPayUser && (
          <ButtonList p={1.5} items={buttons} />
        )}
      </View>
    </View>
  );
}
