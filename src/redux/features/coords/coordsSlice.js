import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

export const coordsAdapter = createEntityAdapter();

const initialState = coordsAdapter.getInitialState({points: []});

export const slice = createSlice({
  name: 'coords',
  initialState,
  reducers: {
    addCoord: coordsAdapter.addOne,
    removeCoord: coordsAdapter.removeOne,
    setCoords: coordsAdapter.setAll,
    addPointCoord: (state, action) => {
      state.points = [...state.points, action.payload];
    },
    setPoints: (state, action) => {
      state.points = [...action.payload];
    },
  },
});

const reducer = slice.reducer;
export default reducer;

export const {
  addCoord,
  addPointCoord,
  removeCoord,
  setCoords,
  setPoints,
} = slice.actions;

export const {
  selectById: selectCoordById,
  selectIds: selectCoordIds,
  selectEntities: selectCoordEntities,
  selectAll: selectAllCoords,
  selectTotal: selectTotalCoords,
} = coordsAdapter.getSelectors((state) => state.coords);
