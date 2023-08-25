import i18n from 'i18next';
import * as Localization from 'expo-localization';
import { initReactI18next } from 'react-i18next';
import resources from './locales';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: cb => {
    // We will get back a string like "en-US". We return a string like "en" to match our language files.
    cb(Localization.locale.split('-')[0]);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: 'en',
    fallbackLng: 'en',
    resources,
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
