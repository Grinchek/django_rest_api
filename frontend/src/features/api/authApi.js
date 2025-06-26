// src/features/api/authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/' }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: 'register/',
        method: 'POST',
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: 'token/',
        method: 'POST',
        body: credentials,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `categories/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});
export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useDeleteCategoryMutation, // ← новий
} = authApi;
