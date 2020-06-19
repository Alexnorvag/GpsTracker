import {combineReducers} from '@reduxjs/toolkit';
import coordsSlice from '../features/coords/coordsSlice';

export default combineReducers({
  coords: coordsSlice,
});
