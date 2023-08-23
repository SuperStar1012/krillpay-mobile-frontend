import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import WalletAction from './WalletAction';
import { get } from 'lodash';
import Grid from './Grid';
import { View, PopUpGeneral } from 'components';
import {
  companyBankAccountsSelector,
  userProfileSelector,
} from '@redux/rehive/reducer';
import { conversionPairsSelector } from '../redux/reducer';
import {
  configActionsSelector,
  configAccountsSelector,
} from '@redux/rehive/selectors';
import { useToast } from 'contexts/ToastContext';
import { currentCompanySelector } from 'screens/auth/redux/selectors';
import { useRehive } from 'hooks/rehive';
import { hideAction } from '../util/actions';
import { useRehiveContext } from 'contexts';
import { useWyreCurrencies } from 'extensions/wyre/hooks';
import { checkWyreService } from 'extensions/wyre/util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserCountryFromMSISDN, standardizeString } from 'utility/general';

// export const hideCurrency = (action, actionsConfig, currency, profile) => {
//   const condition = get(actionsConfig, [action, 'condition'], '');
//   const hide = get(condition, ['hide'], false);
//   const hideCurrency = get(condition, ['hideCurrency'], []);
//   const showGroup = get(condition, ['showGroups'], []).includes(
//     get(profile, ['data', 0, 'groups', 0, 'name'], ''),
//   );

//   return (
//     !showGroup &&
//     (hide ||
//       hideCurrency.findIndex(code => code === currency?.currency?.code) !== -1)
//   );
// };

async function getLocalStorage(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error('Error getting item:', error);
  }
}

const actionsConfig = [
  // {
  //   id: 'history',
  //   condition: ({ isHome }) => isHome,
  // },
  // {
  //   id: 'pay',
  //   label: 'Pay',
  //   // condition: ({ actionsConfig, currency }) => {
  //   //   const hide = hideCurrency('topup', actionsConfig, currency);
  //   //   return !hide; // && hasConfig;
  //   // },
  // },
  {
    id: 'deposit',
    condition: ({
      currency,
      companyBankAccounts,
      actionsConfig,
      profile,
      services,
    }) => {
      const hide = hideAction('deposit', { actionsConfig, currency, profile });
      if (hide) {
        return false;
      }
      return (
        (currency &&
          !currency.crypto &&
          companyBankAccounts &&
          companyBankAccounts.items.find(acc =>
            acc.currencies.find(curr => curr.code === currency?.currency?.code),
          )) ||
        (checkWyreService(services) && currency?.currency?.code === 'USD')
      );
      return true;
    },
  },
  {
    id: 'withdraw',
    condition: ({ actionsConfig, currency, profile }) => {
      const hide = hideAction('withdraw', { actionsConfig, currency, profile });
      return !hide;
    },
  },

  {
    id: 'send',
    condition: ({ actionsConfig, currency, profile }) => {
      const hide = hideAction('send', { actionsConfig, currency, profile });
      return !hide;
    },
  },
  {
    id: 'scan',
    condition: ({ actionsConfig, currency, profile }) => {
      const hide = hideAction('send', { actionsConfig, currency, profile });
      const hide2 = hideAction('pay', { actionsConfig, currency, profile });
      return !(hide && hide2);
    },
  },
  {
    id: 'receive',
    condition: ({ actionsConfig, currency, profile }) => {
      const hide = hideAction('receive', { actionsConfig, currency, profile });
      return !hide;
    },
  },
  {
    id: 'request',
    icon: 'attach-money',
    iconSet: 'MaterialIcons',
    label: 'Requests',
    condition: ({ actionsConfig, currency, profile, services }) => {
      if (
        !(
          services['Payment Requests Service (beta)'] ||
          services['Payment Requests Service']
        )
      )
        return false;
      const hide = hideAction('request', { actionsConfig, currency, profile });
      return !hide;
    },
  },

  {
    id: 'transfer',
    condition: ({ currency, currencies, actionsConfig, profile }) => {
      const hide = hideAction('transfer', { actionsConfig, currency, profile });
      if (hide) {
        return false;
      }
      return (
        currency &&
        currencies &&
        currencies.data.filter(
          curr =>
            curr.account !== currency?.account &&
            curr?.currency?.code === currency?.currency?.code,
        ).length > 0
      );
    },
  },

  {
    id: 'prepaid',
    label: 'Add funds',
    condition: ({ actionsConfig, currency, profile }) => {
      const hide = hideAction('prepaid', { actionsConfig, currency, profile });
      const hasConfig = Boolean(
        get(actionsConfig, ['prepaid', 'config', currency?.currency?.code]),
      );
      return !hide && hasConfig;
    },
  },
  {
    id: 'card',
    condition: ({ actionsConfig, currency, services, profile }) => {
      if (
        services['Chipless Card Service (beta)'] ||
        services['Chipless Card Service']
      ) {
        const hide = hideAction('card', { actionsConfig, currency, profile });
        return !hide;
      }
      return false;
    },
  },
  {
    id: 'buy',
    icon: 'money',
    iconSet: 'MaterialIcons',
    condition: ({
      actionsConfig,
      conversionPairs,
      currency,
      currencies,
      services,
      wyreCurrencies,
      profile,
    }) => {
      const hide = hideAction('buy', { actionsConfig, currency, profile });
      if (hide) return !hide;
      if (wyreCurrencies?.[currency?.currency?.code]?.is_crypto) return true;
      if (
        currency?.account === currencies.primaryAccount &&
        services['Conversion Service'] &&
        conversionPairs
      ) {
        return (
          conversionPairs.fromCurrencies.findIndex(
            item => item === currency?.currency?.code,
          ) !== -1
        );
      } else {
        return false;
      }
    },
  },
  {
    id: 'sell',
    icon: 'compare-arrows',
    iconSet: 'MaterialIcons',
    condition: ({
      actionsConfig,
      conversionPairs,
      currency,
      currencies,
      services,
      profile,
    }) => {
      const hide =
        !currency?.crypto ||
        hideAction('sell', { actionsConfig, currency, profile });
      if (hide) return !hide;
      if (
        currency?.account === currencies.primaryAccount &&
        services['Conversion Service'] &&
        conversionPairs
      ) {
        return (
          conversionPairs.fromCurrencies.findIndex(
            item => item === currency?.currency?.code,
          ) !== -1
        );
      } else {
        return false;
      }
    },
  },
  // {
  //   id: 'quick_buy',
  //   condition: ({ services }) => {
  //     return services['Wyre Testnet (beta)'];
  //   },
  // },
  // {
  //   id: 'sell_credit',
  //   condition: ({ profile, currency, actionsConfig }) => {
  //     const hide = hideAction(
  //       'sell_credit',
  //       actionsConfig,
  //       currency,
  //       profile,
  //     );
  //     return !hide;
  //   },
  // },
  // {
  //   id: 'receive_payment',
  //   condition: ({ profile, actionsConfig, currency }) => {
  //     const hide = hideAction('pay', actionsConfig, currency);
  //     if (hide) {
  //       return false;
  //     }
  //     if (
  //       get(profile, ['groups', 0, 'name'], '').match(
  //         /^(merchant|admin|manager)$/,
  //       )
  //     ) {
  //       return true;
  //     }
  //   },
  // },
];

