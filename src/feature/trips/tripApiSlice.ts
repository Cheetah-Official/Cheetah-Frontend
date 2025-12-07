import { apiSlice } from "../../app/api/apiSlice";
import { TRIPS } from "../../app/utils/endpoints";

export const tripApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTrips: builder.query({
      query: () => ({
        url: TRIPS.GET_ALL_TRIPS,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Trip'],
    }),
    getTripById: builder.query({
      query: (id: number) => ({
        url: TRIPS.GET_TRIP_BY_ID(id),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: (result, error, id) => [{ type: 'Trip', id }],
    }),
    createTrip: builder.mutation({
      query: (data) => ({
        url: TRIPS.CREATE_TRIP,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ['Trip'],
    }),
    updateTrip: builder.mutation({
      query: ({ id, ...data }) => ({
        url: TRIPS.UPDATE_TRIP(id),
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (result, error, { id }) => [{ type: 'Trip', id }],
    }),
    deleteTrip: builder.mutation({
      query: (id: number) => ({
        url: TRIPS.DELETE_TRIP(id),
        method: "DELETE",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (result, error, id) => [{ type: 'Trip', id }],
    }),
    getTripsByCompany: builder.query({
      query: (companyId: number) => ({
        url: TRIPS.GET_TRIPS_BY_COMPANY(companyId),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Trip'],
    }),
  }),
});

export const {
  useGetAllTripsQuery,
  useGetTripByIdQuery,
  useCreateTripMutation,
  useUpdateTripMutation,
  useDeleteTripMutation,
  useGetTripsByCompanyQuery,
} = tripApiSlice;

