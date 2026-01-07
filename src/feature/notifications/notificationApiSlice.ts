import { apiSlice } from "../../app/api/apiSlice";
import { NOTIFICATIONS } from "../../app/utils/endpoints";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ page = 0, size = 20 }) => ({
        url: NOTIFICATIONS.GET_NOTIFICATIONS(page, size),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Notification'],
    }),
    getUnreadCount: builder.query({
      query: () => ({
        url: NOTIFICATIONS.GET_UNREAD_COUNT,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Notification'],
    }),
    markAsRead: builder.mutation({
      query: (id: number) => ({
        url: NOTIFICATIONS.MARK_AS_READ(id),
        method: "PUT",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ['Notification'],
    }),
    markAllAsRead: builder.mutation({
      query: () => ({
        url: NOTIFICATIONS.MARK_ALL_AS_READ,
        method: "PUT",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ['Notification'],
    }),
    updateFcmToken: builder.mutation({
      query: (fcmToken: string) => ({
        url: NOTIFICATIONS.UPDATE_FCM_TOKEN,
        method: "PUT",
        body: { fcmToken },
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    deleteNotification: builder.mutation({
      query: (id: number) => ({
        url: NOTIFICATIONS.DELETE_NOTIFICATION(id),
        method: "DELETE",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useUpdateFcmTokenMutation,
  useDeleteNotificationMutation,
} = notificationApiSlice;

