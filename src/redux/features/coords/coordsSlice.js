import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

export const coordsAdapter = createEntityAdapter();

const initialState = coordsAdapter.getInitialState({points: []});

export const slice = createSlice({
  name: 'coords',
  initialState,
  reducers: {
    addCoord: coordsAdapter.addOne,
    removeCoord: coordsAdapter.removeOne,
    addPointCoord: (state, action) => {
      state.points = [...state.points, action.payload];
    },
  },
});

const reducer = slice.reducer;
export default reducer;

export const {addCoord, addPointCoord, removeCoord} = slice.actions;

export const {
  selectById: selectCoordById,
  selectIds: selectCoordIds,
  selectEntities: selectCoordEntities,
  selectAll: selectAllCoords,
  selectTotal: selectTotalCoords,
} = coordsAdapter.getSelectors((state) => state.coords);
