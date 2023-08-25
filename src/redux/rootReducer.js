import { combineReducers } from 'redux';
import AuthReducer from 'screens/auth/redux/reducer';
import AccountsReducer from 'screens/accounts/redux/reducer';
import UserReducer from '@redux/rehive/reducer';
import RewardsReducer from 'screens/rewards/redux/reducer';
import CryptoReducer from './crypto/reducer';

let reducers = [];
try {
  reducers = combineReducers({
    auth: AuthReducer,
    accounts: AccountsReducer,
    user: UserReducer,
    rewards: RewardsReducer,
    crypto: CryptoReducer,
  });
} catch (e) {
  console.log('TCL: e', e);
}

export default reducers;
