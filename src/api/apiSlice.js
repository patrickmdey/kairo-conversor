import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
	reducerPath: 'api', // The name of the reducer in the store, this is optional and defaults to 'api'
	baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/' }), // The base URL for the API
	endpoints: (builder) => ({
		convertInFile: builder.mutation({
			query: (data) => ({
				url: '',
				method: 'POST',
				body: data,
			})
		})
	})
});

export const { useConvertInFileMutation: useConvertInFile } = apiSlice;
