import { createSlice } from '@reduxjs/toolkit';

let userFromStorage = null;

try {
  const stored = localStorage.getItem('user');
  userFromStorage = stored ? JSON.parse(stored) : null;
} catch (e) {
  console.warn('Error user from localStorage:', e);
}

const tokenFromStorage = localStorage.getItem('token');

const initialState = {
  user: userFromStorage,
  token: tokenFromStorage || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.access;

      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.access);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
