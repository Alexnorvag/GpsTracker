import {combineReducers} from '@reduxjs/toolkit';
import coordsSlice from '../features/coords/coordsSlice';
import polylinesSlice from '../features//polylines/polylinesSlice';

export default combineReducers({
  coords: coordsSlice,
  polylines: polylinesSlice,
});
