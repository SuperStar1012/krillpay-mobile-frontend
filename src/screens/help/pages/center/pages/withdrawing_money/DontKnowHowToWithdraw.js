import React from 'react';
import { View } from 'components';
import QuestionTitle from 'screens/help/components/QuestionTitle';
import NumberedList from 'screens/help/components/NumberedList';
import HelpText from 'screens/help/components/HelpText';
import Links from 'screens/help/components/Links';

export default function DontKnowHowToWithdraw(props) {
  const { context } = props;

  const { companyBankAccounts, services } = context;
  const hasWyreService = true; // checkWyreService(services)
  const hasCompanyBankAccounts = companyBankAccounts?.items?.length > 0;

  return (
    <View mh={1.5}>
      {hasCompanyBankAccounts && <ManualWithdraw />}
      {hasWyreService && <WyreWithdraw {...props} />}
    </View>
  );
}
function ManualWithdraw(props) {
  return (
    <View pt={1}>
      <QuestionTitle id="manual_withdraw" />
      <HelpText id="manual_withdraw_text" />
    </View>
  );
}

function WyreWithdraw(props) {
  return (
    <View pt={1}>
      <QuestionTitle id="wyre_withdraw" />
      <HelpText id="wyre_withdraw_text" />
      <NumberedList id="wyre_withdraw_step" length={3} />
      <HelpText id="wyre_withdraw_post" />
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
