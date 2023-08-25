import React from 'react';

import { ThemeProvider } from 'contexts/ThemeContext';
import { ThemeContext } from 'utility/config';
import { colorsSelector, designSelector } from '@redux/rehive/selectors';
import { profileSelector } from '@redux/rehive/reducer';
import { useSelector } from 'react-redux';

import { Dimensions } from 'react-native';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Providers({ businessColors, children, localAuth }) {
  const rem = SCREEN_WIDTH > 340 ? 18 : 16;

  const colors = { ...useSelector(colorsSelector), ...businessColors };
  const design = useSelector(designSelector);
  const profile = useSelector(profileSelector);

  return (
    <ThemeContext.Provider value={{ colors, design, profile, rem }}>
      <ThemeProvider override={(colors, design)}></ThemeProvider>
    </ThemeContext.Provider>
  );
}
