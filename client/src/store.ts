import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

const initialState = {};
const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // thunk is included by default
  devTools: true, // Enable Redux DevTools (default is true)
});

export default store;
