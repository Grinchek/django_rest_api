import { configureStore } from '@reduxjs/toolkit';
import { categoryApi } from '../features/api/categoryApi';
import { authApi } from '../features/api/authApi';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    [categoryApi.reducerPath]: categoryApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(categoryApi.middleware, authApi.middleware),
});
