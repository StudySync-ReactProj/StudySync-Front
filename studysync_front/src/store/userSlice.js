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
      // action.payload should contain { username, email, token, _id or id }
      state.user = {
        ...action.payload,
        // Ensure we have _id stored (backend might send 'id' or '_id')
        _id: action.payload._id || action.payload.id,
      };
      state.isLoggedIn = true;
      
      // Also update localStorage to include _id
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      userInfo._id = action.payload._id || action.payload.id;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    logoutUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      // Clear browser storage on logout
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userId");
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;