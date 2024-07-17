// reducers/userReducer.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    registerUserStart(state) {
      state.loading = true;
      state.error = null;
    },
    registerUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
    },
    registerUserFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    signInStart(state) {
      state.loading = true;
      state.error = null;
    },
    signInSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
    },
    signInFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    signOut(state) {
      state.loading = true;
      state.user = null;
      state.error = null;
    },
    userDetailStart(state) {
      state.loading = true;
      state.error = null;
    },
    userDetailSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
    },
    userDetailFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  registerUserStart,
  registerUserSuccess,
  registerUserFailure,
  signInStart,
  signInSuccess,
  signInFailure,
  signOut,
  userDetailStart,
  userDetailFailure,
  userDetailSuccess,
} = userSlice.actions;

export default userSlice.reducer;
