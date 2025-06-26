import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => 'categories/',
      providesTags: ['Category'],
    }),

    createCategory: builder.mutation({ 
      query: (formData) => ({
        url: 'categories/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
} = categoryApi;
