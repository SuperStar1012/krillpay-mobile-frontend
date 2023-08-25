import { get } from 'lodash';

function findById(array = [], value = '') {
  return array.find(item => item?.id === value || item === value);
}

export function hideCurrency(action, actionsConfig, currency, profile) {
  const condition = get(actionsConfig, [action, 'condition'], '');
  const hide = get(condition, ['hide'], false);
  const hideCurrency = get(condition, ['hideCurrency'], []);

  const showGroup = get(condition, ['showGroups'], []).includes(
    get(profile, ['groups', 0, 'name'], ''),
  );

  return (
    !showGroup &&
    (hide ||
      hideCurrency.findIndex(code => code === currency?.currency?.code) !== -1)
  );
}

export function hideAction(action, props) {
  const { currency, profile: profileList, actionsConfig } = props;
  const profile = profileList?.data?.[0] ?? profileList;
  const currencyCode = currency?.currency?.code ?? currency?.code ?? '';
  const accountName = currency?.account_name ?? '';
  const groupName = profile?.groups?.[0]?.name ?? '';

  const condition = actionsConfig?.[action]?.condition ?? {};
  if (typeof condition === 'object') {
    let {
      hide = false,
      hideCurrency: hideCurrencies,
      showCurrency: showCurrencies,
      hideAccounts = [],
      showAccounts = [],
      hideGroups = [],
      showGroups = [],
    } = condition;

    let hideAccount = findById(hideAccounts, accountName);
    let hideCurrency = findById(hideCurrencies, currencyCode);
    if (hideAccount) {
      if (typeof hideAccount === 'object' && hideAccount?.currencies) {
        let tempHideCurrency = findById(hideAccount?.currencies, currencyCode);
        if (tempHideCurrency) {
          hideCurrency = tempHideCurrency;
        }
      } else {
        hide = true;
      }
    }
    if (hideCurrency) {
      hide = true;
    }
    let hideGroup = findById(hideGroups, groupName);

    if (hideGroup) {
      hide = true;
    }

    let showAccount = findById(showAccounts, accountName);
    let showCurrency = findById(showCurrencies, currencyCode);
    if (showAccount) {
      if (typeof showAccount === 'object' && showAccount?.currencies) {
        let tempShowCurrency = findById(showAccount?.currencies, currencyCode);
        if (tempShowCurrency) {
          showCurrency = tempShowCurrency;
        }
      } else {
        hide = false;
      }
    }
    if (showCurrency) {
      hide = false;
    }
    let showGroup = findById(showGroups, groupName);
    if (showGroup) {
      hide = false;
    }

    return hide;
  } else {
    return Boolean(condition);
  }
}
