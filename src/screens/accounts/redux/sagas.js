import {
  all,
  call,
  put,
  takeEvery,
  select,
  throttle,
} from 'redux-saga/effects';
import { uniq, get } from 'lodash';
import { navigate } from 'navigation';

import {
  FETCH_ACCOUNTS_ASYNC,
  LOGOUT_USER,
  FETCH_RATES_ASYNC,
  SET_DISPLAY_CURRENCY,
  FETCH_PAIRS_ASYNC,
  FETCH_DATA_ASYNC,
} from '@redux/actions';
import * as Rehive from 'utility/rehive';

import { currentCompanyServicesSelector } from 'screens/auth/redux/selectors';
import { accountsStateSelector } from './reducer';

function* fetchAccounts() {
  try {
    const services = yield select(currentCompanyServicesSelector);

    // if (services['Conversion Service']) {
    //   yield all([
    //     yield put({
    //       type: FETCH_RATES_ASYNC.pending,
    //     }),
    //     yield put({
    //       type: FETCH_PAIRS_ASYNC.pending,
    //     }),
    //   ]);
    // }
    const response = yield call(Rehive.getAccounts);

    if (response.results) {
      if (services['Conversion Service']) {
        yield all([
          yield put({
            type: FETCH_RATES_ASYNC.pending,
          }),
          yield put({
            type: FETCH_PAIRS_ASYNC.pending,
          }),
        ]);
      }

      yield put({
        type: FETCH_ACCOUNTS_ASYNC.success,
        payload: response.results,
      });
    }
  } catch (error) {
    if (error.status === 401) {
      yield put({
        type: LOGOUT_USER,
      });
      navigate('Public', { screen: 'Auth' });
    }
    yield put({ type: FETCH_ACCOUNTS_ASYNC.error, payload: error.message });
  }
}

function* fetchRates(event) {
  let code = event?.payload?.code ?? ''; //
  try {
    let response = null;
    if (!code) {
      response = yield call(Rehive.getConversionSettings);
      code = response?.data?.display_currency ?? 'USD';
    }

    response = yield call(Rehive.getConversionCurrency, code);
    response = response?.data?.results?.[0];

    yield put({
      type: SET_DISPLAY_CURRENCY,
      payload: response,
    });

    const { accounts } = yield select(accountsStateSelector);

    const currencies = uniq(
      accounts.map(account =>
        account.currencies.map(currency => {
          return 'USD:' + currency.currency.code;
        }),
      ),
    );

    let rates = (code ? 'USD:' + code + ',' : '') + currencies.join();
    response = yield call(Rehive.getConversionRates, rates);

    yield put({
      type: FETCH_RATES_ASYNC.success,
      payload: response.data,
    });
  } catch (error) {
    console.log('TCL: function*fetchRates -> error', error);
    yield put({ type: FETCH_RATES_ASYNC.error, payload: error.message });
  }
}

function* fetchPairs() {
  try {
    let response = null;
    response = yield call(Rehive.getConversionPairs);

    yield put({
      type: FETCH_PAIRS_ASYNC.success,
      payload: response.data.results,
    });
  } catch (error) {
    console.log('TCL: function*fetchPairs -> error', error);
    yield put({ type: FETCH_PAIRS_ASYNC.error, payload: error.message });
  }
}

// function* fetchAccountThrottle() {
//   yield throttle(2000, 'FETCH_ACCOUNTS_ASYNC.pending', fetchAccounts);
// }

export const accountsSagas = all([
  takeEvery(FETCH_ACCOUNTS_ASYNC.pending, fetchAccounts),
  takeEvery(FETCH_RATES_ASYNC.pending, fetchRates),
  takeEvery(FETCH_PAIRS_ASYNC.pending, fetchPairs),
]);
