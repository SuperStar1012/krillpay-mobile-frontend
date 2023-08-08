import { all, call, put, takeEvery, select } from 'redux-saga/effects';

import { FETCH_REWARDS_ASYNC, FETCH_CAMPAIGNS_ASYNC } from './actions';

import { LOGOUT_USER } from 'screens/auth/redux/actions';
import { campaignsNextSelector, rewardsNextSelector } from './selectors';
import { getNext, getCampaigns, getRewards } from 'utility/rehive';

function* fetchCampaigns(action) {
  try {
    const { payload } = action;
    let response = null;
    if (payload === 'next') {
      const next = yield select(campaignsNextSelector);
      response = yield call(getNext, next);
    } else {
      response = yield call(getCampaigns, '?available=true');
    }

    if ((response && response.status === 'error') || !response.data) {
      yield put({
        type: FETCH_CAMPAIGNS_ASYNC.error,
        payload: response.message,
      });
    } else {
      yield put({
        type: FETCH_CAMPAIGNS_ASYNC.success,
        payload: response.data,
      });
    }
  } catch (error) {
    console.log('TCL: function*fetchCampaigns -> error', error);
    if (
      error &&
      error.status &&
      (error.status === 403 || error.status === 401)
    ) {
      yield put({
        type: LOGOUT_USER,
      });
    }
    yield put({
      type: FETCH_CAMPAIGNS_ASYNC.error,
      payload: error.message,
    });
  }
}

function* fetchRewards(action) {
  try {
    const { payload } = action;
    let response = null;
    let ref_response = null;

    if (payload === 'next') {
      const next = yield select(rewardsNextSelector);
      response = yield call(getNext, next);
    } else {
      response = yield call(getRewards);
    }

    if ((response && response.status === 'error') || !response.data) {
      if (
        response &&
        response.status &&
        (response.status === 403 ||
          response.status === 401 ||
          response.message === 'Invalid token.')
      ) {
        yield put({
          type: LOGOUT_USER,
        });
      }
      yield put({
        type: FETCH_REWARDS_ASYNC.error,
        payload: response.message,
      });
    } else {
      yield put({
        type: FETCH_REWARDS_ASYNC.success,
        payload: response.data,
      });
    }
  } catch (error) {
    console.log('TCL: function*fetchRewards -> error', error);
    if (
      error &&
      error.status &&
      (error.status === 403 || error.status === 401)
    ) {
      yield put({
        type: LOGOUT_USER,
      });
    }
    yield put({
      type: FETCH_REWARDS_ASYNC.error,
      payload: error.message,
    });
  }
}

const rewardsSagas = all([
  takeEvery(FETCH_CAMPAIGNS_ASYNC.pending, fetchCampaigns),
  takeEvery(FETCH_REWARDS_ASYNC.pending, fetchRewards),
]);

export default rewardsSagas;
