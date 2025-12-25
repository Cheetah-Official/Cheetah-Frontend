import { apiSlice } from "../../app/api/apiSlice";
import { DEFAULT } from "../../app/utils/endpoints";

export const defaultApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDefaultResponse: builder.query({
      query: () => ({
        url: DEFAULT.GET_DEFAULT_RESPONSE,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
  }),
});

export const {
  useGetDefaultResponseQuery,
} = defaultApiSlice;


