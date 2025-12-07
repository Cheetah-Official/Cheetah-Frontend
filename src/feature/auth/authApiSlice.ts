import { apiSlice } from "../../app/api/apiSlice";
import { AUTH } from "../../app/utils/endpoints";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuthenticatedUser: builder.query({
      query: () => ({
        url: AUTH.GET_AUTHENTICATED_USER,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: AUTH.REGISTER_USER,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => {
        // Handle different response formats
        // If response is a string (like "saved successfully"), return it as is
        if (typeof response === 'string') {
          return response;
        }
        // If response has a data property, return that, otherwise return the whole response
        return response?.data || response;
      },
    }),
    refreshToken: builder.mutation({
      query: (data) => ({
        url: AUTH.REFRESH_TOKEN,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
  }),
});

export const {
  useGetAuthenticatedUserQuery,
  useRegisterUserMutation,
  useRefreshTokenMutation,
} = authApiSlice;

