# Windsurf Setup Prompt — Cheetah Frontend (Next.js)

Use this document as the initial instruction/system prompt for your Windsurf session. It is tailored to your current FastAPI backend routes and payload shapes.

---

## Title

Build a production-grade Next.js frontend for Cheetah (FastAPI backend) with strong architecture and standards

## Context

- Backend base: FastAPI
- Base URL: read from env `NEXT_PUBLIC_API_BASE_URL` (e.g., `http://localhost:8000`)
- Namespaces and prefixes (from `app/main.py`):
  - `/auth`
  - `/users`
  - `/bookings`
  - `/payments`
- Core flows:
  - Search routes → view results → create booking → initialize payment → verify payment → confirmation
  - User booking history and admin bookings management

## High-level goals

- Use Next.js App Router (Next 14+), TypeScript strict, and server components by default.
- Strong, scalable file structure; code standards enforced via ESLint/Prettier and CI.
- Centralized API client and schema validation with Zod; no `fetch` calls directly from components.
- Accessible UI with Tailwind CSS and shadcn/ui (Radix-based), responsive design.
- Client data management with React Query. Prefer RSC fetch for read-only pages when suitable.

## Technology and standards

- TypeScript strict
- Tailwind CSS + shadcn/ui
- React Query (TanStack Query)
- React Hook Form + Zod
- next-intl (en scaffold; structure for i18n)
- ESLint (next/core-web-vitals) + Prettier + Husky + lint-staged
- Jest + RTL for unit; Playwright for e2e smoke
- Basic GitHub Actions CI

## Project structure

```
app/
  (main)/
    layout.tsx
    page.tsx
    search/page.tsx
    results/page.tsx
    booking/page.tsx
    payment/page.tsx
    payment/callback/page.tsx
    dashboard/page.tsx
    admin/page.tsx
    admin/bookings/page.tsx
components/
  ui/                # shadcn components
  common/            # Header, Footer, Layout, Pagination, EmptyState
  forms/             # Form, Input, Select, DatePicker wrappers
lib/
  api/
    client.ts        # fetch wrapper (with interceptors)
    endpoints/
      bookings.ts
      payments.ts
      auth.ts
      providers.ts
    schemas/
      bookings.ts
      payments.ts
      auth.ts
      providers.ts
  config.ts          # env safe-read via Zod
  queryClient.ts
  auth.ts            # helpers: token/cookie, route guards
providers/
  query-provider.tsx
  theme-provider.tsx
  intl-provider.tsx
styles/
  globals.css
  tailwind.css
hooks/
store/               # Zustand if needed
tests/
  unit/
  e2e/
public/
.github/workflows/ci.yml
.husky/
.env.example
```

## Environment variables (.env.example)

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Cheetah
```

## API surface (tailored to backend)

### Bookings (`/bookings`)

- `GET /bookings/search`
  - Query: `origin`, `destination`, `date` (ISO)
  - Optional query: `max_price`, `min_price`, `departure_after`, `departure_before`, `providers` (csv), `vehicle_types` (csv), `sort_by`, `include_comparison`
  - Response: `{ routes: RouteSearchResponse[], comparison_summary? }`
  - `RouteSearchResponse`: `{ schedule_id, provider_code, provider_name, origin, destination, departure_time, arrival_time, duration_minutes, total_seats, available_seats, base_price, vehicle_type, amenities[] }`

- `GET /bookings/schedule/{schedule_id}`
  - Response: `Record<string, any>` (detailed schedule)

- `POST /bookings/`
  - Body `BookingCreateRequest`:
    - `schedule_id: string`
    - `passenger_details: Array<{ first_name, last_name, phone?, email?, id_type?, id_number? }>`
    - `guest_email?: string (email)`
    - `guest_phone?: string`
  - Response `BookingResponse`:
    - `booking_id`, `booking_reference`, `provider_booking_reference?`, `total_amount`, `booking_status`, `payment_status`, `passenger_count`, `schedule_details`

- `GET /bookings/{booking_id}`
  - Response: `Record<string, any>` (subject to role/ownership checks)

- `GET /bookings/user/bookings`
  - Query: `limit` (default 50), `offset` (default 0), `status?: BookingStatus`
  - Response: `Record<string, any>[]`

- `POST /bookings/{booking_id}/cancel`
  - Response: `{ message: string }`

- `GET /bookings/reference/{booking_reference}`
  - Response: `Record<string, any>`

- `GET /bookings/price-comparison`
  - Query: `origin`, `destination`, `date`
  - Response: `{ comparison_summary, provider_comparison, cheapest_option?, fastest_option?, search_criteria }`

- `GET /bookings/providers/statistics`
  - Response: `Record<string, any>`

- `GET /bookings/statistics` (admin-only)
  - Response: `Record<string, any>`

#### Admin (`/bookings`)

- `GET /bookings/admin/all`
  - Query: `limit`, `offset`, `status?`
  - Response: `Record<string, any>[]`

- `POST /bookings/admin/{booking_id}/confirm`
  - Response: `{ message: string }`

### Payments (`/payments`)

- `POST /payments/initialize`
  - Body `PaymentInitializeRequest`:
    - `booking_id: string`
    - `payment_method: string = "card"`
    - `provider: string = "paystack"`
  - Response `PaymentInitializeResponse`:
    - `payment_reference`, `status`, `amount`, `currency`, `payment_method`, `provider`, `authorization_url`, `access_code`, `expires_at`

- `POST /payments/verify/{payment_reference}`
  - Query: `provider?="paystack"`
  - Response `PaymentVerificationResponse`:
    - `payment_reference`, `status`, `amount`, `currency`, `provider`, `transaction_id?`, `gateway_response`, `paid_at?`, `message`

- `POST /payments/refund/{booking_id}`
  - Body `RefundRequest`: `{ amount?: number, reason: string = "Customer request" }`
  - Response `RefundResponse`: `{ refund_reference, status, amount, currency, booking_reference, reason, processed_at?, message }`

- `GET /payments/methods`
  - Query: `provider?="paystack"`
  - Response: `Array<{ method, name, provider, currency }>`

- `GET /payments/booking/{booking_id}/total`
  - Response `BookingTotalResponse`:
    - `base_amount`, `booking_fee`, `platform_fee`, `insurance_fee`, `wifi_fee`, `total_fees`, `grand_total`, `breakdown`

- `GET /payments/statistics` (admin-only)
  - Response: `Record<string, any>`

## Client and schemas (implement in `lib/`)

### `lib/config.ts`

- Read `NEXT_PUBLIC_API_BASE_URL` using Zod; throw in dev if missing.

### `lib/api/client.ts`

- Small fetch wrapper:
  - Base URL from env
  - Normalize errors to `{ status, message, details? }`
  - Attach `Authorization` header when a token cookie is present
  - Helpers: `get`, `post`, `put`, `del` with generics

### `lib/api/schemas/bookings.ts`

```ts
import { z } from "zod";

