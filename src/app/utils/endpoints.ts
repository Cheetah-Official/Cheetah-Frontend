// Auth endpoints
export const AUTH = {
  GET_AUTHENTICATED_USER: "/auth", // GET /auth
  REGISTER_USER: "/auth", // POST /auth
  LOGIN: "/auth/login", // POST /auth/login
  REFRESH_TOKEN: "/auth/refresh-token", // POST /auth/refresh-token
  VERIFY_EMAIL: (email: string, token: string) => `/auth/verify-email?email=${email}&token=${token}`, // GET /auth/verify-email
  RESEND_VERIFICATION: (email: string) => `/auth/resend-verification?email=${email}`, // POST /auth/resend-verification
  REGISTER_TRANSPORT: "/auth/transport/register", // POST /auth/transport/register
  REGISTER_PERSON: "/auth/person/register", // POST /auth/person/register
  REGISTER_ADMIN: "/auth/admin/register", // POST /auth/admin/register
  SOCIAL_LOGIN: "/auth/social", // POST /auth/social
  SOCIAL_LOGIN_LINKEDIN: "/auth/social/linkedin", // POST /auth/social/linkedin
  SOCIAL_LOGIN_GOOGLE: "/auth/social/google", // POST /auth/social/google
  SOCIAL_PROVIDERS: "/auth/social/providers", // GET /auth/social/providers
  SOCIAL_CALLBACK_LINKEDIN: (code: string, state?: string, frontendRedirect?: string) => {
    const params = new URLSearchParams();
    params.append('code', code);
    if (state) params.append('state', state);
    if (frontendRedirect) params.append('frontendRedirect', frontendRedirect);
    return `/auth/social/callback/linkedin?${params.toString()}`;
  }, // GET /auth/social/callback/linkedin
  SOCIAL_CALLBACK_GOOGLE: (code: string, state?: string, frontendRedirect?: string) => {
    const params = new URLSearchParams();
    params.append('code', code);
    if (state) params.append('state', state);
    if (frontendRedirect) params.append('frontendRedirect', frontendRedirect);
    return `/auth/social/callback/google?${params.toString()}`;
  }, // GET /auth/social/callback/google
  SOCIAL_AUTHORIZE: (provider: string, redirectUri: string, state?: string) => {
    const params = new URLSearchParams();
    params.append('redirectUri', redirectUri);
    if (state) params.append('state', state);
    return `/auth/social/authorize/${provider}?${params.toString()}`;
  }, // GET /auth/social/authorize/{provider}
};

