import { apiSlice } from "../../app/api/apiSlice";
import { ANALYTICS } from "../../app/utils/endpoints";

export const analyticsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDailyAnalytics: builder.query({
      query: ({ companyId, date }) => ({
        url: ANALYTICS.GET_DAILY_ANALYTICS(companyId, date),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Analytics'],
    }),
    getAnalyticsRange: builder.query({
      query: ({ companyId, start, end }) => ({
        url: ANALYTICS.GET_ANALYTICS_RANGE(companyId, start, end),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Analytics'],
    }),
    getPayoutHistory: builder.query({
      query: ({ companyId, page = 0, size = 20 }) => ({
        url: ANALYTICS.GET_PAYOUT_HISTORY(companyId),
        method: "GET",
        params: { page, size },
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Analytics'],
    }),
    generateDailyReport: builder.mutation({
      query: ({ companyId, date }) => ({
        url: ANALYTICS.GENERATE_DAILY_REPORT(companyId, date),
        method: "POST",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ['Analytics'],
    }),
    generateWeeklyReport: builder.mutation({
      query: ({ companyId, weekStart }) => ({
        url: ANALYTICS.GENERATE_WEEKLY_REPORT(companyId, weekStart),
        method: "POST",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ['Analytics'],
    }),
    generateMonthlyReport: builder.mutation({
      query: ({ companyId, year, month }) => ({
        url: ANALYTICS.GENERATE_MONTHLY_REPORT(companyId, year, month),
        method: "POST",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ['Analytics'],
    }),
    generateCustomReport: builder.mutation({
      query: ({ companyId, start, end }) => ({
        url: ANALYTICS.GENERATE_CUSTOM_REPORT(companyId, start, end),
        method: "POST",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ['Analytics'],
    }),
    emailReport: builder.mutation({
      query: ({ reportId, format }) => ({
        url: ANALYTICS.EMAIL_REPORT(reportId, format),
        method: "POST",
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    downloadReportPdf: builder.query({
      query: (reportId: number) => ({
        url: ANALYTICS.DOWNLOAD_REPORT_PDF(reportId),
        method: "GET",
      }),
    }),
    downloadReportExcel: builder.query({
      query: (reportId: number) => ({
        url: ANALYTICS.DOWNLOAD_REPORT_EXCEL(reportId),
        method: "GET",
      }),
    }),
    getPendingPayouts: builder.query({
      query: () => ({
        url: ANALYTICS.GET_PENDING_PAYOUTS,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Analytics'],
    }),
    processPayout: builder.mutation({
      query: (payoutId: number) => ({
        url: ANALYTICS.PROCESS_PAYOUT(payoutId),
        method: "POST",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ['Analytics'],
    }),
    retryPayout: builder.mutation({
      query: (payoutId: number) => ({
        url: ANALYTICS.RETRY_PAYOUT(payoutId),
        method: "POST",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetDailyAnalyticsQuery,
  useGetAnalyticsRangeQuery,
  useGetPayoutHistoryQuery,
  useGenerateDailyReportMutation,
  useGenerateWeeklyReportMutation,
  useGenerateMonthlyReportMutation,
  useGenerateCustomReportMutation,
  useEmailReportMutation,
  useDownloadReportPdfQuery,
  useDownloadReportExcelQuery,
  useGetPendingPayoutsQuery,
  useProcessPayoutMutation,
  useRetryPayoutMutation,
} = analyticsApiSlice;