export const PassengerDetail = z.object({
  first_name: z.string(),
  last_name: z.string(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  id_type: z.string().optional(),
  id_number: z.string().optional(),
});

export const BookingCreateRequest = z.object({
  schedule_id: z.string(),
  passenger_details: z.array(PassengerDetail).min(1),
  guest_email: z.string().email().optional(),
  guest_phone: z.string().optional(),
});

export const RouteSearchResponse = z.object({
  schedule_id: z.string(),
  provider_code: z.string(),
  provider_name: z.string(),
  origin: z.string(),
  destination: z.string(),
  departure_time: z.string(),
  arrival_time: z.string(),
  duration_minutes: z.number(),
  total_seats: z.number(),
  available_seats: z.number(),
  base_price: z.number(),
  vehicle_type: z.string(),
  amenities: z.array(z.string()),
});

export const BookingResponse = z.object({
  booking_id: z.string(),
  booking_reference: z.string(),
  provider_booking_reference: z.string().optional(),
  total_amount: z.number(),
  booking_status: z.string(),
  payment_status: z.string(),
  passenger_count: z.number(),
  schedule_details: z.record(z.any()),
});

export type PassengerDetailT = z.infer<typeof PassengerDetail>;
export type BookingCreateRequestT = z.infer<typeof BookingCreateRequest>;
export type RouteSearchResponseT = z.infer<typeof RouteSearchResponse>;
export type BookingResponseT = z.infer<typeof BookingResponse>;
```

### `lib/api/schemas/payments.ts`

```ts
import { z } from "zod";

export const PaymentInitializeRequest = z.object({
  booking_id: z.string(),
  payment_method: z.string().default("card"),
  provider: z.string().default("paystack"),
});

export const PaymentInitializeResponse = z.object({
  payment_reference: z.string(),
  status: z.string(),
  amount: z.number(),
  currency: z.string(),
  payment_method: z.string(),
  provider: z.string(),
  authorization_url: z.string().url(),
  access_code: z.string(),
  expires_at: z.number(),
});

export const PaymentVerificationResponse = z.object({
  payment_reference: z.string(),
  status: z.string(),
  amount: z.number(),
  currency: z.string(),
  provider: z.string(),
  transaction_id: z.string().nullable().optional(),
  gateway_response: z.string(),
  paid_at: z.string().nullable().optional(),
  message: z.string(),
});

export const RefundRequest = z.object({
  amount: z.number().optional(),
  reason: z.string().default("Customer request"),
});

export const RefundResponse = z.object({
  refund_reference: z.string(),
  status: z.string(),
  amount: z.number(),
  currency: z.string(),
  booking_reference: z.string(),
  reason: z.string(),
  processed_at: z.string().nullable().optional(),
  message: z.string(),
});

export const BookingTotalResponse = z.object({
  base_amount: z.number(),
  booking_fee: z.number(),
  platform_fee: z.number(),
  insurance_fee: z.number(),
  wifi_fee: z.number(),
  total_fees: z.number(),
  grand_total: z.number(),
  breakdown: z.record(z.any()),
});

export type PaymentInitializeRequestT = z.infer<
  typeof PaymentInitializeRequest
>;
export type PaymentInitializeResponseT = z.infer<
  typeof PaymentInitializeResponse
>;
export type PaymentVerificationResponseT = z.infer<
  typeof PaymentVerificationResponse
>;
export type RefundRequestT = z.infer<typeof RefundRequest>;
export type RefundResponseT = z.infer<typeof RefundResponse>;
export type BookingTotalResponseT = z.infer<typeof BookingTotalResponse>;
```

### `lib/api/endpoints/bookings.ts`

```ts
import { z } from "zod";
import { client } from "../client";
import {
  BookingCreateRequest,
  BookingResponse,
  RouteSearchResponse,
} from "../schemas/bookings";

const SearchQuery = z.object({
  origin: z.string(),
  destination: z.string(),
  date: z.string(), // ISO
  max_price: z.string().optional(),
  min_price: z.string().optional(),
  departure_after: z.string().optional(),
  departure_before: z.string().optional(),
  providers: z.string().optional(), // csv
  vehicle_types: z.string().optional(), // csv
  sort_by: z.string().optional(),
  include_comparison: z.boolean().optional(),
});

export const bookingsApi = {
  async search(params: z.infer<typeof SearchQuery>) {
    return client.get<{ routes: z.infer<typeof RouteSearchResponse>[] }>(
      "/bookings/search",
      { params },
    );
  },
  async scheduleDetails(scheduleId: string) {
    return client.get<Record<string, any>>(`/bookings/schedule/${scheduleId}`);
  },
  async create(payload: z.infer<typeof BookingCreateRequest>) {
    const body = BookingCreateRequest.parse(payload);
    return client.post<z.infer<typeof BookingResponse>>("/bookings/", body);
  },
  async get(bookingId: string) {
    return client.get<Record<string, any>>(`/bookings/${bookingId}`);
  },
  async userBookings(params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }) {
    return client.get<Record<string, any>[]>(`/bookings/user/bookings`, {
      params,
    });
  },
  async cancel(bookingId: string) {
    return client.post<{ message: string }>(
      `/bookings/${bookingId}/cancel`,
      {},
    );
  },
  async byReference(reference: string) {
    return client.get<Record<string, any>>(`/bookings/reference/${reference}`);
  },
  async priceComparison(params: {
    origin: string;
    destination: string;
    date: string;
  }) {
    return client.get<Record<string, any>>(`/bookings/price-comparison`, {
      params,
    });
  },
  async providerStats() {
    return client.get<Record<string, any>>(`/bookings/providers/statistics`);
  },
  async stats() {
    return client.get<Record<string, any>>(`/bookings/statistics`);
  },
  // Admin
  async adminAll(params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }) {
    return client.get<Record<string, any>[]>(`/bookings/admin/all`, { params });
  },
  async adminConfirm(bookingId: string) {
    return client.post<{ message: string }>(
      `/bookings/admin/${bookingId}/confirm`,
      {},
    );
  },
};
```

### `lib/api/endpoints/payments.ts`

```ts
import { z } from "zod";
import { client } from "../client";
import {
  PaymentInitializeRequest,
  PaymentInitializeResponse,
  PaymentVerificationResponse,
  RefundRequest,
  RefundResponse,
  BookingTotalResponse,
} from "../schemas/payments";

