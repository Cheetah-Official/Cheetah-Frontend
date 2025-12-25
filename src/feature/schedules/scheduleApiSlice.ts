import { apiSlice } from "../../app/api/apiSlice";
import { SCHEDULES } from "../../app/utils/endpoints";

export const scheduleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSchedules: builder.query({
      query: () => ({
        url: SCHEDULES.GET_ALL_SCHEDULES,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Schedule'],
    }),
    getScheduleById: builder.query({
      query: (id: number) => ({
        url: SCHEDULES.GET_SCHEDULE_BY_ID(id),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: (result, error, id) => [{ type: 'Schedule', id }],
    }),
    createSchedule: builder.mutation({
      query: (data) => ({
        url: SCHEDULES.CREATE_SCHEDULE,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ['Schedule'],
    }),
    updateSchedule: builder.mutation({
      query: ({ id, ...data }) => ({
        url: SCHEDULES.UPDATE_SCHEDULE(id),
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (result, error, { id }) => [{ type: 'Schedule', id }],
    }),
    deleteSchedule: builder.mutation({
      query: (id: number) => ({
        url: SCHEDULES.DELETE_SCHEDULE(id),
        method: "DELETE",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (result, error, id) => [{ type: 'Schedule', id }],
    }),
    updateScheduleStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: SCHEDULES.UPDATE_SCHEDULE_STATUS(id, status),
        method: "PATCH",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (result, error, { id }) => [{ type: 'Schedule', id }],
    }),
    checkSeatAvailability: builder.query({
      query: ({ id, requiredSeats }) => ({
        url: SCHEDULES.CHECK_SEAT_AVAILABILITY(id, requiredSeats),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    getSchedulesByTripId: builder.query({
      query: ({ tripId, page = 0, size = 20 }) => ({
        url: SCHEDULES.GET_SCHEDULES_BY_TRIP(tripId),
        method: "GET",
        params: { page, size },
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Schedule'],
    }),
    getSchedulesByStatus: builder.query({
      query: (status: string) => ({
        url: SCHEDULES.GET_SCHEDULES_BY_STATUS(status),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Schedule'],
    }),
    getPaginatedSchedulesByStatus: builder.query({
      query: ({ companyId, status, page = 0, size = 20 }) => ({
        url: SCHEDULES.GET_PAGINATED_SCHEDULES_BY_STATUS(companyId, status),
        method: "GET",
        params: { page, size },
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Schedule'],
    }),
    searchSchedules: builder.query({
      query: ({ startDate, endDate }) => ({
        url: SCHEDULES.SEARCH_SCHEDULES,
        method: "GET",
        params: { startDate, endDate },
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Schedule'],
    }),
    getAllSchedulesPaginated: builder.query({
      query: ({ page = 0, size = 50 }) => ({
        url: SCHEDULES.GET_PAGINATED_SCHEDULES,
        method: "GET",
        params: { page, size },
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Schedule'],
    }),
  }),
});

export const {
  useGetAllSchedulesQuery,
  useGetScheduleByIdQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useUpdateScheduleStatusMutation,
  useCheckSeatAvailabilityQuery,
  useGetSchedulesByTripIdQuery,
  useGetSchedulesByStatusQuery,
  useGetPaginatedSchedulesByStatusQuery,
  useSearchSchedulesQuery,
  useGetAllSchedulesPaginatedQuery,
} = scheduleApiSlice;

