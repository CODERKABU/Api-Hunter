import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/postSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
});
