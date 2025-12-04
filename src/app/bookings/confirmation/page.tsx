"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/lib/useAuth";
import { paymentsApi } from "@/lib/api/endpoints/payments";

function BookingConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const ref = searchParams.get("ref");
  const email = searchParams.get("email");
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");
  const bookingId = searchParams.get("booking_id");

  const [totals, setTotals] = useState<any | null>(null);
  const [loadingTotals, setLoadingTotals] = useState<boolean>(false);
  const [initLoading, setInitLoading] = useState<boolean>(false);
  const [initError, setInitError] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      if (!bookingId) return;
      try {
        setLoadingTotals(true);
        const t = await paymentsApi.getBookingTotal(bookingId);
        setTotals(t);
      } catch (e: any) {
        // non-blocking
      } finally {
        setLoadingTotals(false);
      }
    };
    load();
  }, [bookingId]);

  const onPayNow = async () => {
    if (!bookingId) return;
    try {
      setInitError("");
      setInitLoading(true);
      const init = await paymentsApi.initializePayment({ booking_id: bookingId });
      const url = init?.authorization_url;
      if (url) {
        window.location.href = url;
      } else {
        setInitError("Failed to initialize payment: no authorization URL returned");
      }
    } catch (e: any) {
      setInitError(e?.message || "Failed to initialize payment");
    } finally {
      setInitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-xl w-full text-center">
        <div className="mx-auto mb-4 w-16 h-16 relative">
          <Image src="/Cheetah 2.svg" alt="Cheetah" fill className="object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-[#8B2323] mb-2">Booking Confirmed</h1>
        <p className="text-gray-600 mb-4">Thank you for booking with Cheetah.</p>

        {ref ? (
          <div className="bg-gray-50 border rounded-lg p-4 text-left mb-4">
            <div className="text-sm text-gray-500">Booking Reference</div>
            <div className="text-lg font-semibold">{ref}</div>
          </div>
        ) : null}

        {(origin || destination || date) && (
          <div className="bg-gray-50 border rounded-lg p-4 text-left mb-4">
            <div className="text-sm text-gray-500">Trip Summary</div>
            <div className="text-sm text-gray-700">
              {origin && destination ? (
                <div className="font-medium">{decodeURIComponent(origin)} → {decodeURIComponent(destination)}</div>
              ) : null}
              {date ? (
                <div className="text-gray-600">Departure: {new Date(decodeURIComponent(date)).toLocaleString()}</div>
              ) : null}
            </div>
          </div>
        )}

        {bookingId && (
          <div className="bg-gray-50 border rounded-lg p-4 text-left mb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Payment Summary</div>
              {loadingTotals && <div className="text-xs text-gray-500">Loading…</div>}
            </div>
            {totals && (
              <div className="mt-2 text-sm text-gray-700">
                <div className="flex justify-between"><span>Base Amount</span><span>₦{Number(totals.base_amount).toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Fees</span><span>₦{Number(totals.total_fees).toLocaleString()}</span></div>
                <div className="flex justify-between font-semibold"><span>Total</span><span>₦{Number(totals.grand_total).toLocaleString()}</span></div>
              </div>
            )}
            {initError && <div className="mt-2 text-xs text-red-600">{initError}</div>}
          </div>
        )}

        <div className="text-sm text-gray-700 mb-6">
          {email ? (
            <p>Weve sent your booking details to <span className="font-semibold">{email}</span>.</p>
          ) : (
            <p>Weve sent your booking details to your provided contact.</p>
          )}
          <p className="mt-1">You can also find updates in your dashboard notifications.</p>
        </div>

        <div className="flex gap-3 justify-center">
          {bookingId && (
            <button
              className="bg-[#1CBF4B] text-white px-5 py-2.5 rounded-lg font-semibold cursor-pointer disabled:bg-gray-300"
              onClick={onPayNow}
              disabled={initLoading}
            >
              {initLoading ? 'Processing…' : 'Pay Now'}
            </button>
          )}
          <button
            className="bg-[#8B2323] text-white px-5 py-2.5 rounded-lg font-semibold cursor-pointer"
            onClick={() => router.push("/dashboard?tab=activity")}
          >
            Go to Dashboard
          </button>
          <button
            className="bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg font-semibold cursor-pointer"
            onClick={() => router.push("/")}
          >
            Back to Home
          </button>
        </div>

        {/* Signup prompt for guests */}
        {!user && (
          <div className="mt-6 text-left bg-gray-50 border rounded-lg p-4">
            <div className="font-semibold text-gray-800 mb-1">Create an account to track your bookings</div>
            <p className="text-sm text-gray-600 mb-3">Securely access your tickets, payments, and trip updates from your dashboard.</p>
            <div className="flex flex-wrap gap-3">
              <button
                className="bg-[#8B2323] text-white px-4 py-2 rounded-lg font-semibold cursor-pointer"
                onClick={() => {
                  const next = "/dashboard?tab=activity"
                  const url = `/login?next=${encodeURIComponent(next)}${email ? `&email=${encodeURIComponent(email)}` : ''}`
                  router.push(url)
                }}
              >
                Sign up / Log in
              </button>
              <button
                className="bg-white border px-4 py-2 rounded-lg font-semibold text-gray-700 cursor-pointer"
                onClick={() => router.push("/dashboard?tab=activity")}
              >
                Maybe later
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-xl w-full text-center">
          <div className="text-xl font-semibold text-[#8B2323]">Loading...</div>
        </div>
      </div>
    }>
      <BookingConfirmationContent />
    </Suspense>
  );
}
