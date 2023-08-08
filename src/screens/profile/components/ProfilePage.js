import React from 'react';
import BasicListPage from 'components/containers/BasicListPage';

import ProfileProviders from './ProfileProviders';

export default function ProfilePage(props) {
  const { route } = props;
  const { id, config: configs } = route?.params ?? {};

  const config = configs?.config?.[id];

  return (
    <ProfileProviders>
      <BasicListPage {...props} id={id} config={config} />
    </ProfileProviders>
  );
}
