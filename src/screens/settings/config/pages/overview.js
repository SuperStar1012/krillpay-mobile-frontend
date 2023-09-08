import {
  concatBankAccount,
  concatCryptoAccount,
  getCurrencyCode,
} from 'utility/general';

function checkMFA(mfa) {
  if (mfa?.token) {
    return 'token';
  } else if (mfa?.sms) {
    return 'sms';
  } else {
    return '';
  }
}

export default {
  id: 'overview',
  title: 'Settings',
  value: '',
  sections: [
    {
      id: 'externalAccounts',
      subtitle: 'externalAccountsSubtitle',
      condition: props => {
        const { services, settingsConfig = {} } = props;
        const { hideCryptoAccounts, hideBankAccounts } = settingsConfig;
        return !(hideCryptoAccounts && hideBankAccounts);
      },
      children: {
        bankAccounts: {
          // page: 'BankAccounts',
          value: data => {
            const acc =
              data.items.find(acc => acc.status === 'verified') ??
              data.items?.[0];

            return acc ? concatBankAccount(acc) : 'Not yet provided';
          },
          status: data => {
            const acc =
              data.items.find(acc => acc.status === 'verified') ??
              data.items?.[0] ??
              {};

            return acc.status;
          },
          condition: props => !props?.settingsConfig?.hideBankAccounts,
        },
        cryptoAccounts: {
          // page: 'CryptoAccounts',
          value: data => data?.primary?.currency?.code ?? 'None',
          condition: props => !props?.settingsConfig?.hideCryptoAccounts,
          // renderItem: CryptoAccountsOverview,
        },
      },
    },
    {
      id: 'preferences',
      children: {
        displayCurrency: {
          page: 'DisplayCurrency',
          value: data => data?.code ?? 'None',
          condition: props => props?.services?.conversion_service,
        },
        primaryCurrency: {
          page: 'PrimaryCurrency',
          value: data => {
            return getCurrencyCode(data?.primary?.currency) ?? 'None';
          },
          condition: props => !props?.settingsConfig?.hidePrimaryCurrency,
        },
        notifications: {
          page: 'Notifications',
          condition: props => !props?.settingsConfig?.hideNotifications,
        },
        language: {
          page: 'Language',
          condition: context =>
            Object.keys(context?.i18n?.store?.data)?.length > 1,
        },
      },
      condition: props => {
        const { services, settingsConfig = {} } = props;

        const { hidePrimaryCurrency, hideNotifications } = settingsConfig;
        return !(
          hidePrimaryCurrency &&
          hideNotifications &&
          !services?.conversion_service
        );
      },
    },
    {
      id: 'security',
      children: {
        mfa: {
          page: 'MFA',
          status: props => {
            return checkMFA(props?.context?.results?.mfa)
              ? 'enabled'
              : 'disabled';
          },
        },
        localAuth: {
          page: 'LocalAuth',
        },
        password: {
          page: 'Password',
        },
        devices: {
          page: 'Devices',
        },
        accDelete: { page: 'accDelete' },
        logout: {
          page: '',
        },
      },
      condition: props => {
        const { services, settingsConfig = {} } = props;

        const { hidePrimaryCurrency, hideNotifications } = settingsConfig;
        return !(
          hidePrimaryCurrency &&
          hideNotifications &&
          !services?.conversion_service
        );
      },
    },
  ],
};
