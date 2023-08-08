// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';

// import HelpScreen from 'screens/help';
import LandingPage from './landing';
import AboutPage from './about';
import SupportPage from './support';
import HelpCenter from './center';
import FAQs from './faqs';

// const Stack = createStackNavigator();

export default {
  Help: LandingPage,
  About: AboutPage,
  FAQs: FAQs,
  Support: SupportPage,
  HelpCenter,
};

// export default function SettingsNavigator(props) {
//   return (
//     <Stack.Navigator>
//       {Object.keys(Pages).map(key => (
//         <Stack.Screen key={key} name={key} component={Pages?.[key]} />
//       ))}
//     </Stack.Navigator>
//   );
// }
