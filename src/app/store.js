import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

export default configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer // This is the reducer from apiSlice.js
	},

	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware) // This is the middleware from apiSlice.js
});
