import { configureStore } from "@reduxjs/toolkit";
import noteReducer from "../features/noteTxt/noteTxt-slice";

export const store = configureStore({
  reducer: { note: noteReducer },
});
