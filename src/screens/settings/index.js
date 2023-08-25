// import React from 'react';
import Settings from './components/SettingsOverview';

// // import CryptoAccounts from './CryptoAccounts';
import SettingsPage from './components/SettingsPage';

// import { createStackNavigator } from '@react-navigation/stack';
// import { LanguageProvider } from 'contexts/LanguageContext';
import locales from './config/locales';
// import { useRehiveContext } from 'components/contexts/RehiveContext';

const pages = {
  Settings,
  SettingsPage,
  // CryptoAccounts,
};

// const Stack = createStackNavigator();

// export default function SettingsNavigator(props) {
//   const {
//     config: { settingsConfig },
//   } = useRehiveContext();

//   return (
//     <LanguageProvider
//       localLocales={locales}
//       configLocales={settingsConfig?.locales ?? {}}>
//       <Stack.Navigator>
//         {Object.keys(pages).map(key => (
//           <Stack.Screen key={key} name={key} component={pages?.[key]} />
//         ))}
//       </Stack.Navigator>
//     </LanguageProvider>
//   );
// }

// export default {};
export default { pages, locales };
// export { pages, locales };
