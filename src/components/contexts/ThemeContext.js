import React, { createContext, useContext } from 'react';
import { useRehiveContext } from 'contexts/RehiveContext';

// import default_design from 'config/default/design.json';
import default_colors from 'config/default/colors.json';
import default_themes from 'config/default/themes.json';
import { Dimensions } from 'react-native';
// import { useToast } from 'contexts/ToastContext';
// import { currentCompanySelector } from 'screens/auth/redux/selectors';
import { profileSelector } from '@redux/rehive/reducer';
import { designSelector, colorsSelector } from '@redux/rehive/selectors';
import { useSelector } from 'react-redux';
import { useToast } from 'contexts/ToastContext';
import defaultConfig from 'config/default';
const SCREEN_WIDTH = Dimensions.get('window').width;

const ThemeContext = createContext();

// export const colorsSelector = (currentTheme = '', configColors) => {
//   const colors = {
//     ...default_colors,
//     ...configColors,
//   };

//   return {
//     ...colors,
//     header: selectColor('header', currentTheme, colors), // TODO: do a map with this?
//     headerContrast: selectColor('headerContrast', currentTheme, colors),
//     authScreen: selectColor('authScreen', currentTheme, colors),
//     authScreenContrast: selectColor('authScreenContrast', currentTheme, colors),

//     surface: selectColor('surface', currentTheme, colors),
//     surfaceInput: selectColor('surfaceInput', currentTheme, colors),
//     surfaceCard: selectColor('surfaceCard', currentTheme, colors),
//     surfaceRear: selectColor('surfaceRear', currentTheme, colors),
//     tabNavigator: selectColor('tabNavigator', currentTheme, colors),
//     tabNavigatorInactive: selectColor(
//       'tabNavigatorInactive',
//       currentTheme,
//       colors,
//     ),
//     tabNavigatorActive: selectColor('tabNavigatorActive', currentTheme, colors),
//   };
// };

export const defaultTheme = default_themes?.default ?? {};
const selectColor = (component, theme, colors) => {
  let color = theme?.[component] ?? defaultTheme?.[component] ?? 'black';

  return colors[color] ? colors[color] : color;
};

function ThemeProvider({ children, override }) {
  // const {
  //   context: { company, user },
  // } = useRehiveContext();

  // const rem = SCREEN_WIDTH > 340 ? 18 : 16;

  const colors = useSelector(colorsSelector);
  // const company = useSelector(currentCompanySelector);
  const design = useSelector(designSelector);
  const profile = useSelector(profileSelector);
  const rem = SCREEN_WIDTH > 340 ? 18 : 16;

  // const colors = colorsSelector('', company?.config?.colors ?? {}); // { ...default_colors, ...() };
  // const design = { ...default_design, ...(company?.config?.design ?? {}) };

  const { showToast } = useToast();

  return (
    <ThemeContext.Provider
      value={override ? override : { colors, design, profile, rem, showToast }}>
      {children}
    </ThemeContext.Provider>
  );
}
function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    return defaultConfig;
    // throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { ThemeContext, ThemeProvider, useTheme };
