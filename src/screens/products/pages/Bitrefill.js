import React from 'react';
import { View } from 'components';
import BitrefillComp from '../components/Bitrefill';

export default function Bitrefill(props) {
  return (
    <View screen header>
      <BitrefillComp {...props} />
    </View>
  );
}
