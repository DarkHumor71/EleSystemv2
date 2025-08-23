import {configureStore} from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};
const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk), // Add custom middleware like thunk
    devTools: true, // Enable Redux DevTools (default is true)
});

export default store;