export default function WalletActionList(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const { currency, currencies, isHome, navigation, type } = props;
  const { showToast } = useToast();

  const companyBankAccounts = useSelector(companyBankAccountsSelector);
  const conversionPairs = useSelector(conversionPairsSelector);
  const actionsConfigCompany = useSelector(configActionsSelector);
  const profile = useSelector(userProfileSelector);
  const { services } = useRehiveContext();
  const company = useSelector(currentCompanySelector);
  let { actionVariant: variant } = useSelector(configAccountsSelector);

  const user = profile?.data?.[0];
  const {
    context: { businessServiceSettings },
  } = useRehive(['businessServiceSettings'], true, {
    user,
  });

  //  useEffect(()=>{
  //      //for hide deposit sakes
  //   let actions =  user?.mobile && getUserCountryFromMSISDN(user?.mobile) == 'US'
  //   && currency.currency.code == 'USD' ?
  //   [{"id":"deposit"},{"id":"withdraw"},{"id":"send"},{"id":"more","label":"More"}]
  //   :
  //   [{"id":"send"},{"id":"more","label":"More"},{"id":"receive_payment","label":"Recieve"}];

  //   setWalletActions(actions)

  //   })

  function hideModal() {
    setModalVisible(false);
  }

  function showModal() {
    setModalVisible(true);
  }
  function onButtonPress(action) {
    switch (action) {
      case 'pay':
        navigation.navigate('Pay', { currency });
        break;
      case 'send':
        navigation.navigate('Send', { currency });
        break;
      case 'receive':
        navigation.navigate('Receive', { currency });
        break;
      case 'request':
        navigation.navigate('Request', { currency });
        break;
      case 'withdraw':
        // restrictUSDAccess(user, currency, navigation, 'Withdraw');
        // navigation.navigate('', { currency });
        navigation.navigate('SendNairaNav', {
          screen: 'SendNaira',
          params: { currency },
        });
        break;
      case 'deposit':
        restrictUSDAccess(user, currency, navigation, 'Deposit');
        break;
      case 'scan':
        navigation.navigate('Scan', { currency });
        break;
      case 'history':
        navigation.navigate('Wallets', { currency });
        break;
      case 'transfer':
        navigation.navigate('Transfer', { currency });
        break;
      case 'exchange':
        navigation.navigate('Exchange', { currency });
        break;
      case 'scan_to_pay':
        navigation.navigate('Scan', { qr: true, currency });
        break;
      case 'receive_payment':
        navigation.navigate('ReceivePay', { currency });
        break;
      case 'prepaid':
        navigation.navigate('Prepaid', { currency });
        break;
      case 'card':
        navigation.navigate('ChiplessCard', { currency });
        break;
      case 'sell_credit':
        navigation.navigate('SellCredit', { currency });
        break;
      case 'quick_buy':
        navigation.navigate('QuickBuy', { currency });
      case 'more':
        showModal();
        break;
      case 'buy':
        navigation.navigate('Buy', { currency });
        break;
      case 'sell':
        navigation.navigate('Sell', { currency });
        break;
      default:
        console.log('Error: unknown button type');
    }
    if (action !== 'more') {
      hideModal();
    }
  }

  const restrictUSDAccess = (user, currency, navigation, pagename) => {
    if (
      user?.mobile &&
      getUserCountryFromMSISDN(user?.mobile) == 'US' &&
      currency.currency.code == 'USD'
    ) {
      navigation.navigate(pagename, { currency });
    } else {
      if (
        currency.currency.code == 'USD' &&
        user?.mobile &&
        getUserCountryFromMSISDN(user?.mobile) !== 'US'
      ) {
        console.log(JSON.stringify(currency.currency.code));
        showToast({ variant: 'error', id: 'deposit_us_users_only' });
      } else {
        navigation.navigate(pagename, { currency });
      }
    }
  };
  const { wyreCurrencies } = useWyreCurrencies();

  let buttons = [...actionsConfig];
  buttons = buttons.filter(
    ({ condition }) =>
      !(
        condition &&
        !condition({
          currency,
          wyreCurrencies,
          companyBankAccounts,
          isHome,
          currencies,
          conversionPairs,
          actionsConfig: actionsConfigCompany,
          services,
          profile,
          user,
          businessServiceSettings,
          company,
        })
      ),
  );
  let actions = buttons;
  let moreActions = [];
  const slicePosition = variant === 'text' ? 2 : 3;
  // if (actions.length === 1) {
  //   variant = 'text';
  // }

  if (buttons && buttons.length && buttons.length > 4) {
    actions = buttons
      .slice(0, slicePosition)
      .concat([{ id: 'more', label: variant === 'text' ? '• • •' : 'More' }]);
    moreActions = buttons.slice(slicePosition);
  }

  const styles = {
    viewStyleContainer: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      paddingTop: 8,
      paddingBottom: 24,
      width: '100%',
      justifyContent: actions.length < 4 ? 'space-around' : 'space-between',
    },
    viewStyleText: {
      paddingBottom: 16,
    },
  };

  return (
    <>
      <View
        style={[
          styles.viewStyleContainer,
          variant === 'text'
            ? { paddingVertical: 8 }
            : { paddingHorizontal: 20 },
        ]}>
        {actions.map(item => (
          <WalletAction
            key={item.id}
            id={item.id}
            name={item.icon || item.id}
            iconSet={item.iconSet}
            label={item.label ? item.label : standardizeString(item.id)}
            onPress={() => onButtonPress(item.id)}
            inverted={type === 'wallet'}
            variant={variant}
          />
        ))}

        {!!modalVisible && (
          <PopUpGeneral
            visible={modalVisible}
            onDismiss={() => hideModal()}
            docked>
            <View aI={'center'}>
              <Grid
                spacing={5}
                renderItem={item => (
                  <WalletAction
                    key={item.id}
                    id={item.id}
                    iconSet={item.iconSet}
                    name={item.icon || item.id}
                    label={item.label ? item.label : standardizeString(item.id)}
                    variant={variant}
                    // wide
                    onPress={async () => onButtonPress(item.id)}
                    // inverted={type === 'wallet'}
                  />
                )}
                items={moreActions}
                amountPerRow={variant !== 'text' ? 4 : 1}
              />
            </View>
          </PopUpGeneral>
        )}
      </View>
    </>
  );
}