export const paymentsApi = {
  async initialize(body: z.infer<typeof PaymentInitializeRequest>) {
    const payload = PaymentInitializeRequest.parse(body);
    return client.post<z.infer<typeof PaymentInitializeResponse>>(
      "/payments/initialize",
      payload,
    );
  },
  async verify(payment_reference: string, provider = "paystack") {
    return client.post<z.infer<typeof PaymentVerificationResponse>>(
      `/payments/verify/${payment_reference}`,
      {},
      { params: { provider } },
    );
  },
  async refund(bookingId: string, body: z.infer<typeof RefundRequest>) {
    const payload = RefundRequest.parse(body);
    return client.post<z.infer<typeof RefundResponse>>(
      `/payments/refund/${bookingId}`,
      payload,
    );
  },
  async methods(provider = "paystack") {
    return client.get<
      { method: string; name: string; provider: string; currency: string }[]
    >("/payments/methods", { params: { provider } });
  },
  async bookingTotal(bookingId: string) {
    return client.get<z.infer<typeof BookingTotalResponse>>(
      `/payments/booking/${bookingId}/total`,
    );
  },
  async stats() {
    return client.get<Record<string, any>>(`/payments/statistics`);
  },
};
```

## Implementation tasks for Windsurf

- **Project hygiene**
- **Config and providers**
- **API client layer**
- **Pages (MVP)**
- **UI and accessibility**
- **Testing and CI**
- **Conventions**:
  - Server components by default; client components only where necessary.
  - No direct `fetch` in components; use `lib/api` with Zod validation.
  - Share Zod schemas between forms and API layer.
  - React Query keys like `['bookings','search',params]`, `['bookings','detail',id]`, `['payments','total',bookingId]`.

---

This prompt reflects the current backend surface in:

- `app/main.py` (router prefixes)
- `app/routers/bookings.py` (booking endpoints and shapes)
- `app/routers/payments.py` (payment endpoints and shapes)

If the backend API changes, update this doc accordingly.
