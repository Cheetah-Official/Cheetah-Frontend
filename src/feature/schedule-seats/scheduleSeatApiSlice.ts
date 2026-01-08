import { apiSlice } from "../../app/api/apiSlice";
import { SCHEDULE_SEATS } from "../../app/utils/endpoints";

export const scheduleSeatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableSeats: builder.query({
      query: (scheduleId: number) => ({
        url: SCHEDULE_SEATS.GET_AVAILABLE_SEATS(scheduleId),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: (result, error, scheduleId) => [{ type: 'Schedule', id: scheduleId }],
    }),
  }),
});

export const {
  useGetAvailableSeatsQuery,
} = scheduleSeatApiSlice;

