import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "",
};

const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    //update note
    updated(state, action) {
      // immer library allows us to mutate state directly under the hood
      state.value = action.payload;
    },
    clearNote(state) {
      state.value = "";
    },
  },
});

export const { updated, clearNote } = noteSlice.actions;
export default noteSlice.reducer;
