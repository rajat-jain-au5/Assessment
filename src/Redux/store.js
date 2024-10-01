import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./reducers";

const middleware = (getDefaultMiddleware) => {
    return getDefaultMiddleware({
        thunk: true,
    });
};

const store = configureStore({
    reducer: dashboardReducer,
    middleware: (getDefaultMiddleware) => middleware(getDefaultMiddleware),
    devTools: process.env.NODE_ENV !== "production",
})




export default store;