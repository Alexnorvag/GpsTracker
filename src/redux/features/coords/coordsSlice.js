import {
  createSlice,
  // createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';

export const coordsAdapter = createEntityAdapter();

const initialState = coordsAdapter.getInitialState({});

export const slice = createSlice({
  name: 'coords',
  initialState,
  reducers: {
    addCoord: coordsAdapter.addOne,
    removeCoord: coordsAdapter.removeOne,
  },
  // extraReducers: (builder) => {
  // builder.addCase(fetchUsers.pending, (state, action) => {
  //   state.loading = true;
  // });
  // builder.addCase(fetchUsers.fulfilled, (state, action) => {
  // usersAdapter.upsertMany(state, action.payload);
  // state.loading = false;
  // });
  // },
});

const reducer = slice.reducer;
export default reducer;

export const {addCoord, removeCoord} = slice.actions;

export const {
  selectById: selectCoordById,
  selectIds: selectCoordIds,
  selectEntities: selectCoordEntities,
  selectAll: selectAllCoords,
  selectTotal: selectTotalCoords,
} = coordsAdapter.getSelectors((state) => state.coords);
