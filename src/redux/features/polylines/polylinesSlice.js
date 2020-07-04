import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import {polylineAPI} from './polylineAPI';

export const fetchPolylines = createAsyncThunk(
  'polylines/fetchAll',
  async () => {
    const res = await polylineAPI.fetchAll();
    console.log('fetch: ', res);
    return res;
  },
);
export const createPolyline = createAsyncThunk(
  'polylines/createOne',
  async (polylineCoords) => {
    const response = await polylineAPI.createOne(polylineCoords);
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
