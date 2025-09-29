import { client } from "@/lib/api/client";
import { z } from "zod";
import { SearchRoutesResponse, type SearchRoutesResponseT } from "@/lib/api/schemas/bookings";

export const bookingsApi = {
  async searchRoutes(params: {
    origin: string;
    destination: string;
    date: string; // ISO 8601 expected by backend
    max_price?: number;
    min_price?: number;
    departure_after?: string; // ISO datetime
    departure_before?: string; // ISO datetime
    providers?: string; // comma-separated
    vehicle_types?: string; // comma-separated
    sort_by?: string;
    include_comparison?: boolean;
  }): Promise<SearchRoutesResponseT> {
    const raw = await client.get<any>("/bookings/search", { params });
    return SearchRoutesResponse.parse(raw);
  },
};
