import React from 'react';
import { Text, View } from 'components';
import { formatAmountString } from 'utility/rates';
import { concatAddress } from 'utility/general';
import DetailList from 'components/outputs/DetailList';
import { useFeeWithConversion } from 'screens/accounts/util/fees';
import { mapSubtype } from 'screens/accounts/util/accounts';
import { useConversion } from 'screens/accounts/util/rates';
import Info from 'components/layout/Info';

export default function WithdrawDetails(props) {
  const { form, context, pageId, result } = props;

  const { amount, withdrawAccount, toCurrency } = form.getValues();
  const { wallet, rates, tier, actionConfig, allowCryptoBankWithdraw } =
    context;
  const cryptoSelectedBankForWithdraw =
    allowCryptoBankWithdraw && withdrawAccount?.bank_name;
  const { confirmMessage = '', message } = actionConfig?.config ?? {};
  const { currency } = wallet;
  const isCrypto =
    Boolean(wallet?.crypto) && toCurrency?.code === currency?.code;
  let itemsDetails = [
    {
      label: 'withdraw_amount',
      value: formatAmountString(amount, currency),
    },
  ];

  const { convRate } = useConversion(parseFloat(amount), rates, currency);
  const { totalString, feeString, fee, feeConvString, totalConvString } =
    useFeeWithConversion(
      amount,
      tier,
      currency,
      mapSubtype({ pageId, wallet }),
      convRate,
      rates.displayCurrency,
    );

  if (fee) {
    itemsDetails.push({
      id: 'fee',
      label: 'service_fee',
      value: feeString,
      value2: feeConvString,
      horizontal: true,
    });
    itemsDetails.push({
      id: 'total_amount',
      value: totalString,
      value2: totalConvString,
      horizontal: true,
      bold: true,
    });
  }

  let itemsAccountDetails = [
    { label: 'from_account', value: wallet?.account_name },
    !cryptoSelectedBankForWithdraw && isCrypto
      ? { label: 'to_address', value: withdrawAccount?.address }
      : {
          label: 'to_account',
          value: withdrawAccount?.bank_name,
          value2: withdrawAccount?.number,
        },
  ];

  return (
    <View w="100%">
      {Boolean((confirmMessage && !result) || message) && (
        <Info m={0} mb={0.5} id={result ? message : confirmMessage} />
      )}
      <DetailList items={itemsDetails} pb={1} />
      <Text s={16} fW="bold" id="account_details" capitalize />
      <DetailList
        items={itemsAccountDetails}
        pb={cryptoSelectedBankForWithdraw || !isCrypto ? 1 : 0}
      />
      {(cryptoSelectedBankForWithdraw || !isCrypto) && (
        <>
          <Text s={16} fW="bold" id="bank_details" capitalize />
          <BankAccountDetails withdrawAccount={withdrawAccount} />
        </>
      )}
    </View>
  );
}

function BankAccountDetails({ withdrawAccount }) {
  const {
    name,
    type,
    number,
    bank_name,
    bank_code,
    branch_code,
    swift,
    iban,
    bic,
    branch_address,
  } = withdrawAccount;
  const address = concatAddress(branch_address);

  let items = [];
  if (name) items.push({ label: 'name', value: name });
  if (type) items.push({ label: 'type', value: type });
  if (number) items.push({ label: 'number', value: number });
  if (bank_name) items.push({ label: 'bank_name', value: bank_name });
  if (bank_code) items.push({ label: 'bank_code', value: bank_code });
  if (branch_code) items.push({ label: 'branch_code', value: branch_code });
  if (swift) items.push({ label: 'swift', value: swift });
  if (iban) items.push({ label: 'iban', value: iban });
  if (bic) items.push({ label: 'bic', value: bic });
  if (address)
    items.push({
      label: 'branch_address',
      value: address,
    });

  return <DetailList items={items} />;
}
