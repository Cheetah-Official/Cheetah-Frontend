import { client } from "@/lib/api/client";

export const paymentsApi = {
  async initializePayment(payload: {
    booking_id: string;
    payment_method?: string;
    provider?: string;
  }): Promise<any> {
    const body = {
      booking_id: payload.booking_id,
      payment_method: payload.payment_method || "card",
      provider: payload.provider || "paystack",
    };
    return client.post<any>("/payments/initialize", body);
  },
  async verifyPayment(
    payment_reference: string,
    provider: string = "paystack",
  ): Promise<any> {
    return client.post<any>(
      `/payments/verify/${encodeURIComponent(payment_reference)}?provider=${encodeURIComponent(provider)}`,
      {},
    );
  },
  async getBookingTotal(booking_id: string): Promise<any> {
    return client.get<any>(
      `/payments/booking/${encodeURIComponent(booking_id)}/total`,
    );
  },
};
