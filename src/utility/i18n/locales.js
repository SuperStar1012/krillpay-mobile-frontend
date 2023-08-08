import common from 'config/locales';
import profile from 'screens/profile/config/locales';
import accounts from 'screens/accounts/config/locales';
import auth from 'screens/auth/config/locales';
import settings from 'screens/settings/config/locales';
import rewards from 'screens/rewards/config/locales';
import products from 'screens/products/config/locales';
import onboarding from 'screens/onboarding/config/locales';
import home from 'screens/home/config/locales';
import pos from 'screens/pos/config/locales';
import help from 'screens/help/config/locales';

// const locales = {
//   common,
//   accounts,
//   auth,
//   profile,
//   settings,
//   products,
//   rewards,
//   onboarding,
//   home,
//   pos,
//   help,
// };

// const localeKeys = Object.keys(locales);

// function mapLocalesToResources(locales) {
//   let resources = {};
//   localeKeys.forEach(ns => {
//     Object.keys(locales?.[ns]).forEach(lang => {
//       if (!resources[lang]) {
//         resources[lang] = {};
//       }
//       resources[lang][ns] = locales?.[ns]?.[lang];
//     });
//   });
//   return resources;
// }

// const resources = mapLocalesToResources(locales);

const resources = {
  en: {
    common: {
      ...(common?.en ?? {}),
      ...(accounts?.en ?? {}),
      ...(auth?.en ?? {}),
      ...(profile?.en ?? {}),
      ...(settings?.en ?? {}),
      ...(products?.en ?? {}),
      ...(rewards?.en ?? {}),
      ...(onboarding?.en ?? {}),
      ...(home?.en ?? {}),
      ...(pos?.en ?? {}),
      ...(help?.en ?? {}),
    },
  },
};

const localeKeys = Object.keys(resources);

const nsKeys = ['common'];

export default resources;
export { nsKeys, localeKeys };
