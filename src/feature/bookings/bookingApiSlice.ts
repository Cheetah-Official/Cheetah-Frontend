import { apiSlice } from "../../app/api/apiSlice";
import { BOOKINGS } from "../../app/utils/endpoints";

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (data) => ({
        url: BOOKINGS.CREATE_BOOKING,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ['Booking'],
    }),
    getBookingById: builder.query({
      query: (id: number) => ({
        url: BOOKINGS.GET_BOOKING_BY_ID(id),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),
    getBookingsByUser: builder.query({
      query: ({ userId, page = 0, size = 20 }) => ({
        url: BOOKINGS.GET_BOOKINGS_BY_USER(userId),
        method: "GET",
        params: { page, size },
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Booking'],
    }),
    getBookingsByUserAndStatus: builder.query({
      query: ({ userId, status, page = 0, size = 20 }) => ({
        url: BOOKINGS.GET_BOOKINGS_BY_USER_AND_STATUS(userId, status),
        method: "GET",
        params: { page, size },
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Booking'],
    }),
    getBookingsBySchedule: builder.query({
      query: ({ scheduleId, page = 0, size = 20 }) => ({
        url: BOOKINGS.GET_BOOKINGS_BY_SCHEDULE(scheduleId),
        method: "GET",
        params: { page, size },
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Booking'],
    }),
    getBookingByReference: builder.query({
      query: (bookingRef: string) => ({
        url: BOOKINGS.GET_BOOKING_BY_REFERENCE(bookingRef),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingByIdQuery,
  useGetBookingsByUserQuery,
  useGetBookingsByUserAndStatusQuery,
  useGetBookingsByScheduleQuery,
  useGetBookingByReferenceQuery,
} = bookingApiSlice;

