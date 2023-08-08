import React from 'react';
import { get } from 'lodash';
import { View } from 'components/layout/View';
import AboutContent from '../components/AboutContent';
import { LANDING } from '../config/authMachine';
import Header from 'components/layout/HeaderNew';

export default function AboutPage(props) {
  const { company, current, send } = props;

  function handleBack() {
    const previousState = get(current, ['transitions', 0, 'source', 'key'], '');
    if (previousState) {
      send(previousState);
    } else {
      send(LANDING);
    }
  }

  return (
    <View f={1}>
      <Header handleBack={handleBack} />
      <View scrollView fG={1}>
        <AboutContent company={company} hideDescription />
      </View>
    </View>
  );
}
