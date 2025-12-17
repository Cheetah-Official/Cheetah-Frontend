"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
// TODO: Replace with RTK Query hooks
// import { useGetScheduleByIdQuery, useCreateBookingMutation } from "@/feature/bookings/bookingApiSlice";
import {
  FaArrowLeft,
  FaClock,
  FaBus,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "@/lib/useAuth";

type PassengerForm = {
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
};

type ScheduleData = {
  origin?: string;
  destination?: string;
  departure_time?: string;
  arrival_time?: string;
  provider_name?: string;
  provider?: string;
  base_price?: number;
  price?: number;
  vehicle_type?: string;
  duration_minutes?: number;
  available_seats?: number;
  total_seats?: number;
};

function BookingDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeParams = useParams();
  const { user } = useAuth();
  const passengersCount = Math.max(
    1,
    Number(searchParams.get("passengers") || 1),
  );
  const rawScheduleId = (routeParams as any)?.schedule_id as
    | string
    | string[]
    | undefined;
  const scheduleId = decodeURIComponent(
    Array.isArray(rawScheduleId) ? rawScheduleId[0] : rawScheduleId || "",
  );

  // TODO: Replace with RTK Query hook
  // Note: getScheduleDetails may need to use useGetScheduleByIdQuery if scheduleId is numeric
  // Or use a different endpoint if scheduleId is a string reference
  // const { data, isLoading, isError, error } = useGetScheduleByIdQuery(Number(scheduleId));
  const data = null as ScheduleData | null; // TODO: Get from RTK Query
  const isLoading = false; // TODO: Get from RTK Query
  const isError = false; // TODO: Get from RTK Query
  const error = null; // TODO: Get from RTK Query

  const [passengers, setPassengers] = useState<PassengerForm[]>([]);
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  useEffect(() => {
    setPassengers(
      Array.from({ length: passengersCount }, () => ({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
      })),
    );
  }, [passengersCount]);

  // Prefill contact email from previous bookings
  useEffect(() => {
    try {
      const saved =
        typeof window !== "undefined"
          ? window.localStorage.getItem("cheetah_contact_email")
          : null;
      if (saved) setContactEmail(saved);
    } catch {}
  }, []);

  const [formError, setFormError] = useState<string>("");

  // TODO: Replace with RTK Query mutation
  // const [createBooking, { isLoading: isPending, isSuccess, isError }] = useCreateBookingMutation();
  // Usage in onSubmit:
  // try {
  //   const res = await createBooking(payload).unwrap();
  //   // Handle success
  // } catch (error) {
  //   // Handle error
  // }
  const createBooking = {
    mutate: async (payload: any) => {
      // TODO: Implement with useCreateBookingMutation
      // const result = await createBooking(payload).unwrap();
      // return result;
      throw new Error("TODO: Implement booking creation with RTK Query");
    },
    isPending: false, // TODO: Get from RTK Query mutation state
    isSuccess: false, // TODO: Get from RTK Query mutation state
    isError: false, // TODO: Get from RTK Query mutation state
  };

  // TODO: Move this success handler into the onSubmit function when using RTK Query
  const handleBookingSuccess = (res: any) => {
    const ref = encodeURIComponent(res.booking_reference || "");
    const emailParam = encodeURIComponent(contactEmail || "");
    const origin = encodeURIComponent(data?.origin || "");
    const destination = encodeURIComponent(data?.destination || "");
    const date = encodeURIComponent(data?.departure_time || "");
    const bookingId = encodeURIComponent(res.booking_id || "");
    try {
      if (typeof window !== "undefined" && contactEmail) {
        window.localStorage.setItem("cheetah_contact_email", contactEmail);
        window.sessionStorage.removeItem("cheetah_pending_booking");
      }
    } catch {}
    router.push(
      `/bookings/confirmation?ref=${ref}&email=${emailParam}&origin=${origin}&destination=${destination}&date=${date}&booking_id=${bookingId}`,
    );
  };

  // TODO: Move this error handler into the onSubmit function when using RTK Query
  const handleBookingError = (e: any) => {
    const status = Number(e?.status || 0);
    if (status === 401 || status === 307) {
      try {
        const payload = {
          schedule_id: scheduleId,
          passenger_details: passengers.map((p) => ({
            first_name: p.first_name,
            last_name: p.last_name,
            phone: p.phone || undefined,
            email: p.email || undefined,
          })),
          guest_email: contactEmail,
          guest_phone: contactPhone || undefined,
        };
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(
            "cheetah_pending_booking",
            JSON.stringify(payload),
          );
        }
      } catch {}
      const nextUrl =
        typeof window !== "undefined"
          ? window.location.pathname +
            window.location.search +
            (window.location.search ? "&" : "?") +
            "resume=1"
          : `/bookings/${encodeURIComponent(scheduleId)}?passengers=${encodeURIComponent(passengersCount)}&resume=1`;
      router.push(`/signin?next=${encodeURIComponent(nextUrl)}`);
      return;
    }
    setFormError(e?.message || "Booking failed. Please try again.");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    // Minimal validation
    for (const p of passengers) {
      if (!p.first_name || !p.last_name) {
        setFormError("Please fill in first and last name for all passengers");
        return;
      }
    }
    if (!contactEmail) {
      setFormError(
        "Please provide a contact email to receive your booking details",
      );
      return;
    }
    setFormError("");
    const payload = {
      schedule_id: scheduleId,
      passenger_details: passengers.map((p) => ({
        first_name: p.first_name,
        last_name: p.last_name,
        phone: p.phone || undefined,
        email: p.email || undefined,
      })),
      guest_email: contactEmail,
      guest_phone: contactPhone || undefined,
    };
    createBooking.mutate(payload);
  };

  // If returned from login with resume flag and we have a pending payload, auto-resume booking
  useEffect(() => {
    const resume = searchParams.get("resume");
    if (!resume) return;
    if (!user) return;
    try {
      const stored =
        typeof window !== "undefined"
          ? window.sessionStorage.getItem("cheetah_pending_booking")
          : null;
      if (stored) {
        const payload = JSON.parse(stored);
        window.sessionStorage.removeItem("cheetah_pending_booking");
        createBooking.mutate(payload);
      }
    } catch {}
  }, [searchParams, user]);

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-[#8B2323] hover:underline cursor-pointer"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          {isLoading && (
            <div className="text-gray-600">Loading schedule details…</div>
          )}
          {isError && (
            <div className="text-red-600">
              Failed to load schedule. {String((error as any)?.message || "")}
            </div>
          )}
          {!isLoading && data && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-[#8B2323]">
                    {data.provider_name || data.provider || "Provider"}
                  </div>
                  <div className="text-lg font-semibold text-[#1CBF4B]">
                    ₦
                    {Number(
                      data.base_price || data.price || 0,
                    ).toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaMapMarkerAlt className="text-[#8B2323]" />
                    <span>
                      {data.origin} → {data.destination}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaClock className="text-[#8B2323]" />
                    <span>
                      Departs:{" "}
                      {data.departure_time
                        ? new Date(data.departure_time).toLocaleString()
                        : "-"}{" "}
                      · Arrives:{" "}
                      {data.arrival_time
                        ? new Date(data.arrival_time).toLocaleString()
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaBus className="text-[#8B2323]" />
                    <span>
                      {data.vehicle_type || "Vehicle"} · Duration:{" "}
                      {data.duration_minutes ?? "-"}m
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaUsers className="text-[#8B2323]" />
                    <span>
                      Seats: {data.available_seats ?? "-"}/
                      {data.total_seats ?? "-"} · Passengers: {passengersCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Passenger Details Form */}
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Guest Contact */}
                <div className="space-y-2">
                  <div className="text-base font-bold text-gray-900">
                    Contact details (for tickets and updates)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Email (required)"
                      className="px-3 py-2 rounded border md:col-span-2 bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323]"
                      autoComplete="email"
                      required
                    />
                    <input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Phone (optional)"
                      className="px-3 py-2 rounded border bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323]"
                      autoComplete="tel"
                    />
                  </div>
                </div>
                {formError && (
                  <div className="text-sm text-red-600">{formError}</div>
                )}
                <div className="text-base font-bold text-gray-900">
                  Passenger details
                </div>
                <div className="space-y-3">
                  {passengers.map((p, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
                    >
                      <input
                        value={p.first_name}
                        onChange={(e) =>
                          setPassengers((prev) =>
                            prev.map((pp, i) =>
                              i === idx
                                ? { ...pp, first_name: e.target.value }
                                : pp,
                            ),
                          )
                        }
                        placeholder="First name"
                        className="px-3 py-2 rounded border bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] focus:shadow-none"
                      />
                      <input
                        value={p.last_name}
                        onChange={(e) =>
                          setPassengers((prev) =>
                            prev.map((pp, i) =>
                              i === idx
                                ? { ...pp, last_name: e.target.value }
                                : pp,
                            ),
                          )
                        }
                        placeholder="Last name"
                        className="px-3 py-2 rounded border bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] focus:shadow-none"
                        required
                      />
                      <input
                        value={p.phone || ""}
                        onChange={(e) =>
                          setPassengers((prev) =>
                            prev.map((pp, i) =>
                              i === idx ? { ...pp, phone: e.target.value } : pp,
                            ),
                          )
                        }
                        placeholder="Phone (optional)"
                        className="px-3 py-2 rounded border bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] focus:shadow-none"
                        autoComplete="tel"
                      />
                      <input
                        type="email"
                        value={p.email || ""}
                        onChange={(e) =>
                          setPassengers((prev) =>
                            prev.map((pp, i) =>
                              i === idx ? { ...pp, email: e.target.value } : pp,
                            ),
                          )
                        }
                        placeholder="Email (optional)"
                        className="px-3 py-2 rounded border bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] focus:shadow-none"
                        autoComplete="email"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={createBooking.isPending}
                    className="bg-[#8B2323] text-white px-6 py-3 rounded-lg font-semibold cursor-pointer disabled:opacity-60"
                  >
                    {createBooking.isPending ? "Booking…" : "Confirm Booking"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F6F6F6] p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            <div className="text-gray-600">Loading booking details…</div>
          </div>
        </div>
      </div>
    }>
      <BookingDetailsContent />
    </Suspense>
  );
}