// Sessions endpoints
export const SESSIONS = {
  GET_ACTIVE_SESSIONS: "/auth/sessions", // GET /auth/sessions
  TERMINATE_ALL_OTHER_SESSIONS: "/auth/sessions", // DELETE /auth/sessions
  TERMINATE_SESSION: (sessionId: number) => `/auth/sessions/${sessionId}`, // DELETE /auth/sessions/{sessionId}
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

// Trip Stops endpoints
export const TRIP_STOPS = {
  GET_STOPS: (tripId: number) => `/api/v1/trips/${tripId}/stops`, // GET /api/v1/trips/{tripId}/stops
  CREATE_STOP: (tripId: number) => `/api/v1/trips/${tripId}/stops`, // POST /api/v1/trips/{tripId}/stops
  UPDATE_STOP: (tripId: number, stopId: number) => `/api/v1/trips/${tripId}/stops/${stopId}`, // PUT /api/v1/trips/{tripId}/stops/{stopId}
  DELETE_STOP: (tripId: number, stopId: number) => `/api/v1/trips/${tripId}/stops/${stopId}`, // DELETE /api/v1/trips/{tripId}/stops/{stopId}
  REORDER_STOPS: (tripId: number) => `/api/v1/trips/${tripId}/stops/reorder`, // PUT /api/v1/trips/{tripId}/stops/reorder
};

// Trip Templates endpoints
export const TRIP_TEMPLATES = {
  CREATE_TEMPLATE: "/api/v1/trip-templates", // POST /api/v1/trip-templates
  GET_TEMPLATE: (id: number) => `/api/v1/trip-templates/${id}`, // GET /api/v1/trip-templates/{id}
  UPDATE_TEMPLATE: (id: number) => `/api/v1/trip-templates/${id}`, // PUT /api/v1/trip-templates/{id}
  DELETE_TEMPLATE: (id: number) => `/api/v1/trip-templates/${id}`, // DELETE /api/v1/trip-templates/{id}
  TOGGLE_STATUS: (id: number, active: boolean) => `/api/v1/trip-templates/${id}/toggle?active=${active}`, // PATCH /api/v1/trip-templates/{id}/toggle
  GET_TEMPLATES_BY_TRIP: (tripId: number, page?: number, size?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const query = params.toString();
    return `/api/v1/trip-templates/trip/${tripId}${query ? `?${query}` : ''}`;
  }, // GET /api/v1/trip-templates/trip/{tripId}
  GET_ACTIVE_TEMPLATES: "/api/v1/trip-templates/active", // GET /api/v1/trip-templates/active
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
  GET_SCHEDULES_BY_TRIP: (tripId: number, page?: number, size?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const query = params.toString();
    return `/api/schedules/trip/${tripId}${query ? `?${query}` : ''}`;
  }, // GET /api/schedules/trip/{tripId}
  GET_SCHEDULES_BY_STATUS: (status: string) => `/api/schedules/status/${status}`, // GET /api/schedules/status/{status}
  GET_PAGINATED_SCHEDULES_BY_STATUS: (companyId: number, status: string, page?: number, size?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const query = params.toString();
    return `/api/schedules/status/${companyId}/${status}/paginate${query ? `?${query}` : ''}`;
  }, // GET /api/schedules/status/{companyId}/{status}/paginate
  SEARCH_SCHEDULES: (startDate: string, endDate: string) => `/api/schedules/search?startDate=${startDate}&endDate=${endDate}`, // GET /api/schedules/search
  GET_PAGINATED_SCHEDULES: (page?: number, size?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const query = params.toString();
    return `/api/schedules/paginate${query ? `?${query}` : ''}`;
  }, // GET /api/schedules/paginate
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
  GET_VEHICLES_BY_COMPANY_AND_STATUS: (companyId: number, status: string, page?: number, size?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const query = params.toString();
    return `/api/vehicles/company/${companyId}/status/${status}${query ? `?${query}` : ''}`;
  }, // GET /api/vehicles/company/{companyId}/status/{status}
};

// Booking endpoints
export const BOOKINGS = {
  CREATE_BOOKING: "/api/bookings", // POST /api/bookings
  GET_BOOKING_BY_ID: (id: number) => `/api/bookings/${id}`, // GET /api/bookings/{id}
  GET_BOOKINGS_BY_USER: (userId: number, page?: number, size?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const query = params.toString();
    return `/api/bookings/user/${userId}${query ? `?${query}` : ''}`;
  }, // GET /api/bookings/user/{userId}
  GET_BOOKINGS_BY_USER_AND_STATUS: (userId: number, status: string, page?: number, size?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const query = params.toString();
    return `/api/bookings/user/${userId}/status/${status}${query ? `?${query}` : ''}`;
  }, // GET /api/bookings/user/{userId}/status/{status}
  GET_BOOKINGS_BY_SCHEDULE: (scheduleId: number, page?: number, size?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const query = params.toString();
    return `/api/bookings/schedule/${scheduleId}${query ? `?${query}` : ''}`;
  }, // GET /api/bookings/schedule/{scheduleId}
  GET_BOOKING_BY_REFERENCE: (bookingRef: string) => `/api/bookings/reference/${bookingRef}`, // GET /api/bookings/reference/{bookingRef}
};

// Payment endpoints
export const PAYMENTS = {
  GET_PAYMENT_BY_ID: (id: number) => `/api/payments/${id}`, // GET /api/payments/{id}
  GET_PAYMENTS_BY_USER: (userId: number, page?: number, size?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const query = params.toString();
    return `/api/payments/user/${userId}${query ? `?${query}` : ''}`;
  }, // GET /api/payments/user/{userId}
  GET_PAYMENT_BY_TRANSACTION_REF: (transactionRef: string) => `/api/payments/transaction/${transactionRef}`, // GET /api/payments/transaction/{transactionRef}
  GET_PAYMENT_BY_BOOKING: (bookingId: number) => `/api/payments/booking/${bookingId}`, // GET /api/payments/booking/{bookingId}
};

// Ticket endpoints
export const TICKETS = {
  GENERATE_TICKET: (bookingId: number) => `/api/v1/tickets/generate/${bookingId}`, // POST /api/v1/tickets/generate/{bookingId}
  GET_TICKET_BY_ID: (id: number) => `/api/v1/tickets/${id}`, // GET /api/v1/tickets/{id}
  GET_TICKET_PDF: (id: number) => `/api/v1/tickets/${id}/pdf`, // GET /api/v1/tickets/{id}/pdf
  EMAIL_TICKET: (id: number) => `/api/v1/tickets/${id}/email`, // POST /api/v1/tickets/{id}/email
  VALIDATE_TICKET: (ticketNumber: string) => `/api/v1/tickets/validate/${ticketNumber}`, // GET /api/v1/tickets/validate/{ticketNumber}
  GET_TICKETS_BY_USER: (userId: number) => `/api/v1/tickets/user/${userId}`, // GET /api/v1/tickets/user/{userId}
  GET_TICKET_BY_NUMBER: (ticketNumber: string) => `/api/v1/tickets/number/${ticketNumber}`, // GET /api/v1/tickets/number/{ticketNumber}
  GET_TICKET_PDF_BY_NUMBER: (ticketNumber: string) => `/api/v1/tickets/number/${ticketNumber}/pdf`, // GET /api/v1/tickets/number/{ticketNumber}/pdf
  GET_TICKET_BY_BOOKING: (bookingId: number) => `/api/v1/tickets/booking/${bookingId}`, // GET /api/v1/tickets/booking/{bookingId}
};

// Receipt endpoints
export const RECEIPTS = {
  GET_RECEIPT_BY_ID: (id: number) => `/${id}`, // GET /{id}
  GET_RECEIPT_BY_TICKET_ID: (id: number) => `/${id}/ticket`, // GET /{id}/ticket
  GET_RECEIPT_BY_PAYMENT_ID: (id: number) => `/${id}/payment`, // GET /{id}/payment
  GET_RECEIPTS_BY_USER: (userId: number, page?: number, size?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const query = params.toString();
    return `/user/${userId}${query ? `?${query}` : ''}`;
  }, // GET /user/{id}
  GET_RECEIPTS_BY_COMPANY: (companyId: number, page?: number, size?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const query = params.toString();
    return `/company/${companyId}${query ? `?${query}` : ''}`;
  }, // GET /company/{id}
};

// Wallet endpoints
export const WALLETS = {
  CREATE_WALLET: (userId: number) => `/api/v1/wallets/user/${userId}`, // POST /api/v1/wallets/user/{userId}
  GET_WALLET_BY_ID: (walletId: number) => `/api/v1/wallets/${walletId}`, // GET /api/v1/wallets/{walletId}
  GET_WALLET_BY_USER_ID: (userId: number) => `/api/v1/wallets/user/${userId}`, // GET /api/v1/wallets/user/{userId}
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

// Stripe endpoints
export const STRIPE = {
  CREATE_PAYMENT_INTENT: (amountInCents: number, currency: string, customerEmail: string, description?: string) => {
    const params = new URLSearchParams();
    params.append('amountInCents', amountInCents.toString());
    params.append('currency', currency);
    params.append('customerEmail', customerEmail);
    if (description) params.append('description', description);
    return `/api/v1/stripe/payment-intent?${params.toString()}`;
  }, // POST /api/v1/stripe/payment-intent
  CREATE_CHECKOUT_SESSION: (priceId: string, successUrl: string, cancelUrl: string, customerEmail: string) => {
    const params = new URLSearchParams();
    params.append('priceId', priceId);
    params.append('successUrl', successUrl);
    params.append('cancelUrl', cancelUrl);
    params.append('customerEmail', customerEmail);
    return `/api/v1/stripe/checkout-session?${params.toString()}`;
  }, // POST /api/v1/stripe/checkout-session
  WEBHOOK: "/api/v1/stripe/webhook", // POST /api/v1/stripe/webhook
};

// Flutterwave endpoints
export const FLUTTERWAVE = {
  INITIALIZE_PAYMENT: "/api/v1/flutterwave/initialize", // POST /api/v1/flutterwave/initialize
  VERIFY_TRANSACTION: (transactionId: string) => `/api/v1/flutterwave/verify/${transactionId}`, // GET /api/v1/flutterwave/verify/{transactionId}
  WEBHOOK: "/api/v1/flutterwave/webhook", // POST /api/v1/flutterwave/webhook
};

// Laybys endpoints
export const LAYBYS = {
  GET_LAYBY_BY_ID: (laybyId: number) => `/api/v1/laybys/${laybyId}`, // GET /api/v1/laybys/{laybyId}
  CREATE_LAYBY: (companyId: number) => `/api/v1/laybys/company/${companyId}`, // POST /api/v1/laybys/company/{companyId}
  UPDATE_LAYBY: (laybyId: number) => `/api/v1/laybys/${laybyId}`, // PUT /api/v1/laybys/{laybyId}
  DELETE_LAYBY: (laybyId: number) => `/api/v1/laybys/${laybyId}`, // DELETE /api/v1/laybys/{laybyId}
  DEACTIVATE_LAYBY: (laybyId: number) => `/api/v1/laybys/${laybyId}/deactivate`, // PATCH /api/v1/laybys/{laybyId}/deactivate
  GET_LAYBYS_BY_COMPANY: (companyId: number) => `/api/v1/laybys/company/${companyId}`, // GET /api/v1/laybys/company/{companyId}
  GET_DEPARTURE_POINTS: (companyId: number) => `/api/v1/laybys/company/${companyId}/departures`, // GET /api/v1/laybys/company/{companyId}/departures
  GET_ARRIVAL_POINTS: (companyId: number) => `/api/v1/laybys/company/${companyId}/arrivals`, // GET /api/v1/laybys/company/{companyId}/arrivals
  GET_LAYBYS_BY_CITY: (companyId: number, city: string) => `/api/v1/laybys/company/${companyId}/city/${city}`, // GET /api/v1/laybys/company/{companyId}/city/{city}
};

// Transport Staff endpoints
export const TRANSPORT_STAFF = {
  GET_STAFF: (companyId: number) => `/transport/${companyId}/staff`, // GET /transport/{companyId}/staff
  ADD_STAFF: (companyId: number) => `/transport/${companyId}/staff`, // POST /transport/{companyId}/staff
  UPDATE_STAFF_ROLE: (companyId: number, staffId: number, role: string) => `/transport/${companyId}/staff/${staffId}/role?role=${role}`, // PUT /transport/{companyId}/staff/{staffId}/role
  REVOKE_STAFF: (companyId: number, staffId: number) => `/transport/${companyId}/staff/${staffId}`, // DELETE /transport/{companyId}/staff/{staffId}
};

// Notifications endpoints
export const NOTIFICATIONS = {
  GET_NOTIFICATIONS: (page?: number, size?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const query = params.toString();
    return `/notifications${query ? `?${query}` : ''}`;
  }, // GET /notifications
  GET_UNREAD_COUNT: "/notifications/unread-count", // GET /notifications/unread-count
  MARK_AS_READ: (id: number) => `/notifications/${id}/read`, // PUT /notifications/{id}/read
  MARK_ALL_AS_READ: "/notifications/read-all", // PUT /notifications/read-all
  UPDATE_FCM_TOKEN: "/notifications/fcm-token", // PUT /notifications/fcm-token
  DELETE_NOTIFICATION: (id: number) => `/notifications/${id}`, // DELETE /notifications/{id}
};

// Analytics & Reports endpoints
export const ANALYTICS = {
  GET_DAILY_ANALYTICS: (companyId: number, date: string) => `/api/v1/analytics/company/${companyId}/daily?date=${date}`, // GET /api/v1/analytics/company/{companyId}/daily
  GET_ANALYTICS_RANGE: (companyId: number, start: string, end: string) => `/api/v1/analytics/company/${companyId}/range?start=${start}&end=${end}`, // GET /api/v1/analytics/company/{companyId}/range
  GET_PAYOUT_HISTORY: (companyId: number, page?: number, size?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const query = params.toString();
    return `/api/v1/analytics/company/${companyId}/payouts${query ? `?${query}` : ''}`;
  }, // GET /api/v1/analytics/company/{companyId}/payouts
  GENERATE_DAILY_REPORT: (companyId: number, date: string) => `/api/v1/analytics/company/${companyId}/report/daily?date=${date}`, // POST /api/v1/analytics/company/{companyId}/report/daily
  GENERATE_WEEKLY_REPORT: (companyId: number, weekStart: string) => `/api/v1/analytics/company/${companyId}/report/weekly?weekStart=${weekStart}`, // POST /api/v1/analytics/company/{companyId}/report/weekly
  GENERATE_MONTHLY_REPORT: (companyId: number, year: number, month: number) => `/api/v1/analytics/company/${companyId}/report/monthly?year=${year}&month=${month}`, // POST /api/v1/analytics/company/{companyId}/report/monthly
  GENERATE_CUSTOM_REPORT: (companyId: number, start: string, end: string) => `/api/v1/analytics/company/${companyId}/report/custom?start=${start}&end=${end}`, // POST /api/v1/analytics/company/{companyId}/report/custom
  EMAIL_REPORT: (reportId: number, format?: string) => {
    const params = new URLSearchParams();
    if (format) params.append('format', format);
    const query = params.toString();
    return `/api/v1/analytics/report/${reportId}/email${query ? `?${query}` : ''}`;
  }, // POST /api/v1/analytics/report/{reportId}/email
  DOWNLOAD_REPORT_PDF: (reportId: number) => `/api/v1/analytics/report/${reportId}/download/pdf`, // GET /api/v1/analytics/report/{reportId}/download/pdf
  DOWNLOAD_REPORT_EXCEL: (reportId: number) => `/api/v1/analytics/report/${reportId}/download/excel`, // GET /api/v1/analytics/report/{reportId}/download/excel
  GET_PENDING_PAYOUTS: "/api/v1/analytics/payouts/pending", // GET /api/v1/analytics/payouts/pending
  PROCESS_PAYOUT: (payoutId: number) => `/api/v1/analytics/payouts/${payoutId}/process`, // POST /api/v1/analytics/payouts/{payoutId}/process
  RETRY_PAYOUT: (payoutId: number) => `/api/v1/analytics/payouts/${payoutId}/retry`, // POST /api/v1/analytics/payouts/{payoutId}/retry
};

// Audit Logs endpoints
export const AUDIT_LOGS = {
  GET_COMPANY_AUDIT_LOGS: (companyId: number, page?: number, size?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const query = params.toString();
    return `/api/v1/audit-logs/company/${companyId}${query ? `?${query}` : ''}`;
  }, // GET /api/v1/audit-logs/company/{companyId}
  GET_AUDIT_LOGS_BY_ENTITY: (companyId: number, entityType: string, page?: number, size?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const query = params.toString();
    return `/api/v1/audit-logs/company/${companyId}/entity/${entityType}${query ? `?${query}` : ''}`;
  }, // GET /api/v1/audit-logs/company/{companyId}/entity/{entityType}
  GET_AUDIT_LOGS_BY_DATE_RANGE: (companyId: number, start: string, end: string, page?: number, size?: number) => {
    const params = new URLSearchParams();
    params.append('start', start);
    params.append('end', end);
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    return `/api/v1/audit-logs/company/${companyId}/date-range?${params.toString()}`;
  }, // GET /api/v1/audit-logs/company/{companyId}/date-range
  GET_AUDIT_LOGS_BY_ACTION: (companyId: number, action: string, page?: number, size?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const query = params.toString();
    return `/api/v1/audit-logs/company/${companyId}/action/${action}${query ? `?${query}` : ''}`;
  }, // GET /api/v1/audit-logs/company/{companyId}/action/{action}
};

// Default endpoint
export const DEFAULT = {
  GET_DEFAULT_RESPONSE: "/default", // GET /default
};
