import { all, call, put, takeEvery, select } from 'redux-saga/effects';
import {
  FETCH_CRYPTO_ASYNC,
  CACHE_COMPANY,
  FETCH_CRYPTO,
} from '../../../redux/actions';

import { currentCompanySelector } from 'screens/auth/redux/selectors';
import {
  getCryptoUser,
  getStellarAssets,
  getStellarCompany,
  getBitcoinCompany,
} from 'utility/rehive';

function* fetchCrypto(action) {
  const type = action.payload;
  try {
    let assets = [];
    let company = null;
    let assetsDetails = [];

    let response = yield call(getCryptoUser, type);
    if (response.status === 'error' || response instanceof Error) {
      throw response;
    }
    const user = response.data ? response.data : response;

    if (type === 'XLM' || type === 'TXLM') {
      response = yield call(getStellarAssets, type === 'TXLM');
      if (response.status === 'success') {
        assets = response.data ? response.data.map(a => a.currency_code) : [];
      }
      response = yield call(getStellarCompany, type === 'TXLM');
      if (response.status === 'success') {
        company = response.data;
      }
    } else if (type === 'XBT' || type === 'TXBT') {
      response = yield call(getBitcoinCompany, type === 'TXBT');
      if (response.status === 'success') {
        company = response.data;
      }
    }

    yield put({
      type: FETCH_CRYPTO_ASYNC.success,
      payload: { type, user, assets, company },
    });
  } catch (error) {
    console.log(type, error.message);
    yield put({
      type: FETCH_CRYPTO_ASYNC.error,
      payload: { type, error: error.message },
    });
  }
}

function* checkCryptoServices(event) {
  const { payload: services } = event;
  try {
    let temp = {};

    services.map(service => {
      temp[service.name] = true;
      return { [service.name]: true };
    });

    yield all([
      temp['Stellar Service']
        ? put({ type: FETCH_CRYPTO_ASYNC.pending, payload: 'XLM' })
        : null,
      temp['Stellar Testnet Service']
        ? put({ type: FETCH_CRYPTO_ASYNC.pending, payload: 'TXLM' })
        : null,
      temp['Bitcoin Service']
        ? put({ type: FETCH_CRYPTO_ASYNC.pending, payload: 'XBT' })
        : null,
      temp['Bitcoin Testnet Service']
        ? put({ type: FETCH_CRYPTO_ASYNC.pending, payload: 'TXBT' })
        : null,
      temp['Ethereum Service']
        ? put({ type: FETCH_CRYPTO_ASYNC.pending, payload: 'ETH' })
        : null,
      temp['Ethereum Testnet Service']
        ? put({ type: FETCH_CRYPTO_ASYNC.pending, payload: 'TETH' })
        : null,
    ]);
  } catch (error) {
    console.log(error);
  }
}

export const cryptoSagas = all([
  takeEvery(FETCH_CRYPTO_ASYNC.pending, fetchCrypto),
  takeEvery(FETCH_CRYPTO, checkCryptoServices),
]);
