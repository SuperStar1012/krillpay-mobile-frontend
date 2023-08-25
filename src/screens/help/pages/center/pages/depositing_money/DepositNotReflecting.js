import React from 'react';
import { View } from 'components';
import HelpText from 'screens/help/components/HelpText';
import Info from 'components/layout/Info';
import NumberedList from 'screens/help/components/NumberedList';
import QuestionTitle from 'screens/help/components/QuestionTitle';

export default function DepositNotReflecting(props) {
  const { context } = props;

  const { companyBankAccounts, services } = context;
  const hasWyreService = true; // checkWyreService(context?.services??{})
  const hasCompanyBankAccounts = companyBankAccounts?.items?.length > 0;

  return (
    <View mh={1.5} pt={1}>
      <HelpText id="deposit_not_reflecting_text" />
      {hasCompanyBankAccounts && <ManualDeposit />}
      {hasWyreService && <WyreDeposit />}
    </View>
  );
}

function ManualDeposit(props) {
  return (
    <View pt={1}>
      <QuestionTitle id="manual_deposit" />
      <HelpText id="deposit_not_reflecting_manual" />
    </View>
  );
}

function WyreDeposit(props) {
  return (
    <View pt={1}>
      <QuestionTitle id="wyre_deposit" />
      <HelpText id="deposit_not_reflecting_wyre" />
    </View>
  );
}
