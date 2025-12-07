import { apiSlice } from "../../app/api/apiSlice";
import { TICKETS } from "../../app/utils/endpoints";

export const ticketApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateTicket: builder.mutation({
      query: (bookingId: number) => ({
        url: TICKETS.GENERATE_TICKET(bookingId),
        method: "POST",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ['Ticket'],
    }),
    getTicketById: builder.query({
      query: (id: number) => ({
        url: TICKETS.GET_TICKET_BY_ID(id),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: (result, error, id) => [{ type: 'Ticket', id }],
    }),
    getTicketByNumber: builder.query({
      query: (ticketNumber: string) => ({
        url: TICKETS.GET_TICKET_BY_NUMBER(ticketNumber),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    getTicketByBooking: builder.query({
      query: (bookingId: number) => ({
        url: TICKETS.GET_TICKET_BY_BOOKING(bookingId),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
  }),
});

export const {
  useGenerateTicketMutation,
  useGetTicketByIdQuery,
  useGetTicketByNumberQuery,
  useGetTicketByBookingQuery,
} = ticketApiSlice;

