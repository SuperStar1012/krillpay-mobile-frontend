import { all, call, put, takeEvery, take, select } from 'redux-saga/effects';

import {
  FETCH_DATA_ASYNC,
  REFRESH_PROFILE_ASYNC,
  CACHE_COMPANY,
  LOGOUT_USER,
} from '@redux/actions';

// import { userProfileSelector } from '../../profile/redux/selectors';

import * as Rehive from 'utility/rehive';
import {
  authUserSelector,
  currentSessionsSelector,
} from 'screens/auth/redux/selectors';
import { getUserGroup } from 'utility/general';

function* fetchData(action) {
  try {
    let response = null;

    switch (action.payload) {
      case 'mobile':
        response = yield call(Rehive.getMobiles);
        break;
      case 'email':
        response = yield call(Rehive.getEmails);
        break;
      case 'crypto_account':
        response = yield call(Rehive.getCryptoAccounts);
        break;
      case 'bank_account':
        response = yield call(Rehive.getBankAccounts);
        break;
      case 'profile':
        response = [yield call(Rehive.getProfile)];
        break;
      case 'referralCodes':
        response = [yield call(Rehive.getReferralCode)];
        response = Array.isArray(response) ? response[0] : {};
        break;
      case 'address':
        response = yield call(Rehive.getAddresses);
        break;
      case 'document':
        response = yield call(Rehive.getDocuments);
        break;
      case 'company':
        response = yield call(Rehive.getCompany);
        const response2 = yield call(
          Rehive.getCompanyAppConfig,
          response?.id,
          false,
        );
        yield put({
          type: CACHE_COMPANY,
          payload: { ...response, ...(response2?.data ?? {}) },
        });
        break;
      case 'companyBankAccounts':
        response = yield call(Rehive.getCompanyBankAccounts);
        break;
      case 'company_currency':
      case 'companyCurrencies':
        response = yield call(Rehive.getCompanyCurrencies);
        break;
      case 'tier':
        const user = yield select(authUserSelector);
        const tier = getUserGroup(user);
        if (tier) {
          response = yield call(Rehive.getTiers, tier);
        }
        break;
      case 'tiers':
        const { user: user2 } = yield select(currentSessionsSelector);
        const userGroup = getUserGroup(user2);
        if (userGroup) {
          response = yield call(Rehive.getTiers, userGroup);
        }

        break;
      case 'wallet':
        return;
      default:
        console.log('Unhandled fetchData type: ', action.payload);
        return;
    }
    let data = null;
    if (response.data) {
      data = response.data;
    } else {
      data = response;
    }
    if (action.payload === ('emails' || 'mobiles') && data && data.length > 0) {
      const primaryIndex = data.findIndex(item => item.primary === true);
      const primaryItem = data[primaryIndex];
      data[primaryIndex] = data[0];
      data[0] = primaryItem;
    }
    if (data.results) {
      data = data.results;
    }
    yield put({
      type: FETCH_DATA_ASYNC.success,
      payload: { data, prop: action.payload },
    });
  } catch (error) {
    console.log(error);
    if (
      (error && error.status && error.status === 403) ||
      (error.message && error.message === 'Invalid token.')
    ) {
      yield put({
        type: LOGOUT_USER,
      });
    }
    yield put({
      type: FETCH_DATA_ASYNC.error,
      payload: { prop: action.payload, message: error.message },
    });
  }
}

function* refreshProfile() {
  try {
    yield all([
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'profile' }),
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'mobile' }),
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'email' }),
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'address' }),
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'document' }),
      put({ type: FETCH_DATA_ASYNC.pending, payload: 'tier' }),
    ]);
    for (let i = 0; i < 5; i++) {
      yield take(FETCH_DATA_ASYNC.success);
    }
    yield put({ type: REFRESH_PROFILE_ASYNC.success });
  } catch (error) {
    console.log(error);
    yield put({ type: REFRESH_PROFILE_ASYNC.error, payload: error.message });
  }
}
export const userSagas = all([
  takeEvery(FETCH_DATA_ASYNC.pending, fetchData),
  takeEvery(REFRESH_PROFILE_ASYNC.pending, refreshProfile),
]);
