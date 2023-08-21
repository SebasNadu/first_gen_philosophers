import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: localStorage.getItem("userId") || null,
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setUserId, setToken } = authSlice.actions;

export default authSlice.reducer;
