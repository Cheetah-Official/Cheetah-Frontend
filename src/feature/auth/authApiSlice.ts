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
    registerPerson: builder.mutation({
      query: (data) => ({
        url: AUTH.REGISTER_PERSON,
        method: "POST",
        body: {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber || undefined,
        },
      }),
      transformResponse: (response: any) => {
        // Response structure: { success: true, data: { accessToken, refreshToken, ... } }
        return response?.data || response;
      },
    }),
    login: builder.mutation({
      query: (data) => {
        // /auth/login expects JSON { email, password } or { companyName, password } for transport
        const requestConfig = {
          url: AUTH.LOGIN,
          method: "POST" as const,
          body: data.companyName
            ? {
                companyName: data.companyName,
                password: data.password,
              }
            : {
                email: data.email,
                password: data.password,
              },
        };

        console.log("Login request config:", { url: requestConfig.url, body: requestConfig.body });
        return requestConfig;
      },
      transformResponse: (response: any) => {
        console.log("Login transformResponse raw:", response);
        // Handle string responses (sometimes API returns JSON string)
        if (typeof response === 'string') {
          try {
            const parsed = JSON.parse(response);
            console.log("Login transformResponse parsed from string:", parsed);
            return parsed?.data || parsed;
          } catch (e) {
            console.warn("Failed to parse string response:", e);
            return response;
          }
        }
        // Handle object responses - extract data if it exists
        if (response && typeof response === 'object') {
          if (response.data && typeof response.data === 'object') {
            console.log("Login transformResponse extracted data:", response.data);
            return response.data;
          }
        }
        const transformed = response?.data || response;
        console.log("Login transformResponse transformed:", transformed);
        return transformed;
      },
    }),
    registerTransport: builder.mutation({
      query: (data) => ({
        url: AUTH.REGISTER_TRANSPORT,
        method: "POST",
        body: {
          email: data.email,
          password: data.password,
          companyName: data.companyName,
          companyCode: data.companyCode,
          phoneNumber: data.phoneNumber,
          address: data.address,
        },
      }),
      transformResponse: (response: any) => {
        // Response structure: { success: true, data: { accessToken, refreshToken, ... } }
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
  useRegisterPersonMutation,
  useRegisterTransportMutation,
  useLoginMutation,
  useRefreshTokenMutation,
} = authApiSlice;

