import { all, put, take, takeLatest } from 'redux-saga/effects';
import { AUTH_SUCCESS, APP_LOAD_SUCCESS } from './actions';
import {
  FETCH_DATA_ASYNC,
  FETCH_ACCOUNTS_ASYNC,
  FETCH_RATES_ASYNC,
} from '@redux/actions';

function* appLoad(action) {
  const hasConversion =
    action?.payload?.company?.services?.findIndex(
      item => item?.slug === 'conversion_service',
    ) !== -1;
  try {
    yield all([
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'profile' }),
      put({ type: FETCH_ACCOUNTS_ASYNC.pending }),
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'company' }),
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'tiers' }),
      put({
        type: FETCH_DATA_ASYNC.pending,
        payload: 'tier',
      }),
      put({
        type: FETCH_DATA_ASYNC.pending,
        payload: 'companyBankAccounts',
      }),
    ]);
    let accountsLoaded = false;
    let index = 0;

    while (index < 1) {
      const resp = yield take([
        hasConversion
          ? FETCH_RATES_ASYNC.success
          : FETCH_ACCOUNTS_ASYNC.success,
        // FETCH_DATA_ASYNC.success,
      ]);

      // if (resp.type === FETCH_ACCOUNTS_ASYNC.success) {
      //   if (!accountsLoaded) {
      //     accountsLoaded = true;
      //     index++;
      //   }
      // } else {
      index++;
      // }
    }

    yield put({ type: APP_LOAD_SUCCESS });
  } catch (error) {
    console.log(error);
  }
}

export const authSagas = all([takeLatest(AUTH_SUCCESS, appLoad)]);
