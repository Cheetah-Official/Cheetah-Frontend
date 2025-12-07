# API Migration Guide

## Overview
The Cheetah Frontend has been migrated from a custom fetch-based API client to Redux Toolkit Query (RTK Query), following the same pattern used in Web1.

## What Changed

### 1. Dependencies Added
- `@reduxjs/toolkit` - Redux state management
- `react-redux` - React bindings for Redux
- `async-mutex` - For handling token refresh race conditions

### 2. New Structure

#### API Configuration
- `src/app/api/apiSlice.ts` - Base API slice with authentication and token refresh
- `src/app/utils/endpoints.ts` - All API endpoints defined based on Swagger spec
- `src/lib/config.ts` - Updated to match Web1 pattern

#### Redux Store
- `src/app/store.ts` - Redux store configuration
- `src/app/rootReducer.ts` - Root reducer combining all slices
- `src/feature/authentication/authSlice.ts` - Auth state management

#### API Slices (Based on Swagger)
All API slices are located in `src/feature/`:
- `auth/authApiSlice.ts` - Authentication endpoints
- `trips/tripApiSlice.ts` - Trip management
- `schedules/scheduleApiSlice.ts` - Schedule management
- `vehicles/vehicleApiSlice.ts` - Vehicle management
- `bookings/bookingApiSlice.ts` - Booking operations
- `payments/paymentApiSlice.ts` - Payment and Paystack integration
- `wallets/walletApiSlice.ts` - Wallet operations
- `tickets/ticketApiSlice.ts` - Ticket generation
- `receipts/receiptApiSlice.ts` - Receipt retrieval

### 3. Removed Files
- `src/lib/api/client.ts` - Old fetch-based client
- `src/lib/api/endpoints/auth.ts` - Old auth endpoints
- `src/lib/api/endpoints/bookings.ts` - Old booking endpoints
- `src/lib/api/endpoints/payments.ts` - Old payment endpoints

## Migration Pattern

### Before (Old API)
```typescript
import { bookingsApi } from "@/lib/api/endpoints/bookings";
import { useQuery } from "@tanstack/react-query";

const { data } = useQuery({
  queryKey: ["bookings"],
  queryFn: () => bookingsApi.getUserBookings({ limit: 20 }),
});
```

### After (RTK Query)
```typescript
import { useGetBookingsByUserQuery } from "@/feature/bookings/bookingApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/feature/authentication/authSlice";

const user = useSelector(selectCurrentUser);
const { data } = useGetBookingsByUserQuery({
  userId: user?.id,
  page: 0,
  size: 20,
});
```

## Component Updates Needed

The following components need to be updated to use the new RTK Query hooks:

1. **src/lib/useAuth.ts**
   - Replace `authApi` calls with `useGetAuthenticatedUserQuery`
   - Use Redux `useSelector` for auth state

2. **src/app/dashboard/page.tsx**
   - Replace `bookingsApi.getUserBookings` with `useGetBookingsByUserQuery`
   - Replace `bookingsApi.getProviderStatistics` with appropriate hook

3. **src/app/compare/result/page.tsx**
   - Replace `bookingsApi.searchRoutes` with schedule search hooks

4. **src/app/bookings/[schedule_id]/page.tsx**
   - Replace `bookingsApi.getScheduleDetails` with `useGetScheduleByIdQuery`
   - Replace `bookingsApi.createBooking` with `useCreateBookingMutation`

5. **src/app/profile/page.tsx**
   - Replace `authApi.me()` with `useGetAuthenticatedUserQuery`

## Available Hooks

### Auth
- `useGetAuthenticatedUserQuery()` - Get current user
- `useRegisterUserMutation()` - Register new user
- `useRefreshTokenMutation()` - Refresh access token

### Trips
- `useGetAllTripsQuery()` - Get all trips
- `useGetTripByIdQuery(id)` - Get trip by ID
- `useCreateTripMutation()` - Create trip
- `useUpdateTripMutation()` - Update trip
- `useDeleteTripMutation()` - Delete trip
- `useGetTripsByCompanyQuery(companyId)` - Get trips by company

