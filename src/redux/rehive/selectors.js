import { createSelector } from 'reselect';

import default_auth from 'config/default/auth.json';
import default_actions from 'config/default/actions.json';
import default_verification from 'config/default/verification.json';
import default_pin from 'config/default/pin.json';
import default_product from 'config/default/product.json';

import default_cards from 'config/default/cards.json';
import default_sliders from 'config/default/sliders.json';
import default_screens from 'config/default/screens.json';
import default_faqs from 'config/default/faqs.json';

import default_accounts from 'config/default/accounts.json';
import default_onboarding from 'config/default/onboarding.json';

import default_design from 'config/default/design.json';
import default_profile from 'config/default/profile.json';
import default_themes from 'config/default/themes.json';
import default_colors from 'config/default/colors.json';
import default_settings from 'config/default/settings.json';
import default_checkout from 'config/default/checkout.json';
import default_pos from 'config/default/pos.json';
import default_menu from 'config/default/menu.json';

import { get, merge, isEmpty } from 'lodash';
import { userStateSelector as rehiveStateSelector } from '@redux/selectors';
import { currentCompanySelector } from 'screens/auth/redux/selectors';

const defaultConfig = {
  auth: default_auth,

  actions: default_actions,
  cards: default_cards,
  pin: default_pin,
  sliders: default_sliders,
  screens: default_screens,
  design: default_design,
  profile: default_profile,
  product: default_product,
  themes: default_themes,
  colors: default_colors,
  settings: default_settings,
  verification: default_verification,
  settings: default_settings,
  checkout: default_checkout,
  pos: default_pos,
  faqs: default_faqs,
};

function mergeConfig(config, key, def = {}) {
  let temp = config?.[key] ?? def;
  return { ...def, ...temp };
}

/* State selectors */
export const companyConfigSelector = createSelector(
  currentCompanySelector,
  currentCompany => get(currentCompany, 'config', defaultConfig),
);

export const configAuthSelector = createSelector(
  companyConfigSelector,
  companyConfig => mergeConfig(companyConfig, 'auth', default_auth),
);

export const configCardsSelector = createSelector(
  companyConfigSelector,
  companyConfig => mergeConfig(companyConfig, 'cards', default_cards),
);

export const configAccountsSelector = createSelector(
  companyConfigSelector,
  companyConfig => mergeConfig(companyConfig, 'accounts', default_accounts),
);

export const configMenuSelector = createSelector(
  companyConfigSelector,
  companyConfig => mergeConfig(companyConfig, 'menu', default_menu),
);

export const configActionsSelector = createSelector(
  companyConfigSelector,
  companyConfig => mergeConfig(companyConfig, 'actions', default_actions),
);

export const configSettingsSelector = createSelector(
  companyConfigSelector,
  companyConfig => mergeConfig(companyConfig, 'settings', default_settings),
);

export const configProductStateSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'product', default_product),
);
export const configProductSelector = createSelector(
  configProductStateSelector,
  configProductState => configProductState,
);
export const configCheckoutSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'checkout', default_checkout),
);
export const configPoSSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'pos', default_pos),
);

export const configPinSelector = createSelector(
  companyConfigSelector,
  companyConfig => mergeConfig(companyConfig, 'pin', default_pin),
);

export const configSlidersSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'sliders', default_sliders),
);

export const configProfileSelector = createSelector(
  companyConfigSelector,
  companyConfig => {
    return mergeConfig(companyConfig, 'profile', default_profile);
  },
);

export const configScreensSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'screens', default_screens),
);

export const configThemesSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'themes', default_themes),
);

export const defaultTheme = get(default_themes, 'default', {});

export const companyConfigThemeSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'theme', defaultTheme), // TODO: look into this
);

export const companyConfigColorsSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'colors', default_colors),
);

export const companyConfigDesignSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'design', default_design),
);

export const configVerificationSelector = createSelector(
  companyConfigSelector,
  companyConfig =>
    mergeConfig(companyConfig, 'verification', default_verification),
);

export const configFAQsSelector = createSelector(
  companyConfigSelector,
  companyConfig => get(companyConfig, 'faqs', default_faqs),
);

export const configOnboardingSelector = createSelector(
  companyConfigSelector,
  companyConfig => merge(default_onboarding, companyConfig?.onboarding ?? {}),
);

/* Other selectors */
// export const configAuthSelector = createSelector(
//   [configAuthStateSelector],
//   configAuthState => {
//     return { ...default_auth, ...configAuthState };
//   }
// );

