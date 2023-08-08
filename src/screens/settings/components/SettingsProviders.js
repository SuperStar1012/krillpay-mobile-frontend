import React from 'react';

import { LanguageProvider } from 'contexts/LanguageContext';
import locales from '../config/locales';

import { DataProvider } from 'contexts/DataContext';
import { useRehiveContext } from 'contexts/RehiveContext';
import { cryptoSelector } from '../../../redux/selectors';
import { useSelector } from 'react-redux';

export default function SettingsProviders(props) {
  const { children } = props;
  const {
    config: { settingsConfig, authConfig },
  } = useRehiveContext();
  const crypto = useSelector(cryptoSelector);

  return (
    <DataProvider context={{ settingsConfig, authConfig, crypto }}>
      <LanguageProvider
        localLocales={locales}
        configLocales={settingsConfig?.locales ?? {}}>
        {children}
      </LanguageProvider>
    </DataProvider>
  );
}
