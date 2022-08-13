import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isFetching: false,
  error: false,
  errFact: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isFetching = false;
      state.error = false;
    },
    loginFail: (state, action) => {
      state.user = null;
      state.error = true;
      state.errFact = action.payload;
      state.isFetching = false;
    },
    logout: (state) => {
      state.user = null;
      state.isFetching = false;
      state.error = false;
      state.errFact = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      state.isFetching = false;
      state.error = false;
      state.errFact = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFail, logout, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
