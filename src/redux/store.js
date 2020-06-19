import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import reducers from './reducers';

const middleware = getDefaultMiddleware({
  immutableCheck: false,
  serializableCheck: false,
  think: true,
});

export default configureStore({
  reducer: reducers,
  middleware,
  devTools: false,
});
