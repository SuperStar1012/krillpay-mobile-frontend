import React, { useState } from 'react';
import { Text, View } from 'components';
import SplitFlowLayout from 'components/layout/SplitFlowLayout';
import { Pressable } from 'react-native';
import { useToast } from 'contexts/ToastContext';
import { useRehiveContext } from 'contexts/RehiveContext';
import { concatAddress } from 'utility/general';
import DetailList from 'components/outputs/DetailList';
import * as Clipboard from 'expo-clipboard';

export default function ManualDeposit(props) {
  const { navigation, context } = props;
  const { wallet, selectedManualAccount } = context;

  const buttons = [
    { id: 'ive_made_the_deposit', onPress: () => navigation.goBack() },
  ];

  // TODO: handle no bank acc

  return (
    <View f={1}>
      <SplitFlowLayout
        contentHeader={<DepositHeader reference={wallet?.account} />}
        contentDetail={<DepositDetail account={selectedManualAccount} />}
        buttons={buttons}
      />
    </View>
  );
}

function DepositHeader(props) {
  const { reference } = props;
  const { showToast } = useToast();

  function handleCopy() {
    Clipboard.setString(reference);
    typeof showToast === 'function' &&
      showToast({
        text: 'Reference copied to clipboard\n' + reference,
        variant: 'success',
      });
  }
  return (
    <Pressable onPress={handleCopy}>
      <Text c="white" p={0.25} s={18} tA="center" id="deposit_header" />
      <Text c="white" s={36} p={0.5} tA="center" fW="700">
        {reference}
      </Text>
      <Text c="white" s={12} tA="center" id="tap_to_copy" />
    </Pressable>
  );
}
function DepositDetail(props) {
  const { account = {} } = props;

  const {
    bank_name,
    bank_code,
    name,
    number,
    type,
    branch_code,
    swift,
    iban,
    bic,
    branch_address = {},
    routing_number,
  } = account;
  const {
    config: { settingsConfig },
  } = useRehiveContext();
  const { bank = {}, legal = {}, locales } = settingsConfig;
  const { hideFields: hideBankFields = [] } = bank;
  const address = concatAddress(branch_address);

  // let bankFields = [
  //   'name',
  //   'bank_name',
  //   'type',
  //   'number',
  //   'bank_code',
  //   'branch_code',
  //   'bic',
  //   'swift',
  //   'iban',
  //   'routing_number',
  //   'branch_address',
  // ];

  // const items = {
  //   bank_name: { label: 'bank_name', value: bank_name, copy: true },
  //   type: { label: 'account_type', value: type, copy: true },
  //   number: {
  //     label: 'account_number',
  //     value: number,
  //     copy: true,
  //   },
  //   bank_code: { label: 'bank_code', value: bank_code, copy: true },
  //   branch_code: { label: 'branch_code', value: branch_code },
  //   name: { label: 'account_name', value: name, copy: true },
  //   swift: { label: 'swift', value: swift },
  //   routing_number: { label: 'routing_number', value: routing_number },
  //   iban: { label: 'iban', value: iban },
  //   bic: { label: 'bic', value: bic },
  //   branch_address: { label: 'branch_address', value: address },
  // };

  let items = [
    {
      id: 'name',
      label: 'account_name',
      value: name,
      copy: true,
    },
    { label: 'bank_name', value: bank_name, copy: true },
    {
      id: 'number',
      label: 'account_number',
      value: number,
      copy: true,
    },
    { id: 'type', label: 'account_type', value: type, copy: true },
    { label: 'branch_code', value: branch_code },
    { label: 'bank_code', value: bank_code, copy: true },
    { label: 'swift', value: swift },
    { label: 'routing_number', value: routing_number },
    { label: 'iban', value: iban },
    { label: 'bic', value: bic },
    { label: 'branch_address', value: address },
  ]
    .filter(
      item =>
        !hideBankFields.includes(item?.id) &&
        !hideBankFields.includes(item?.label),
    )
    .filter(item => item.value);

  /* TODO:
    1. add multi bank acc selector
    2. supported currencies
    3. output labels
    4. output text size
    5. capitalise
    5. output list spacing
    */

  return (
    <View>
      <Text tA="center" fW="700" id="make_you_deposit" />
      <View pt={1}>
        <Text tA="center" s={14} id="bank_deposit_helper" />
      </View>
      <View mt={2}>
        <DetailList {...{ items, locales }} />
      </View>
    </View>
  );
}
