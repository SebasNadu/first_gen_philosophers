import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import userReducer from "./reducers/user";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

export default store;
