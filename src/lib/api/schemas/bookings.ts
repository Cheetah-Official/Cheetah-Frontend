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
