import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import reducers from './reducers';

const middleware = getDefaultMiddleware({
  immutableCheck: false,
  serializableCheck: false,
  thunk: true,
});

export default configureStore({
  reducer: reducers,
  middleware,
  devTools: false,
});
