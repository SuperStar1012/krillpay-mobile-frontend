import * as Localisation from 'expo-localization';
import i18n from 'i18n-js';
// import { britishEnglish } from "./enGB";

const britishEnglish = {};

i18n.translations = {
  en: britishEnglish,
  ['en-GB']: britishEnglish,
};

i18n.locale = Localisation.locale;
i18n.fallbacks = true;

// function updateLanguage(){

// }

export default i18n;
