import React from 'react';
import { View } from 'components';
import QuestionTitle from 'screens/help/components/QuestionTitle';
import NumberedList from 'screens/help/components/NumberedList';
import HelpText from 'screens/help/components/HelpText';

export default function NeedHelpWithWyre(props) {
  return (
    <View mh={1.5} pt={1}>
      <QuestionTitle id="how_do_i_add_a_bank_account" />
      <HelpText id="how_do_i_add_a_bank_account_text" />
      <NumberedList id="how_do_i_add_a_bank_account_steps" title length={6} />
    </View>
  );
}
