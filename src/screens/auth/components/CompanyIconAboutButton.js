import React from 'react';
import { View } from 'components';
import Logo from 'components/outputs/Logo';

export default function CompanyIconAboutButton(props) {
  const { company, onAbout } = props;
  return (
    <View style={{ paddingTop: 14, paddingRight: 18 }}>
      <Logo height={20} width={20} company={company} onAbout={onAbout} />
    </View>
  );
}
