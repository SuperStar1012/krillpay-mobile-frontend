import {
  getStellarAssets,
  getCryptoUser,
  getCryptoCompany,
} from 'utility/rehive';
import { useMemo, useEffect } from 'react';
import { useQueries, useQueryClient } from 'react-query';

function mapCryptoQueries(type, enabled) {
  let tempQueries = [];
  tempQueries.push({
    queryKey: ['crypto', type, 'user'],
    queryFn: () => getCryptoUser(type),
    options: {
      enabled,
      // refetchInterval: 5000,
      // refetchIntervalInBackground: true,
    },
  });

  tempQueries.push({
    queryKey: ['crypto', type, 'company'],
    queryFn: () => getCryptoCompany(type),
    options: {
      enabled,
      // refetchInterval: 5000,
      // refetchIntervalInBackground: true,
    },
  });

  if (type === 'XLM' || type === 'TXLM') {
    tempQueries.push({
      queryKey: ['crypto', type, 'assets'],
      queryFn: () => getStellarAssets(type === 'TXLM'),
      options: {
        enabled,
        // refetchInterval: 5000,
        // refetchIntervalInBackground: true,
      },
    }); //TODO: response.data.map(a => a.currency_code)
  }

  return tempQueries;
}

export function useCrypto({ init, services, user }) {
  let cryptoServices = [];
  if (services['Stellar Service']) cryptoServices.push('XLM');
  if (services['Stellar Testnet Service']) cryptoServices.push('TXLM');
  if (services['Bitcoin Service']) cryptoServices.push('XBT');
  if (services['Ethereum Service']) cryptoServices.push('ETH');
  if (services['Bitcoin Testnet Service']) cryptoServices.push('TXBT');
  if (services['Ethereum Testnet Service']) cryptoServices.push('TETH');

  let cryptoQueryArray = [];
  const queryClient = useQueryClient();

  const enabled = Boolean(init && user?.id);
  function mapper() {
    function mapz(type) {
      cryptoQueryArray = cryptoQueryArray.concat(
        mapCryptoQueries(type),
        enabled,
      );
    }
    cryptoServices.forEach(mapz);

    return cryptoQueryArray;
  }
  useMemo(mapper, [cryptoServices, init]);
  const cryptoQueries = useQueries(enabled ? cryptoQueryArray : []) ?? [];

  useEffect(() => {
    if (init) {
      queryClient.invalidateQueries('crypto');
      refresh();
    }
  }, [init]);
  function refresh() {
    for (let i = 0; i < cryptoQueries.length; i++) {
      cryptoQueries?.[i]?.refetch();
    }
  }
  const tempContext = useMemo(
    () => mapState(cryptoQueries, cryptoQueryArray, cryptoServices),
    [cryptoQueries, cryptoQueryArray, cryptoServices],
  );
  const amountLoaded = Object.keys(tempContext ?? {}).filter(
    key => tempContext?.[key] && key !== 'undefinded',
  )?.length;
  const loading = cryptoServices?.length !== amountLoaded;
  const context = loading ? CRYPTO_INITIAL_STATE : tempContext;

  return { context, refresh, loading };
}

function mapState(queries, queryArray, services) {
  let context = {};
  queryArray.map((item, index) => {
    const code = item?.queryKey?.[1];
    if (code) {
      const key = item?.queryKey?.[2];

      let data = queries?.[index]?.data?.data ?? queries?.[index]?.data ?? {};
      if (key === 'assets' && data?.length > 0)
        data = data.map(item => item?.currency_code);
      context[code] = { ...(context?.[code] ?? {}), [key]: data };
    }
  });
  return context ?? CRYPTO_INITIAL_STATE;
}

export const CRYPTO_INITIAL_STATE = {
  XBT: null,
  TXBT: null,
  ETH: null,
  TETH: null,
  XBT: null,
  TXBT: null,
};

// useEffect(() => {
//   if (init) {
//     fetchData();
//   }
// }, [services, init]);

// const enabledStellar = init&&services['Stellar Service']||services['Stellar Testnet Service'];
// const queryStellar = useQuery(
//   ['accounts', user?.id],
//   async () => getAccounts(),
//   {
//     enabled:  enabledStellar,
//     refetchInterval: 5000,
//     refetchIntervalInBackground: true,
//   },
// );
// const queryStellarCompany = useQuery(
//   ['accounts', user?.id],
//   async () => getAccounts(),
//   {
//     enabled:  enabledStellar,
//     refetchInterval: 5000,
//     refetchIntervalInBackground: true,
//   },
// );
// const queryStellarAssets = useQuery(
//   ['accounts', user?.id],
//   async () => getAccounts(),
//   {
//     enabled:enabledStellar,
//     refetchInterval: 5000,
//     refetchIntervalInBackground: true,
//   },
// );
// const queryBitcoinUser = useQuery(
//   ['accounts', user?.id],
//   async () => getAccounts(),
//   {
//     enabled,
//     refetchInterval: 5000,
//     refetchIntervalInBackground: true,
//   },
// );
// const queryBitcoinCompany = useQuery(
//   ['accounts', user?.id],
//   async () => getAccounts(),
//   {
//     enabled,
//     refetchInterval: 5000,
//     refetchIntervalInBackground: true,
//   },
// );

// async function fetchCrypto(type) {
//   let assets = [];
//   let company = null;
//   try {
//     dispatch({
//       type: FETCH_CRYPTO_ASYNC.pending,
//       payload: { type },
//     });

//     let response = await getCryptoUser(type);
//     if (response.status === 'error' || response instanceof Error) {
//       throw response;
//     }
//     const user = response?.data ?? response;

//     if (type === 'XLM' || type === 'TXLM') {
//       response = await getStellarAssets(type === 'TXLM');
//       if (response.status === 'success') {
//         assets = response.data ? response.data.map(a => a.currency_code) : [];
//       }
//       response = await getStellarCompany(type === 'TXLM');
//       if (response.status === 'success') {
//         company = response.data;
//       }
//     } else if (type === 'XBT' || type === 'TXBT') {
//       response = await getBitcoinCompany(type === 'TXBT');
//       if (response.status === 'success') {
//         company = response.data;
//       }
//     }

//     dispatch({
//       type: FETCH_CRYPTO_ASYNC.success,
//       payload: { type, user, assets, company },
//     });
//   } catch (e) {
//     dispatch({
//       type: FETCH_CRYPTO_ASYNC.error,
//       payload: { type, message: e?.message },
//     });
//   }
// }
