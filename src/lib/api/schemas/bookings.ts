import { z } from "zod";

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

export const SearchRoutesResponse = z.object({
  routes: z.array(RouteSearchResponse),
  comparison_summary: z.unknown().optional(),
});

export type RouteSearchResponseT = z.infer<typeof RouteSearchResponse>;
export type SearchRoutesResponseT = z.infer<typeof SearchRoutesResponse>;

// Booking creation
export const PassengerDetail = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  id_type: z.string().optional().nullable(),
  id_number: z.string().optional().nullable(),
});

export const BookingCreateRequest = z.object({
  schedule_id: z.string(),
  passenger_details: z.array(PassengerDetail).min(1),
  guest_email: z.string().email().optional().nullable(),
  guest_phone: z.string().optional().nullable(),
});

export const BookingResponse = z.object({
  booking_id: z.string(),
  booking_reference: z.string(),
  provider_booking_reference: z.string().optional().nullable(),
  total_amount: z.number(),
  booking_status: z.string(),
  payment_status: z.string(),
  passenger_count: z.number(),
  schedule_details: z.record(z.any()),
});

export type PassengerDetailT = z.infer<typeof PassengerDetail>;
export type BookingCreateRequestT = z.infer<typeof BookingCreateRequest>;
export type BookingResponseT = z.infer<typeof BookingResponse>;
