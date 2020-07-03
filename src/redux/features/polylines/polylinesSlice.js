import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import {polylineAPI} from './polylineAPI';

export const fetchPolylines = createAsyncThunk(
  'polylines/fetchAll',
  async (coords) => {
    console.log('coords: ', coords);
    return await polylineAPI.fetchAll();
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

const initialState = polylinesAdapter.getInitialState({loading: false});

export const slice = createSlice({
  name: 'polylines',
  initialState,
  reducers: {
    addPolyline: polylinesAdapter.addOne,
    removePolyline: polylinesAdapter.removeOne,
    updatePolyline: polylinesAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPolylines.pending, (state, action) => {
      // console.log('state: ', action);
    });
  },
});

const reducer = slice.reducer;
export default reducer;

// export const {addPolyline, removePolyline, }

export const {} = polylinesAdapter.getSelectors((state) => state.polylines);
