import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import {polylineAPI} from './polylineAPI';
import {sortByProperty} from '../../../utils';

export const fetchPolylines = createAsyncThunk(
  'polylines/fetchAll',
  async () => {
    const res = await polylineAPI.fetchAll();
    // console.log('Polyline [GET ALL] ->', res);
    return res;
  },
);

export const createPolyline = createAsyncThunk(
  'polylines/createOne',
  async (polylineCoords) => {
    const response = await polylineAPI.createOne(polylineCoords);
    console.log('Polyline [CREATE ONE] -> ', response);
    return response;
  },
);

export const deletePolylines = createAsyncThunk(
  'polylines/removeAll',
  async () => {
    const res = await polylineAPI.removeAll();
    console.log('Polyline [DELETE ALL] -> ', res);
    return res;
  },
);

export const deletePolyline = createAsyncThunk(
  'polylines/removeOne',
  async (polylineId) => {
    const res = await polylineAPI.removeOne(polylineId);
    console.log('Polyline [DELETE ONE] -> ', res);
    return res;
  },
);

export const polylinesAdapter = createEntityAdapter({
  selectId: (polyline) => polyline._id,
  sortComparer: (a, b) => sortByProperty(a.createdAt, b.createdAt),
});

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
      state.loading = true;
    });
    builder.addCase(fetchPolylines.fulfilled, (state, action) => {
      polylinesAdapter.upsertMany(state, action.payload);
      state.loading = false;
    });
    builder.addCase(createPolyline.fulfilled, (state, action) => {
      polylinesAdapter.addOne(state, action.payload);
    });
    builder.addCase(deletePolyline.fulfilled, (state, action) => {
      polylinesAdapter.removeOne(state, action.payload);
    });
  },
});

const reducer = slice.reducer;
export default reducer;

// export const {addPolyline, removePolyline, } = slice.actions;

export const {selectAll: selectAllPolylines} = polylinesAdapter.getSelectors(
  (state) => state.polylines,
);