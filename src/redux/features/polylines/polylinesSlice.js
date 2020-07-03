import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import {coordsAdapter} from '../coords/coordsSlice';
import {polylineAPI} from './polylineAPI';

export const fetchPolylines = createAsyncThunk(
  'polylines/fetchAll',
  async () => {
    const response = await polylineAPI.fetchAll();
    console.log('[FETCH POLYLINES] -> res: ', response);
    return response;
  },
);
export const createPolyline = createAsyncThunk(
  'polylines/createOne',
  async () => {
    const response = await polylineAPI.createOne();
    console.log('[FETCH POLYLINES] -> res: ', response);
    return response;
  },
);

export const polylinesAdapter = createEntityAdapter();

const initialState = polylinesAdapter.getInitialState({});

export const slice = createSlice({
  name: 'polylines',
  initialState,
  reducers: {
    addPolyline: polylinesAdapter.addOne,
    removePolyline: polylinesAdapter.removeOne,
    updatePolyline: polylinesAdapter.updateOne,
  },
});

const reducer = slice.reducer;
export default reducer;

// export const {addPolyline, removePolyline, }

export const {} = polylinesAdapter.getSelectors((state) => state.polylines);
