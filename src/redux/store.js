import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import rootSaga from './rootSaga';

import rootReducer from './rootReducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'auth',
    'accounts',
    // 'user',
    'crypto',
    'rewards',
    // 'contacts',
    'product',
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware({});

const initialState = {};

export const store = createStore(
  persistedReducer,
  initialState,
  compose(
    applyMiddleware(thunk, sagaMiddleware),
    global.reduxNativeDevTools
      ? global.reduxNativeDevTools(/*options*/)
      : noop => noop,
  ),
);
sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
// persistor.purge();

// + const store = .createStore(rootReducer, compose(middleware))
