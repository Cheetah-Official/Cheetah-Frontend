// Auth endpoints
export const AUTH = {
  GET_AUTHENTICATED_USER: "/auth", // GET /auth (same endpoint, different method)
  REGISTER_USER: "/auth", // POST /auth
  LOGIN: "/auth/login", // POST /auth/login
  REFRESH_TOKEN: "/auth/refresh-token", // POST /auth/refresh-token
};

// Trip endpoints
export const TRIPS = {
  GET_ALL_TRIPS: "/trips", // GET /trips
  GET_TRIP_BY_ID: (id: number) => `/trips/${id}`, // GET /trips/{id}
  CREATE_TRIP: "/trips", // POST /trips
  UPDATE_TRIP: (id: number) => `/trips/${id}`, // PUT /trips/{id}
  DELETE_TRIP: (id: number) => `/trips/${id}`, // DELETE /trips/{id}
  GET_TRIPS_BY_COMPANY: (companyId: number) => `/trips/company/${companyId}`, // GET /trips/company/{companyId}
};

// Schedule endpoints
export const SCHEDULES = {
  GET_ALL_SCHEDULES: "/api/schedules", // GET /api/schedules
  GET_SCHEDULE_BY_ID: (id: number) => `/api/schedules/${id}`, // GET /api/schedules/{id}
  CREATE_SCHEDULE: "/api/schedules", // POST /api/schedules
  UPDATE_SCHEDULE: (id: number) => `/api/schedules/${id}`, // PUT /api/schedules/{id}
  DELETE_SCHEDULE: (id: number) => `/api/schedules/${id}`, // DELETE /api/schedules/{id}
  UPDATE_SCHEDULE_STATUS: (id: number, status: string) => `/api/schedules/${id}/status?status=${status}`, // PATCH /api/schedules/{id}/status
  CHECK_SEAT_AVAILABILITY: (id: number, requiredSeats: number) => `/api/schedules/${id}/availability?requiredSeats=${requiredSeats}`, // GET /api/schedules/{id}/availability
  GET_SCHEDULES_BY_TRIP: (tripId: number) => `/api/schedules/trip/${tripId}`, // GET /api/schedules/trip/{tripId}
  GET_SCHEDULES_BY_STATUS: (status: string) => `/api/schedules/status/${status}`, // GET /api/schedules/status/{status}
  GET_PAGINATED_SCHEDULES_BY_STATUS: (companyId: number, status: string) => `/api/schedules/status/${companyId}/${status}/paginate`, // GET /api/schedules/status/{companyId}/{status}/paginate
  SEARCH_SCHEDULES: "/api/schedules/search", // GET /api/schedules/search
  GET_PAGINATED_SCHEDULES: "/api/schedules/paginate", // GET /api/schedules/paginate
};

// Vehicle endpoints
export const VEHICLES = {
  GET_ALL_VEHICLES: "/api/vehicles", // GET /api/vehicles
  GET_VEHICLE_BY_ID: (id: number) => `/api/vehicles/${id}`, // GET /api/vehicles/{id}
  CREATE_VEHICLE: "/api/vehicles", // POST /api/vehicles
  UPDATE_VEHICLE: (id: number) => `/api/vehicles/${id}`, // PUT /api/vehicles/{id}
  DELETE_VEHICLE: (id: number) => `/api/vehicles/${id}`, // DELETE /api/vehicles/{id}
  UPDATE_VEHICLE_STATUS: (id: number, status: string) => `/api/vehicles/${id}/status?status=${status}`, // PATCH /api/vehicles/{id}/status
  GET_VEHICLE_BY_NO: (vehicleNo: string) => `/api/vehicles/no/${vehicleNo}`, // GET /api/vehicles/no/{vehicleNo}
  GET_UNASSIGNED_VEHICLES_BY_TYPE: (companyId: number, vehicleType: string) => `/api/vehicles/list/${companyId}/unassigned-status/${vehicleType}`, // GET /api/vehicles/list/{companyId}/unassigned-status/{vehicleType}
  GET_ASSIGNED_VEHICLES_BY_TYPE: (companyId: number, vehicleType: string) => `/api/vehicles/list/${companyId}/assigned-status/${vehicleType}`, // GET /api/vehicles/list/{companyId}/assigned-status/{vehicleType}
  GET_VEHICLES_BY_COMPANY: (companyId: number) => `/api/vehicles/company/${companyId}`, // GET /api/vehicles/company/{companyId}
  GET_VEHICLES_BY_COMPANY_AND_STATUS: (companyId: number, status: string) => `/api/vehicles/company/${companyId}/status/${status}`, // GET /api/vehicles/company/{companyId}/status/{status}
};

