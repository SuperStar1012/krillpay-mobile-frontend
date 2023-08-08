import React from 'react';

import { Card } from 'components';
import ExternalAccountDetails from '../../ExternalAccountDetails';
// import { hasStellarTrustline } from 'utility/stellar';
// import { concatCryptoAccount, concatBankAccount } from 'utility/general';

export default function AccountCard(props) {
  let { item, currency, onPress, trustlineHook, context } = props;
  if (!item) {
    return null;
  }
  // const { crypto } = context;
  // console.log('AccountCard -> crypto', crypto);

  // if (!trustlineHook) {
  //   trustlineHook = trustlineHookLocal;
  // }

  // const type = item?.crypto_type;
  // const isStellar = type === 'stellar';
  // const isTestnet = item.network === 'testnet' ? true : false;

  // const accountText = item.address
  //   ? concatCryptoAccount(item, true, true)[0]
  //   : concatBankAccount(item, false, true);

  // const accountText2 = isStellar
  //   ? concatCryptoAccount(item, true, true)[1]
  //   : '';

  // const queryTrustline = useQuery(
  //   ['publicCompanies'],
  //   getPublicCompanies,
  // );

  // const [loading, setLoading] = useState(true);
  // console.log('AccountCard -> loading', loading);
  // const [hasTrustline, setHasTrustline] = trustlineHook ?? [];
  // console.log('AccountCard -> hasTrustline', hasTrustline);
  // useEffect(() => {
  //   async function testTrustline(address) {
  //     let resp = await hasStellarTrustline(
  //       accountText,
  //       currency?.code,
  //       address,
  //       isTestnet,
  //     );
  //     console.log('testTrustline -> resp', resp);
  //     setHasTrustline(resp);
  //     setLoading(false);
  //   }
  //   if (isStellar && crypto) {
  //     setLoading(true);
  //     setHasTrustline(false);
  //     const assetDetails =
  //       crypto?.[isTestnet ? 'TXLM' : 'XLM']?.assetsDetails?.find(
  //         asset => asset.currency_code === currency.code,
  //       ) ?? {};
  //     console.log('assetDetails', assetDetails);
  //     testTrustline(assetDetails?.address);
  //   } else {
  //     setLoading(false);
  //   }
  // }, [isStellar, accountText, currency?.code, crypto]);

  function handleSelect() {
    onPress(item);
  }
  // return null;

  return (
    <Card
      onPressContent={handleSelect}
      design={{}}
      noPadding
      containerStyle={{ marginHorizontal: 0 }}>
      <ExternalAccountDetails item={item} currency={currency} />
    </Card>
  );
}
