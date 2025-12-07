import { apiSlice } from "../../app/api/apiSlice";
import { WALLETS } from "../../app/utils/endpoints";

export const walletApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createWallet: builder.mutation({
      query: (companyId: number) => ({
        url: WALLETS.CREATE_WALLET(companyId),
        method: "POST",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ['Wallet'],
    }),
    getWalletById: builder.query({
      query: (walletId: number) => ({
        url: WALLETS.GET_WALLET_BY_ID(walletId),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: (result, error, id) => [{ type: 'Wallet', id }],
    }),
    getWalletByCompany: builder.query({
      query: (companyId: number) => ({
        url: WALLETS.GET_WALLET_BY_COMPANY(companyId),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Wallet'],
    }),
    debitWallet: builder.mutation({
      query: ({ walletReference, amount }) => ({
        url: WALLETS.DEBIT_WALLET(walletReference),
        method: "POST",
        params: { amount },
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ['Wallet'],
    }),
    creditWallet: builder.mutation({
      query: ({ walletReference, amount }) => ({
        url: WALLETS.CREDIT_WALLET(walletReference),
        method: "POST",
        params: { amount },
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ['Wallet'],
    }),
    verifySufficientFunds: builder.query({
      query: ({ walletReference, amount }) => ({
        url: WALLETS.VERIFY_FUNDS(walletReference),
        method: "GET",
        params: { amount },
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    getBalance: builder.query({
      query: (walletReference: string) => ({
        url: WALLETS.GET_BALANCE(walletReference),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
  }),
});

export const {
  useCreateWalletMutation,
  useGetWalletByIdQuery,
  useGetWalletByCompanyQuery,
  useDebitWalletMutation,
  useCreditWalletMutation,
  useVerifySufficientFundsQuery,
  useGetBalanceQuery,
} = walletApiSlice;

