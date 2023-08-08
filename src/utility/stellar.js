import StellarSdk from 'stellar-sdk';

export async function hasStellarTrustline(
  address,
  asset_code,
  asset_issuer,
  testnet,
) {
  const server = new StellarSdk.Server(
    'https://horizon' + (testnet ? '-testnet' : '') + '.stellar.org',
  );
  let account = null;
  try {
    if (address) account = await server.loadAccount(address);
  } catch (e) {
    console.log('e', e);
  }
  // const account = null;

  if (!account) {
    return false;
  }
  return (
    account?.balances?.findIndex(
      item =>
        item.asset_type !== 'native' &&
        item.asset_code === asset_code &&
        item.asset_issuer === asset_issuer,
    ) !== -1 ?? false
  );
}
