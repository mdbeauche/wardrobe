import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import rootReducer from './slices/rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware:
    process.env.NODE_ENV !== 'production'
      ? (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
      : (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});

// hot reload the store state
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./slices/rootReducer', () => {
    // eslint-disable-next-line global-require
    const newRootReducer = require('./slices/rootReducer').default;
    store.replaceReducer(newRootReducer);
  });
}

export type TypedDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
