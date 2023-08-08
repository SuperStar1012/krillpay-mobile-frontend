import { PERSIST_REHYDRATE } from 'redux-persist/es/constants';

import {
  LOGOUT_USER,
  FETCH_REWARDS_ASYNC,
  FETCH_CAMPAIGNS_ASYNC,
} from '@redux/actions';
import _ from 'lodash';
import {
  fetchPaginatedDataPending,
  fetchPaginatedDataSuccess,
  fetchPaginatedDataFail,
  createDefaultPaginatedStore,
} from 'utility/redux';

const dataTypes = ['campaigns', 'rewards'];

const INITIAL_STATE = Object.assign(
  {},
  ..._.map(dataTypes, type => createDefaultPaginatedStore(type)),
);

export default (state = INITIAL_STATE, action) => {
  // console.log('action', action);
  const { type, payload } = action;
  switch (type) {
    case PERSIST_REHYDRATE:
      return action.payload.auth || INITIAL_STATE;

    case FETCH_CAMPAIGNS_ASYNC.pending:
      return fetchPaginatedDataPending(state, payload, 'campaigns');
    case FETCH_CAMPAIGNS_ASYNC.success:
      return fetchPaginatedDataSuccess(state, payload, 'campaigns');
    case FETCH_CAMPAIGNS_ASYNC.error:
      return fetchPaginatedDataFail(state, payload, 'campaigns');

    case FETCH_REWARDS_ASYNC.pending:
      return fetchPaginatedDataPending(state, payload, 'rewards');
    case FETCH_REWARDS_ASYNC.success:
      return fetchPaginatedDataSuccess(state, payload, 'rewards');
    case FETCH_REWARDS_ASYNC.error:
      return fetchPaginatedDataFail(state, payload, 'rewards');

    case LOGOUT_USER:
      return {
        ...INITIAL_STATE,
      };

    default:
      return state;
  }
};
