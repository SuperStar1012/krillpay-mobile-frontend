import React, { useEffect } from 'react';
import { useRehiveContext } from 'contexts/RehiveContext';

import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n';
import { getLocales } from 'utility/rehive';
import { useQuery } from 'react-query';
import { arrayToObject } from 'utility/general';
import { uniq, merge } from 'lodash';
import { localeKeys } from './locales';
import { changeLanguage } from 'i18next';
import { Spinner } from 'components';
// import { I18nManager } from 'react-native';
// import * as Updates from 'expo-updates';

function mapConfigLocales(config) {
  let configLocales = {};
  Object.keys(config).forEach(ns => {
    const temp = config?.[ns]?.locales;
    if (temp) {
      Object.keys(temp).forEach(lang => {
        const resource = temp?.[lang];
        configLocales = merge(configLocales, { [lang]: resource });
      });
    }
  });

  return configLocales;
}
function mapServiceLocales(locale) {
  const keys = Object.keys(locale);
  let serviceLocale = {};
  keys.forEach(key => {
    const temp = locale?.[key];
    serviceLocale = merge(serviceLocale, temp);
  });

  return serviceLocale;
}

function LanguageProvider({ children }) {
  const {
    context: { company, user, init },
    config,
  } = useRehiveContext();

  const { data, isLoading } = useQuery(
    [company?.id, 'locales'],
    () => getLocales(company?.id),
    {
      enabled: !!company?.id,
    },
  );

  const { authConfig } = config;
  const serviceLocalesKeys = (data?.results ?? []).map(item => item?.id);
  const serviceLocales = arrayToObject(data?.results ?? [], 'id');

  const availableLanguages = uniq([...localeKeys, ...serviceLocalesKeys]);

  function updateLanguage(lang) {
    changeLanguage(lang);
  }

  useEffect(() => {
    if (user?.language) updateLanguage(user?.language);
    else if (authConfig?.language) updateLanguage(authConfig?.language);
  }, [user?.language, company?.id, authConfig?.language]);

  useEffect(() => {
    if (!isLoading) {
      const configLocales = mapConfigLocales(config);
      availableLanguages.forEach(lang => {
        const resource = {
          ...(configLocales?.[lang] ?? {}),
          ...mapServiceLocales(serviceLocales?.[lang]?.translation ?? {}),
        };
        i18n.addResourceBundle(lang, 'common', resource, true, true);
      });
    }
  }, [isLoading]);

  if (isLoading) return <Spinner style={{ flex: 1 }} />;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

function DirectionProvider(props) {
  // const { i18n } = useTranslation(['common']);
  // const {
  //   context: { init },
  // } = useRehiveContext();

  // const isLocaleRTL = i18n.dir() === 'rtl';
  // console.log(
  //   '🚀 ~ file: provider.js ~ line 92 ~ DirectionProvider ~ i18n',
  //   isLocaleRTL,
  //   I18nManager.isRTL,
  //   i18n?.language,
  //   i18n?.resolvedLanguage,
  // );

  // function handleSwitch() {
  //   const isLocaleRTL = i18n.dir() === 'rtl';
  //   if (RNI18nManager.isRTL !== isLocaleRTL) {
  //     console.log('🚀 ~ WLL SWTCH');
  //     // RNI18nManager.forceRTL(isLocaleRTL);
  //     // Updates.reloadAsync();
  //   }
  // }

  // useEffect(() => {
  //   // if (init) {
  //   handleSwitch();
  //   // }
  // }, []);

  return props.children;
}

export { LanguageProvider, DirectionProvider };

// console.log('LanguageProvider -> data', data);

// const configLocalesKeys = (data?.results ?? []).map(item => item?.id);
// const configLocales = arrayToObject(data?.results ?? [], 'id');
// console.log('LanguageProvider -> configLocales', configLocales);

// const availableLanguages = uniq([...localeKeys, ...configLocalesKeys]);

// useEffect(() => {
//   Object.keys(config).forEach(ns => {
//     const localTranslations = config?.[ns]?.locales;
//     console.log("LanguageProvider -> localTranslations", localTranslations)
//     const configTranslations = configLocales?.[lang]?.translation;
//     console.log("LanguageProvider -> configTranslations", configTranslations)
//     if (temp) {
//       Object.keys(temp).forEach(lang => {
//         const resource = temp?.[lang];

//         i18n.addResourceBundle(
//           lang,
//           ns.replace('Config', ''),
//           { ...resource, ...() },
//           true,
//           true,
//         );
//       });
//     }
//   });
// }, []);
