import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: null,
  isFetching: false,
  isError: false,
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    msgStart: (state) => {
      state.isFetching = true;
    },
    msgSuccess: (state, action) => {
      state.messages = action.payload;
      state.isFetching = false;
    },
    msgFail: (state) => {
      state.isFetching = false;
      state.isError = true;
    },

    msgCreate: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },

    msgDelSuccess: (state, action) => {
      const delIndex = state.messages.findIndex((a) => a.id === action.payload);

      state.messages.splice(delIndex, 1);
    },
  },
});

export const { msgStart, msgSuccess, msgFail, msgDelSuccess, msgCreate } =
  messageSlice.actions;
export default messageSlice.reducer;
