import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "",
};

const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    updated(state, action) {
      state.value = action.payload;
    },
    clearNote(state) {
      state.value = "";
    },
  },
});

export const { updated, clearNote } = noteSlice.actions;
export default noteSlice.reducer;
