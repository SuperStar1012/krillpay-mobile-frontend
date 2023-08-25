import { createAsyncTypes } from 'utility/redux';

export const FETCH_CRYPTO_ASYNC = createAsyncTypes('fetch_crypto');
export const fetchCrypto = type => {
  return { type: FETCH_CRYPTO_ASYNC.pending, payload: type };
};

export const FETCH_CRYPTO = 'fetch_crypto';
export const fetchAllCrypto = services => {
  return { type: FETCH_CRYPTO, payload: services };
};