// export const configVerificationSelector = createSelector(
//   [configVerificationStateSelector],
//   configVerificationState => {
//     return { ...default_verification, ...configVerificationState };
//   }
// );

// export const configPinSelector = createSelector(
//   [configPinStateSelector],
//   configPinState => {
//     return { ...default_pin, ...configPinState };
//   }
// );

export const configSlidesAuthSelector = createSelector(
  configSlidersSelector,
  configSliders => {
    return get(configSliders, 'auth', default_sliders.auth);
  },
);

export const configSlidesPreAuthSelector = createSelector(
  configSlidersSelector,
  configSliders => {
    return get(configSliders, 'preAuth', default_sliders.preAuth);
  },
);
export const configSlidesPostAuthSelector = createSelector(
  configSlidersSelector,
  configSliders => {
    return get(configSliders, 'postAuth', default_sliders.postAuth);
  },
);

export const configScreensWelcomeSelector = createSelector(
  configScreensSelector,
  configScreens => {
    return get(configScreens, 'welcome', default_screens.welcome);
  },
);

export const configCardsHomeSelector = createSelector(
  [configCardsSelector],
  configCards => {
    return {
      ...get(default_cards, 'home', {}),
      ...get(configCards, 'home', {}),

      ...{
        ...get(default_cards, ['home', 'general'], {}),
        ...configCards.general, // TODO: RETHINK
      },
    };
  },
);

export const notificationsSelector = createSelector(
  [configCardsHomeSelector, rehiveStateSelector],
  (configCardsHome, rehiveState) => {
    return {
      general: {
        ...get(default_cards, ['home', 'general'], {}),
        ...configCardsHome.general,
      },
      custom: get(configCardsHome, 'custom', []),
      dismissed: get(rehiveState, 'dismissedCards', []),
    };
  },
);

export const colorsSelector = createSelector(
  [companyConfigThemeSelector, companyConfigColorsSelector],
  (currentTheme, configColors) => {
    const colors = {
      ...default_colors,
      ...configColors,
    };

    return {
      ...colors,
      header: selectColor('header', currentTheme, colors), // TODO: do a map with this?
      headerContrast: selectColor('headerContrast', currentTheme, colors),
      authScreen: selectColor('authScreen', currentTheme, colors),
      authScreenContrast: selectColor(
        'authScreenContrast',
        currentTheme,
        colors,
      ),

      surface: selectColor('surface', currentTheme, colors),
      surfaceInput: selectColor('surfaceInput', currentTheme, colors),
      surfaceCard: selectColor('surfaceCard', currentTheme, colors),
      surfaceRear: selectColor('surfaceRear', currentTheme, colors),
      tabNavigator: selectColor('tabNavigator', currentTheme, colors),
      tabNavigatorInactive: selectColor(
        'tabNavigatorInactive',
        currentTheme,
        colors,
      ),
      tabNavigatorActive: selectColor(
        'tabNavigatorActive',
        currentTheme,
        colors,
      ),
    };
  },
);

const selectColor = (component, theme, colors) => {
  let color = get(theme, component, get(defaultTheme, component, 'black'));

  return colors[color] ? colors[color] : color;
};

const designCompiler = (key, configDesign) => {
  switch (key) {
    case 'buttons':
    case 'popUp':
    case 'cards':
      return {
        ...default_design.general,
        ...default_design[key],
        ...configDesign[key],
      };
    case 'wallets':
    case 'rewards':
    case 'products':
    case 'notifications':
    case 'campaigns':
    case 'orders':
    case 'settings':
      return {
        ...default_design.general,
        ...default_design.cards,
        ...default_design[key],
        ...configDesign[key],
      };
    default:
      return { ...default_design[key], ...configDesign[key] };
  }
};

export const designSelector = createSelector(
  [companyConfigDesignSelector],
  configDesign => {
    let design = { ...default_design };

    Object.keys(design).map(key => {
      return (design[key] = designCompiler(key, configDesign));
    });

    return design;
  },
);
export const userTiersSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items:
        rehiveState.tiers && !isEmpty(rehiveState.tiers)
          ? rehiveState.tiers
          : [],
      loading: rehiveState.tiersLoading,
      error: rehiveState.tiersError,
    };
  },
);

export const userTierSelector = createSelector(
  userTiersSelector,
  userTiersState => {
    const activeTier =
      userTiersState?.items?.length > 0
        ? userTiersState?.items?.find(item => item.active)
        : null;
    return {
      ...userTiersSelector,
      items: activeTier ? [activeTier] : [],
    };
  },
);
