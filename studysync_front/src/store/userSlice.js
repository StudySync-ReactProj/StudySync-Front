import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isLoggedIn: false,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      console.log('LOGIN USER ACTION:', action.payload);
      state.user = action.payload;
      state.isLoggedIn = true;
      state.loading = false;
      console.log('User logged in. New state:', { user: state.user, isLoggedIn: state.isLoggedIn });
    },
    logoutUser: (state) => {
      console.log('LOGOUT USER ACTION');
      state.user = null;
      state.isLoggedIn = false;
      state.loading = false;
      console.log('User logged out. isLoggedIn:', state.isLoggedIn);
    },
    updateUser: (state, action) => {
      console.log('UPDATE USER ACTION:', action.payload);
      state.user = { ...state.user, ...action.payload };
      console.log('User updated. New user:', state.user);
    },
    setLoading: (state, action) => {
      console.log('SET LOADING ACTION:', action.payload);
      state.loading = action.payload;
      console.log('Loading state:', state.loading);
    },
  },
});

export const { loginUser, logoutUser, updateUser, setLoading } = userSlice.actions;

export default userSlice.reducer;
