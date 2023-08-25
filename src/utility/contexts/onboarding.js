import React, { useState, useEffect } from 'react';
import UserConfig from 'screens/onboarding/config';
import { useRehiveContext } from 'contexts/RehiveContext';
import { useRehive } from 'hooks/rehive';
import { useQuery } from 'react-query';
import { getWyrePaymentMethods } from 'utility/rehive';
import { checkWyreService } from 'extensions/wyre/util';

const OnboardingContext = React.createContext({
  data: {
    userConfig: {},
    userAddresses: [],
    userBankAccounts: [],
    userCryptoAccounts: [],
  },
  state: {
    fetching: false,
  },
  methods: {
    fetch: () => {},
  },
});

function useOnboarding() {
  const [fetchingOnboardingInfo, setFetchingOnboardingInfo] = useState(true);

  const {
    context: { user, init, company, services, tiers, tier },
    config,
    methods: { refreshUser, refreshTier },
  } = useRehiveContext();

  const { context, refresh } = useRehive(
    ['document', 'address', 'bankAccount', 'cryptoAccount'],
    Boolean(user && init),
    { user },
  );
  const { document: docs, address, bankAccount, cryptoAccount } = context;

  const hasWyreService = checkWyreService(services);

  const {
    data: wyrePaymentMethods,
    isLoading: loadingPaymentMethods,
    refetch: refetchPaymentMethods,
  } = useQuery(
    [user?.id, 'wyre-payment-methods'],
    () => getWyrePaymentMethods(),
    {
      enabled: hasWyreService && !!user?.id,
    },
  );

  const documents = docs?.items;
  const userAddresses = address?.items;
  const userBankAccounts = bankAccount?.items;
  const userCryptoAccounts = cryptoAccount?.items;

  const isLoading =
    docs?.loading ||
    address?.loading ||
    bankAccount?.loading ||
    cryptoAccount?.loading ||
    loadingPaymentMethods;

  useEffect(() => {
    if (company) fetchOnboardingInfo();
  }, [company]);

  function fetchOnboardingInfo({ section } = {}) {
    setFetchingOnboardingInfo(true);

    refresh(section);
    refreshUser();
    refreshTier();

    setFetchingOnboardingInfo(false);
  }

  const userConfig = UserConfig({
    user,
    company,
    userAddresses,
    documents,
    config,
    tiers,
    tier,
    services,
    wyrePaymentMethods,
  });

  return {
    data: {
      userConfig,
      userAddresses,
      userBankAccounts,
      userCryptoAccounts,
      documents,
    },
    state: { fetching: fetchingOnboardingInfo },
    isLoading,
    methods: {
      fetch: fetchOnboardingInfo,
      refetchPaymentMethods,
    },
  };
}

export { OnboardingContext, useOnboarding }; //, OnboardingProvider };

// function OnboardingProvider({ children }) {
//   const [fetchingOnboardingInfo, setFetchingOnboardingInfo] = useState();

//   const {
//     context: { user, init, company, tiers },
//     config: { settingsConfig },
//     refresh: { refreshUser },
//   } = useRehiveContext();

//   const { context, refresh } = useRehive(
//     ['document', 'address', 'bankAccount', 'cryptoAccount'],
//     Boolean(user && init),
//     { user },
//   );
//   const { document: docs, address, bankAccount, cryptoAccount } = context;

//   const documents = docs?.items;
//   const userAddresses = address.items;
//   const userBankAccounts = bankAccount?.items;
//   const userCryptoAccounts = cryptoAccount?.items;

//   useEffect(() => {
//     if (company) fetchOnboardingInfo();
//   }, [company]);

//   function fetchOnboardingInfo({ section } = {}) {
//     setFetchingOnboardingInfo(true);

//     refresh(section);
//     refreshUser();

//     setFetchingOnboardingInfo(false);
//   }

//   const userConfig = UserConfig({
//     user,
//     company,
//     userAddresses,
//     documents,
//     settingsConfig,
//     tiers,
//   });
//   console.log('userConfig', userConfig);

//   return (
//     <OnboardingContext.Provider
//       value={{
//         data: {
//           userConfig,
//           userAddresses,
//           userBankAccounts,
//           userCryptoAccounts,
//         },
//         state: { fetching: fetchingOnboardingInfo },
//         methods: {
//           fetch: fetchOnboardingInfo,
//         },
//       }}>
//       {children}
//     </OnboardingContext.Provider>
//   );
// }
