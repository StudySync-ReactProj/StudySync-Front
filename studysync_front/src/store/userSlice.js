import { createSlice } from "@reduxjs/toolkit";

// Attempt to retrieve existing user from browser storage (if exists)
const storedUser = JSON.parse(localStorage.getItem("userInfo"));

const initialState = {
  user: storedUser ? {
    username: storedUser.username,
    email: storedUser.email,
    token: storedUser.token,
  } : null,
  isLoggedIn: !!storedUser,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      // action.payload will now contain { username, email, token }
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      // Clear browser storage on logout
      localStorage.removeItem("userInfo");
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;