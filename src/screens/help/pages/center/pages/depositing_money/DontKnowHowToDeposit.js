import React from 'react';
import { View } from 'components';
import QuestionTitle from 'screens/help/components/QuestionTitle';
import Info from 'components/layout/Info';
import NumberedList from 'screens/help/components/NumberedList';
import HelpText from 'screens/help/components/HelpText';
import Links from 'screens/help/components/Links';

export default function DontKnowHowToDeposit(props) {
  const { context } = props;
  
  const { companyBankAccounts, services } = context;
  const hasWyreService = true; // checkWyreService(services)
  const hasCompanyBankAccounts = companyBankAccounts?.items?.length > 0;

  return (
    <View mh={1.5}>
      {hasCompanyBankAccounts && <ManualDeposit />}
      {hasWyreService && <WyreDeposit {...props} />}
    </View>
  );
}
function ManualDeposit(props) {
  return (
    <View pt={1}>
      <QuestionTitle id="manual_deposit" />
      <HelpText id="manual_deposit_text" />
      <NumberedList id="manual_deposit_step" length={2} />
      <Info m={0} mv={1} variant="warning" id="manual_deposit_warning" />
    </View>
  );
}

function WyreDeposit(props) {
  return (
    <View pt={1}>
      <QuestionTitle id="wyre_deposit" />
      <HelpText id="wyre_deposit_text" />
      <NumberedList id="wyre_deposit_step" length={5} />
      <Links
        {...props}
        items={[
          {
            id: 'how_do_i_add_a_bank_account',
            tab: 'depositing_money',
            section: 'i_need_help_with_wyre',
          },
        ]}
      />
    </View>
  );
}
