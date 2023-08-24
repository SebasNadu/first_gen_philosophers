import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import userReducer from "./reducers/user";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "./graphql/queries";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

export default store;