### Schedules
- `useGetAllSchedulesQuery()` - Get all schedules
- `useGetScheduleByIdQuery(id)` - Get schedule by ID
- `useCreateScheduleMutation()` - Create schedule
- `useUpdateScheduleMutation()` - Update schedule
- `useDeleteScheduleMutation()` - Delete schedule
- `useUpdateScheduleStatusMutation()` - Update schedule status
- `useCheckSeatAvailabilityQuery({ id, requiredSeats })` - Check seat availability
- `useGetSchedulesByTripIdQuery({ tripId, page, size })` - Get schedules by trip
- `useGetSchedulesByStatusQuery(status)` - Get schedules by status
- `useSearchSchedulesQuery({ startDate, endDate })` - Search schedules

### Vehicles
- `useGetAllVehiclesQuery()` - Get all vehicles
- `useGetVehicleByIdQuery(id)` - Get vehicle by ID
- `useCreateVehicleMutation()` - Create vehicle
- `useUpdateVehicleMutation()` - Update vehicle
- `useDeleteVehicleMutation()` - Delete vehicle
- `useUpdateVehicleStatusMutation({ id, status })` - Update vehicle status
- `useGetVehiclesByCompanyQuery(companyId)` - Get vehicles by company

### Bookings
- `useCreateBookingMutation()` - Create booking
- `useGetBookingByIdQuery(id)` - Get booking by ID
- `useGetBookingsByUserQuery({ userId, page, size })` - Get user bookings
- `useGetBookingsByUserAndStatusQuery({ userId, status, page, size })` - Get user bookings by status
- `useGetBookingsByScheduleQuery({ scheduleId, page, size })` - Get bookings by schedule
- `useGetBookingByReferenceQuery(bookingRef)` - Get booking by reference

### Payments
- `useGetPaymentByIdQuery(id)` - Get payment by ID
- `useGetPaymentsByUserQuery({ id, page, size })` - Get user payments
- `useGetPaymentByTransactionRefQuery(transactionRef)` - Get payment by transaction ref
- `useGetPaymentByBookingQuery(bookingId)` - Get payment by booking
- `useInitializePaystackTransactionMutation()` - Initialize Paystack payment
- `useVerifyPaystackTransactionQuery(reference)` - Verify Paystack transaction

### Wallets
- `useCreateWalletMutation(companyId)` - Create wallet
- `useGetWalletByIdQuery(walletId)` - Get wallet by ID
- `useGetWalletByCompanyQuery(companyId)` - Get wallet by company
- `useDebitWalletMutation({ walletReference, amount })` - Debit wallet
- `useCreditWalletMutation({ walletReference, amount })` - Credit wallet
- `useVerifySufficientFundsQuery({ walletReference, amount })` - Verify funds
- `useGetBalanceQuery(walletReference)` - Get wallet balance

### Tickets
- `useGenerateTicketMutation(bookingId)` - Generate ticket
- `useGetTicketByIdQuery(id)` - Get ticket by ID
- `useGetTicketByNumberQuery(ticketNumber)` - Get ticket by number
- `useGetTicketByBookingQuery(bookingId)` - Get ticket by booking

### Receipts
- `useGetReceiptByIdQuery(id)` - Get receipt by ID
- `useGetReceiptByTicketIdQuery(id)` - Get receipt by ticket ID
- `useGetReceiptByPaymentIdQuery(id)` - Get receipt by payment ID
- `useGetReceiptsByUserQuery({ id, page, size })` - Get user receipts
- `useGetReceiptsByCompanyQuery({ id, page, size })` - Get company receipts

## Base URL Configuration

The API base URL is configured in `src/lib/config.ts`:
- Default: `https://official-backend-cheetah-production-0cb4.up.railway.app/cheetah`
- Can be overridden with `NEXT_PUBLIC_API_BASE_URL` environment variable
- Local development: `http://localhost:8081/cheetah`

## Authentication

Authentication is handled automatically:
- Access tokens are stored in Redux state and localStorage
- Tokens are automatically added to request headers
- Token refresh is handled automatically on 401 responses
- Logout clears all auth state

## Next Steps

1. Update all components to use RTK Query hooks
2. Remove React Query dependencies if no longer needed
3. Test all API endpoints
4. Update any remaining references to old API client

