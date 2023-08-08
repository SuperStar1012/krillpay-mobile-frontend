import React, { useEffect } from 'react';
import { useRehiveContext } from 'contexts/RehiveContext';

import { I18nextProvider } from 'react-i18next';
import i18n from 'utility/i18n';

function I18nProvider({ children }) {
  const { config } = useRehiveContext();

  useEffect(() => {
    Object.keys(config).forEach(ns => {
      const temp = config?.[ns]?.locales;
      if (temp) {
        Object.keys(temp).forEach(lang => {
          const resource = temp?.[lang];
          i18n.addResourceBundle(
            lang,
            ns.replace('Config', ''),
            resource,
            true,
            true,
          );
        });
      }
    });
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

export { I18nProvider };