// Booking endpoints
export const BOOKINGS = {
  CREATE_BOOKING: "/api/bookings", // POST /api/bookings
  GET_BOOKING_BY_ID: (id: number) => `/api/bookings/${id}`, // GET /api/bookings/{id}
  GET_BOOKINGS_BY_USER: (userId: number) => `/api/bookings/user/${userId}`, // GET /api/bookings/user/{userId}
  GET_BOOKINGS_BY_USER_AND_STATUS: (userId: number, status: string) => `/api/bookings/user/${userId}/status/${status}`, // GET /api/bookings/user/{userId}/status/{status}
  GET_BOOKINGS_BY_SCHEDULE: (scheduleId: number) => `/api/bookings/schedule/${scheduleId}`, // GET /api/bookings/schedule/{scheduleId}
  GET_BOOKING_BY_REFERENCE: (bookingRef: string) => `/api/bookings/reference/${bookingRef}`, // GET /api/bookings/reference/{bookingRef}
};

// Payment endpoints
export const PAYMENTS = {
  GET_PAYMENT_BY_ID: (id: number) => `/api/payments/${id}`, // GET /api/payments/{id}
  GET_PAYMENTS_BY_USER: (userId: number) => `/api/payments/user/${userId}`, // GET /api/payments/user/{userId}
  GET_PAYMENT_BY_TRANSACTION_REF: (transactionRef: string) => `/api/payments/transaction/${transactionRef}`, // GET /api/payments/transaction/{transactionRef}
  GET_PAYMENT_BY_BOOKING: (bookingId: number) => `/api/payments/booking/${bookingId}`, // GET /api/payments/booking/{bookingId}
};

// Ticket endpoints
export const TICKETS = {
  GENERATE_TICKET: (bookingId: number) => `/api/tickets/generate/${bookingId}`, // POST /api/tickets/generate/{bookingId}
  GET_TICKET_BY_ID: (id: number) => `/api/tickets/${id}`, // GET /api/tickets/{id}
  GET_TICKET_BY_NUMBER: (ticketNumber: string) => `/api/tickets/number/${ticketNumber}`, // GET /api/tickets/number/{ticketNumber}
  GET_TICKET_BY_BOOKING: (bookingId: number) => `/api/tickets/booking/${bookingId}`, // GET /api/tickets/booking/{bookingId}
};

// Receipt endpoints
export const RECEIPTS = {
  GET_RECEIPT_BY_ID: (id: number) => `/${id}`, // GET /{id}
  GET_RECEIPT_BY_TICKET_ID: (id: number) => `/${id}/ticket`, // GET /{id}/ticket
  GET_RECEIPT_BY_PAYMENT_ID: (id: number) => `/${id}/payment`, // GET /{id}/payment
  GET_RECEIPTS_BY_USER: (userId: number) => `/user/${userId}`, // GET /user/{id}
  GET_RECEIPTS_BY_COMPANY: (companyId: number) => `/company/${companyId}`, // GET /company/{id}
};

// Wallet endpoints
export const WALLETS = {
  CREATE_WALLET: (companyId: number) => `/api/v1/wallets/${companyId}`, // POST /api/v1/wallets/{companyId}
  GET_WALLET_BY_ID: (walletId: number) => `/api/v1/wallets/${walletId}`, // GET /api/v1/wallets/{walletId}
  GET_WALLET_BY_COMPANY: (companyId: number) => `/api/v1/wallets/company/${companyId}`, // GET /api/v1/wallets/company/{companyId}
  GET_WALLET_BALANCE: (walletReference: string) => `/api/v1/wallets/${walletReference}/balance`, // GET /api/v1/wallets/{walletReference}/balance
  VERIFY_SUFFICIENT_FUNDS: (walletReference: string, amount: number) => `/api/v1/wallets/${walletReference}/verify-funds?amount=${amount}`, // GET /api/v1/wallets/{walletReference}/verify-funds
  CREDIT_WALLET: (walletReference: string, amount: number) => `/api/v1/wallets/${walletReference}/credit?amount=${amount}`, // POST /api/v1/wallets/{walletReference}/credit
  DEBIT_WALLET: (walletReference: string, amount: number) => `/api/v1/wallets/${walletReference}/debit?amount=${amount}`, // POST /api/v1/wallets/{walletReference}/debit
};

// Paystack endpoints
export const PAYSTACK = {
  INITIALIZE_TRANSACTION: "/api/v1/paystack/initialize", // POST /api/v1/paystack/initialize
  VERIFY_TRANSACTION: (reference: string) => `/api/v1/paystack/verify/${reference}`, // GET /api/v1/paystack/verify/{reference}
  HANDLE_CALLBACK: (reference: string, trxref?: string) => {
    const params = new URLSearchParams();
    params.append('reference', reference);
    if (trxref) params.append('trxref', trxref);
    return `/api/v1/paystack/callback?${params.toString()}`;
  }, // GET /api/v1/paystack/callback
};

// Default endpoint
export const DEFAULT = {
  GET_DEFAULT_RESPONSE: "/default", // GET /default
};