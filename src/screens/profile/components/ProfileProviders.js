import React from 'react';

import { DataProvider } from 'contexts/DataContext';

import { useRehiveContext } from 'contexts/RehiveContext';

export default function ProfileProviders(props) {
  const { children } = props;

  const {
    context,
    config: { verificationConfig, profileConfig },
  } = useRehiveContext();

  return (
    <DataProvider context={{ ...context, verificationConfig, profileConfig }}>
      {children}
    </DataProvider>
  );
}
