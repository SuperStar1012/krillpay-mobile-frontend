export * from '@testing-library/react-native';
import React from 'react';
import { render } from '@testing-library/react-native';

import { colors, design } from './themeData';
import { ThemeContext } from 'utility/config';
import { ThemeProvider } from 'contexts/ThemeContext';

function renderWithProviders(ui, options) {
  return render(
    <ThemeContext.Provider value={{ colors, design }}>
      <ThemeProvider override={{ colors, design }}>{ui}</ThemeProvider>
    </ThemeContext.Provider>,
    options,
  );
}

export { renderWithProviders };

export { renderWithProviders as render };

// function renderWithData(ui, options) {
//   return render(
//     <ThemeContext.Provider value={{ colors: { primary: 'orange' } }}>
//       {ui}
//     </ThemeContext.Provider>,
//     options,
//   );
// }

// export { renderWithData };
