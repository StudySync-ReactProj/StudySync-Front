import { createAction, createSlice } from "@reduxjs/toolkit";

const normalizeUser = (payload) => {
  if (!payload) {
    return null;
  }

  // Build the normalized user object
  const normalized = {
    ...payload,
    id: payload.id || payload._id || payload.userId || payload.user?.id,
    username: payload.username || payload.user?.username,
    email: payload.email || payload.user?.email,
    token: payload.token || payload.user?.token,
  };
  
  console.log('Frontend normalizing user payload:');
  console.log('  - Input has id?', !!payload.id, 'value:', payload.id);
  console.log('  - Input has _id?', !!payload._id, 'value:', payload._id);
  console.log('  - Normalized id:', normalized.id, '(type:', typeof normalized.id + ')');
  
  return normalized;
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
          console.log('Redux: storing user to localStorage:', {
            id: normalizedUser.id,
            email: normalizedUser.email,
            hasToken: !!normalizedUser.token
          });
          localStorage.setItem("userInfo", JSON.stringify(normalizedUser));
          if (normalizedUser.id) {
            console.log('Redux: storing userId to localStorage:', normalizedUser.id);
            localStorage.setItem("userId", String(normalizedUser.id));
          } else {
            console.error('Redux: ❌ normalizedUser.id is undefined! Cannot store to localStorage');
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