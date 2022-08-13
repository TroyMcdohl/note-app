import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isFetching: false,
  error: false,
  errFact: null,
};

const createAuthSlice = createSlice({
  name: "createauth",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    fetchSuccess: (state) => {
      state.isFetching = false;
      state.error = false;
    },
    fetchFail: (state, action) => {
      state.error = true;
      state.errFact = action.payload;
      state.isFetching = false;
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFail } = createAuthSlice.actions;
export default createAuthSlice.reducer;
