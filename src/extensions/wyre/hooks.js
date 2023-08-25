import {
  getWyreAccounts,
  getWyreWallets,
  getWyreWallet,
  getWyreCurrency,
  getWyreCurrencies,
} from 'utility/rehive';
import { useQuery } from 'react-query';
import {
  checkWyreKYC,
  checkWyreModeUsers,
  checkWyreService,
} from 'extensions/wyre/util';
import { useRehiveContext } from 'contexts';
import { arrayToObject } from 'utility/general';

export function useWyreAccount() {
  const {
    context: { user, services },
  } = useRehiveContext();

  const isEnabled = checkWyreService(services);

  const { data: wyreAccounts, isLoading: loadingWyreAccounts } = useQuery(
    [user?.id, 'wyre-accounts'],
    getWyreAccounts,
    {
      enabled: isEnabled,
      staleTime: 60000,
    },
  );

  return wyreAccounts?.results?.[0] ?? null;
}

export function useWyreWallet(wallet) {
  const {
    context: { user, services },
  } = useRehiveContext();

  const isEnabled = checkWyreService(services);

  const filters = {
    native_account_reference: wallet?.account,
  };

  const { data: wyreWallets, isLoading: loadingWyreWallets } = useQuery(
    [user?.id, 'wyre-wallets'],
    () => getWyreWallets({ filters }),
    {
      enabled: isEnabled,
    },
  );

  const walletId = wyreWallets?.results?.[0]?.id ?? '';

  const { data: wyreWallet, isLoading: loadingWyreWallet } = useQuery(
    [user?.id, 'wyre-wallets', walletId],
    () => getWyreWallet({ walletId }),
    {
      enabled: isEnabled && !!walletId,
    },
  );

  return wyreWallet;
}

export function useWyreCurrencies() {
  const {
    context: { user, services },
  } = useRehiveContext();

  const isEnabled = checkWyreService(services);
  const { data, isLoading } = useQuery(
    [user?.id, 'wyre-currencies'],
    getWyreCurrencies,
    {
      enabled: isEnabled,
    },
  );
  const wyreCurrencies = arrayToObject(data?.results ?? [], 'code');
  return { data: data?.results ?? [], wyreCurrencies, isLoading };
}

export function useWyreCurrency(wallet) {
  const {
    context: { user, services },
  } = useRehiveContext();

  const isEnabled = checkWyreService(services);
  const currencyCode = wallet?.currency?.code;
  const { data, isLoading } = useQuery(
    [user?.id, 'wyre-currency', currencyCode],
    () => getWyreCurrency({ currencyCode }),
    {
      enabled: isEnabled,
    },
  );
  return { data, isLoading };
}

export function useWyreReceive(wallet) {
  const wyreWallet = useWyreWallet(wallet);
  const { data: wyreCurrency } = useWyreCurrency(wallet);

  const currencyCode = wallet?.currency?.code;
  const receiveAddress =
    wyreWallet?.crypto_deposit_addresses?.[
      wyreCurrency?.wyre_currency_code_for_deposit ?? currencyCode
    ];
  return { receiveAddress, wyreReceiveAddress: receiveAddress, wyreCurrency };
}

export function useWyreUsers() {
  const { services, config } = useRehiveContext();
  return checkWyreModeUsers(services, config);
}

export function useWyreUsersKYC() {
  const { services, config, user } = useRehiveContext();
  return checkWyreKYC(services, config, user);
}
