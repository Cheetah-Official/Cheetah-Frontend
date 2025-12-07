import { apiSlice } from "../../app/api/apiSlice";
import { RECEIPTS } from "../../app/utils/endpoints";

export const receiptApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReceiptById: builder.query({
      query: (id: number) => ({
        url: RECEIPTS.GET_RECEIPT_BY_ID(id),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: (result, error, id) => [{ type: 'Receipt', id }],
    }),
    getReceiptByTicketId: builder.query({
      query: (id: number) => ({
        url: RECEIPTS.GET_RECEIPT_BY_TICKET_ID(id),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    getReceiptByPaymentId: builder.query({
      query: (id: number) => ({
        url: RECEIPTS.GET_RECEIPT_BY_PAYMENT_ID(id),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    getReceiptsByUser: builder.query({
      query: ({ id, page = 0, size = 10 }) => ({
        url: RECEIPTS.GET_RECEIPTS_BY_USER(id),
        method: "GET",
        params: { page, size },
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Receipt'],
    }),
    getReceiptsByCompany: builder.query({
      query: ({ id, page = 0, size = 10 }) => ({
        url: RECEIPTS.GET_RECEIPTS_BY_COMPANY(id),
        method: "GET",
        params: { page, size },
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Receipt'],
    }),
  }),
});

export const {
  useGetReceiptByIdQuery,
  useGetReceiptByTicketIdQuery,
  useGetReceiptByPaymentIdQuery,
  useGetReceiptsByUserQuery,
  useGetReceiptsByCompanyQuery,
} = receiptApiSlice;

