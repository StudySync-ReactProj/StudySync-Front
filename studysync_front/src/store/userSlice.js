import { createAction, createSlice } from "@reduxjs/toolkit";

const normalizeUser = (payload) => {
  if (!payload) {
    return null;
  }

  return {
    ...payload,
    id: payload.id || payload.userId || payload.user?.id,
    username: payload.username || payload.user?.username,
    email: payload.email || payload.user?.email,
    token: payload.token || payload.user?.token,
  };
};

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("userInfo");
    return stored ? normalizeUser(JSON.parse(stored)) : null;
  } catch (_error) {
    return null;
  }
};

const persistedUser = getStoredUser();

const initialState = {
  user: persistedUser,
  isLoggedIn: Boolean(persistedUser?.token),
};

export const loginUser = createAction("user/loginUser");
export const logoutUser = createAction("user/logoutUser");
export const updateUser = createAction("user/updateUser");

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser, (state, action) => {
        const normalizedUser = normalizeUser(action.payload);
        state.user = normalizedUser;
        state.isLoggedIn = Boolean(normalizedUser?.token);

        if (normalizedUser) {
          localStorage.setItem("userInfo", JSON.stringify(normalizedUser));
          if (normalizedUser.id) {
            localStorage.setItem("userId", String(normalizedUser.id));
          }
        }
      })
      .addCase(updateUser, (state, action) => {
        if (!state.user) {
          return;
        }

        state.user = normalizeUser({ ...state.user, ...action.payload });
        localStorage.setItem("userInfo", JSON.stringify(state.user));
      })
      .addCase(logoutUser, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userId");
      });
  },
});

export default userSlice.reducer;