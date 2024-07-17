import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  programme: [],
};

const programmeSlice = createSlice({
  name: 'programme', // Slice name should be 'programme'
  initialState,
  reducers: {
    createProgrammeStart(state) {
      state.loading = true;
      state.error = null;
    },
    createProgrammeSuccess(state, action) {
      state.loading = false;
      state.programme = [...state.programme, action.payload]; // Push new item to the array immutably
    },
    createProgrammeFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    getProgrammeStart(state) {
      state.loading = true;
      state.error = null;
    },
    getProgrammeSuccess(state, action) {
      state.loading = false;
      state.programme = action.payload; // Set 'programme' state to action payload
    },
    getProgrammeFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  createProgrammeStart,
  createProgrammeSuccess,
  createProgrammeFailure,
  getProgrammeStart,
  getProgrammeSuccess,
  getProgrammeFailure,
} = programmeSlice.actions;

export default programmeSlice.reducer;
