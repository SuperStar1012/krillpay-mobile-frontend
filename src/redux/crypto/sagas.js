import { all, call, put, takeEvery, select } from 'redux-saga/effects';
import { FETCH_CRYPTO_ASYNC, CACHE_COMPANY } from '@redux/actions';

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
        assetsDetails = response.data ? response.data : [];
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
      payload: { type, user, assets, company, assetsDetails },
    });
  } catch (error) {
    console.log(type, error.message);
    yield put({
      type: FETCH_CRYPTO_ASYNC.error,
      payload: { type, error: error.message },
    });
  }
}

function* checkCryptoServices() {
  try {
    const { services } = yield select(currentCompanySelector);
    let temp = {};

    services.map(service => {
      temp[service.slug] = true;
      return { [service.slug]: true };
    });

    yield all([
      temp?.stellar_service
        ? put({ type: FETCH_CRYPTO_ASYNC.pending, payload: 'XLM' })
        : null,
      temp?.stellar_testnet_service
        ? put({ type: FETCH_CRYPTO_ASYNC.pending, payload: 'TXLM' })
        : null,
      temp?.bitcoin_service
        ? put({ type: FETCH_CRYPTO_ASYNC.pending, payload: 'XBT' })
        : null,
      temp?.bitcoin_testnet_service
        ? put({ type: FETCH_CRYPTO_ASYNC.pending, payload: 'TXBT' })
        : null,
      temp?.ethereum_service
        ? put({ type: FETCH_CRYPTO_ASYNC.pending, payload: 'ETH' })
        : null,
      temp?.ethereum_testnet_service
        ? put({ type: FETCH_CRYPTO_ASYNC.pending, payload: 'TETH' })
        : null,
    ]);
  } catch (error) {
    console.log(error);
  }
}

export const cryptoSagas = all([
  takeEvery(FETCH_CRYPTO_ASYNC.pending, fetchCrypto),
  takeEvery(CACHE_COMPANY, checkCryptoServices),
]);
