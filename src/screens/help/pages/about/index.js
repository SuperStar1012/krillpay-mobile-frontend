import React from 'react';
import { View } from 'components';
import Header from 'components/layout/HeaderNew';
import AboutContent from './AboutContent';
import Disclaimer from '../../../auth/components/Disclaimer';
import { useRehiveContext } from 'contexts/RehiveContext';

export default function AboutPage(props) {
  const { navigation } = props;

  const {
    context: { company },
  } = useRehiveContext();
  return (
    <View screen bC={'white'}>
      <Header navigation={navigation} />
      <View scrollView>
        <View ph={1} pv={1.5}>
          <AboutContent company={company} />
        </View>
      </View>

      <Disclaimer title />
    </View>
  );
}
