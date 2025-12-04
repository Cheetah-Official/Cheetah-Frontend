import { client } from "@/lib/api/client";
import { z } from "zod";
import {
  SearchRoutesResponse,
  type SearchRoutesResponseT,
  BookingCreateRequest,
  type BookingResponseT,
} from "@/lib/api/schemas/bookings";

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
  async getScheduleDetails(schedule_id: string): Promise<any> {
    return client.get<any>(
      `/bookings/schedule/${encodeURIComponent(schedule_id)}`,
    );
  },
  async createBooking(payload: unknown): Promise<BookingResponseT> {
    const body = BookingCreateRequest.parse(payload);
    return client.post<BookingResponseT>("/bookings", body);
  },
  async getProviderStatistics(): Promise<any> {
    return client.get<any>("/bookings/providers/statistics");
  },
  async getUserBookings(params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<any[]> {
    return client.get<any>("/bookings/user/bookings", { params });
  },
};
