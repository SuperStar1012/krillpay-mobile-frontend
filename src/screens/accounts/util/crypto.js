export const addCryptoToAccount = ({ currency, crypto, account }) => {
  currency.account = account.reference;
  currency.account_name = account.name;
  let currencyCode = currency.currency.code;
  if (
    (currencyCode === 'XLM' && crypto.XLM) ||
    (crypto.XLM &&
      crypto.XLM.assets &&
      crypto.XLM.assets.indexOf(currencyCode) !== -1)
  ) {
    currency.crypto = 'XLM';
  } else if (
    (currencyCode === 'TXLM' && crypto.TXLM) ||
    (crypto.TXLM &&
      crypto.TXLM.assets &&
      crypto.TXLM.assets.indexOf(currencyCode) !== -1)
  ) {
    currency.crypto = 'TXLM';
  } else if (
    (currencyCode === 'ETH' && crypto.ETH) ||
    (currencyCode === 'TETH' && crypto.TETH) ||
    (currencyCode === 'XBT' && crypto.XBT) ||
    (currencyCode === 'TXBT' && crypto.TXBT)
  ) {
    currency.crypto = currencyCode;
  } else {
    currency.crypto = '';
  }

  return currency;
};

const cryptoCodes = ['TXLM', 'XLM', 'XBT', 'TXBT', 'BTC', 'ETH'];

export const checkIfCrypto = ({ currency, crypto }) => {
  let currencyCode = currency?.currency?.code ?? currency?.code;
  if ((crypto?.XLM?.assets?.indexOf(currencyCode) ?? -1) !== -1) {
    return 'XLM';
  } else if ((crypto?.TXLM?.assets?.indexOf(currencyCode) ?? -1) !== -1) {
    return 'TXLM';
  } else if (cryptoCodes?.includes(currencyCode)) {
    return currencyCode;
  }
  return '';
};

export function stellarFederation(currency, crypto, isCrypto) {
  let isFederated = false;
  let setUsername = false;

  let federatedAddress = '';
  let address = '';
  let memo = '';
  let federatedAddressLabel = '';

  let isStellar = isCrypto && currency.crypto.match(/TXLM|XLM/);

  if (isCrypto && isStellar) {
    const currentCrypto = crypto?.[currency?.crypto] ?? null;
    if (currentCrypto) {
      const { company, user } = currentCrypto;
      if (company && user) {
        setUsername = user.username ? false : true;
        address = user?.crypto?.public_address;
        memo = user?.crypto?.memo;
        if (company.is_federated) {
          isFederated = true;
          federatedAddress =
            (!setUsername ? user.username : user.memo) +
            '*' +
            company.federation_domain;
          federatedAddressLabel =
            'Stellar' +
            (currency.crypto === 'TXLM' ? ' testnet' : '') +
            ' federated address';
        }
      }
    } else {
      isStellar = false;
    }
  }

  return {
    isFederated,
    isStellar,
    setUsername,
    federatedAddress,
    address,
    federatedAddressLabel,
    memo,
  };
}

export function checkIfStellar({ wallet, wyreCurrency }) {
  const cryptoCode =
    (wyreCurrency?.data ?? wyreCurrency)?.wyre_currency_code_for_deposit ??
    wallet?.crypto;
  return cryptoCode.includes('XLM');
}
