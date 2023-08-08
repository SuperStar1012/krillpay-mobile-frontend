import React from 'react';
import BasicListPage from 'components/containers/BasicListPage';

import SettingsProviders from './SettingsProviders';
import configs from '../config/pages/index';

export default function SettingsPage(props) {
  const { route } = props;
  const { id } = route?.params ?? {};
  // const { id } = route?.params ?? {};

  const config = configs?.[id];

  return (
    <SettingsProviders>
      <BasicListPage id={id} config={config} {...props} />
    </SettingsProviders>
  );
}
