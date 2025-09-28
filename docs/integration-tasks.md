# Cheetah Frontend ↔ Backend Integration Plan

This plan is based on `docs/windsurf-frontend-setup.md` and validated by inspecting the backend OpenAPI at `http://localhost:8000/openapi.json` (fetched via curl locally).

---

## Backend Surface Summary

- Namespaces confirmed: `/bookings`, `/payments`, plus `/auth`, `/users` present in schema.
- Payments schemas present: `PaymentInitializeRequest/Response`, `PaymentVerificationResponse`, `RefundRequest/Response`, `PaymentMethodResponse`, `BookingTotalResponse`.
- User-related schemas present: `Token`, `UserResponse`, `UserRegister`, `UserLogin`, etc. (useful for future auth).
- Booking-related responses present (e.g., `UserBookingResponse`).

No contradictions found vs. the endpoints outlined in `docs/windsurf-frontend-setup.md`. If you notice any path/query/shape differences when the backend updates, update this doc and the schemas accordingly.

---

## Env and Config

- Ensure root `.env` contains:
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`
  - `NEXT_PUBLIC_APP_NAME=Cheetah`
- Create and commit `.env.example` with the above (no secrets).
- Implement `lib/config.ts` with Zod validation and dev-time error if base URL is missing.

---

## Client and Schemas

- `lib/api/client.ts`:
  - Base URL from `lib/config.ts`.
  - Helpers: `get`, `post`, `put`, `del` with generics.
  - Normalize errors to `{ status, message, details? }`.
  - Attach `Authorization` header if a token cookie is available (future-proofing for `/auth`).
- `lib/api/schemas/`:
  - `bookings.ts` and `payments.ts` as already drafted in the setup doc.
- `lib/api/endpoints/` wrappers:
  - `bookings.ts`: `search`, `scheduleDetails`, `create`, `get`, `userBookings`, `cancel`, `byReference`, `priceComparison`, `providerStats`, `stats`, `adminAll`, `adminConfirm`.
  - `payments.ts`: `initialize`, `verify`, `refund`, `methods`, `bookingTotal`, `stats`.

---

## Pages and Flows (MVP)

- `app/(main)/search/page.tsx` → capture search params.
- `app/(main)/results/page.tsx` → lists routes; link to booking.
- `app/(main)/booking/page.tsx` → passenger details; call `POST /bookings/`.
- `app/(main)/payment/page.tsx` → call `POST /payments/initialize`; redirect to `authorization_url`.
- `app/(main)/payment/callback/page.tsx` → `POST /payments/verify/{payment_reference}`; show confirmation.
- `app/(main)/dashboard/page.tsx` → `GET /bookings/user/bookings`.
- `app/(main)/admin/page.tsx` & `admin/bookings/page.tsx` → admin lists and confirm action.

Use React Query for client-side mutations and dynamic lists. Prefer RSC for read-only SSR-friendly pages.

---

## Task Checklist

- Environment
  - [ ] Add `.env.example` with `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_APP_NAME`.
  - [ ] Implement `lib/config.ts` with Zod validation.
- API Layer
  - [ ] Implement `lib/api/client.ts` with error normalization and auth header.
  - [ ] Add `lib/api/schemas/bookings.ts` and `payments.ts` (Zod + types).
  - [ ] Add `lib/api/endpoints/bookings.ts` and `payments.ts`.
- Providers
  - [ ] `providers/query-provider.tsx`, `providers/theme-provider.tsx`, `providers/intl-provider.tsx`.
- UI Pages
  - [ ] Search, Results, Booking, Payment, Payment Callback, Dashboard, Admin, Admin Bookings.
- Data Strategy
  - [ ] React Query keys: `['bookings','search',params]`, `['bookings','detail',id]`, `['payments','total',bookingId]`; cache + invalidation on create/verify.
- Tooling
  - [ ] ESLint/Prettier, Husky, lint-staged, CI.
  - [ ] Tests: Jest+RTL unit for schemas/endpoints; Playwright e2e smoke.
- Docs
  - [ ] Keep this file and `docs/windsurf-frontend-setup.md` up to date with backend changes.

---

## Verification

- [ ] Search returns results and filters apply.
- [ ] Booking creation returns expected fields and totals.
- [ ] Payment initialize returns `authorization_url` and redirects.
- [ ] Payment verify sets confirmation state.
- [ ] Dashboard lists user bookings.
- [ ] Admin list/confirm works with proper auth/role.

---

## Notes / To Confirm

- Confirm any auth/roles required for admin endpoints and whether OAuth2 password flow is enforced (OpenAPI shows `OAuth2PasswordBearer`).
- Confirm any additional fields we should surface (e.g., insurance/wifi features present in schema).
- Capture any query parameter naming changes in search/price comparison.
