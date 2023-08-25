import { all } from 'redux-saga/effects';
import { userSagas } from '@redux/rehive/sagas';
import { authSagas } from 'screens/auth/redux/sagas';
import { accountsSagas } from 'screens/accounts/redux/sagas';
// import { contactsSagas } from 'screens/accounts/redux/ContactsSagas';
import { cryptoSagas } from './crypto/sagas';
import rewardsSagas from 'screens/rewards/redux/sagas';

const sagas = [
  authSagas,
  userSagas,
  accountsSagas,
  // contactsSagas,
  rewardsSagas,
  cryptoSagas,
];

export default function* rootSaga() {
  try {
    yield all(sagas);
  } catch (error) {
    console.log(error);
  }
}
