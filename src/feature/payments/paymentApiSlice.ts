import { apiSlice } from "../../app/api/apiSlice";
import { PAYMENTS, PAYSTACK } from "../../app/utils/endpoints";

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentById: builder.query({
      query: (id: number) => ({
        url: PAYMENTS.GET_PAYMENT_BY_ID(id),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: (result, error, id) => [{ type: 'Payment', id }],
    }),
    getPaymentsByUser: builder.query({
      query: ({ id, page = 0, size = 15 }) => ({
        url: PAYMENTS.GET_PAYMENTS_BY_USER(id),
        method: "GET",
        params: { page, size },
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Payment'],
    }),
    getPaymentByTransactionRef: builder.query({
      query: (transactionRef: string) => ({
        url: PAYMENTS.GET_PAYMENT_BY_TRANSACTION_REF(transactionRef),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    getPaymentByBooking: builder.query({
      query: (bookingId: number) => ({
        url: PAYMENTS.GET_PAYMENT_BY_BOOKING(bookingId),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    initializePaystackTransaction: builder.mutation({
      query: (data) => ({
        url: PAYSTACK.INITIALIZE_TRANSACTION,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    verifyPaystackTransaction: builder.query({
      query: (reference: string) => ({
        url: PAYSTACK.VERIFY_TRANSACTION(reference),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    handlePaystackCallback: builder.query({
      query: ({ reference, trxref, response }) => ({
        url: PAYSTACK.CALLBACK,
        method: "GET",
        params: { reference, trxref, response },
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
  }),
});

export const {
  useGetPaymentByIdQuery,
  useGetPaymentsByUserQuery,
  useGetPaymentByTransactionRefQuery,
  useGetPaymentByBookingQuery,
  useInitializePaystackTransactionMutation,
  useVerifyPaystackTransactionQuery,
  useHandlePaystackCallbackQuery,
} = paymentApiSlice;

