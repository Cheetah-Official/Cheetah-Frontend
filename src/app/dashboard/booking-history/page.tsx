"use client";

import Image from "next/image";
import { FaChevronLeft, FaCheckCircle, FaWifi, FaShieldAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  logOut,
  selectCurrentAccessToken,
  selectCurrentUser,
} from "@/feature/authentication/authSlice";
import { useGetAuthenticatedUserQuery } from "@/feature/auth/authApiSlice";
import { useGetBookingsByUserQuery } from "@/feature/bookings/bookingApiSlice";

export default function BookingHistoryPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Auth: get user and token
  const accessToken = useSelector(selectCurrentAccessToken);
  const reduxUser = useSelector(selectCurrentUser);
  const localStorageToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const hasToken = !!(accessToken || localStorageToken);

  const {
    data: authUser,
    isFetching: authUserFetching,
    error: authUserError,
  } = useGetAuthenticatedUserQuery(undefined, {
    skip: !hasToken,
  });

  useEffect(() => {
    if (authUserError && (authUserError as any)?.status === 401) {
      dispatch(logOut());
      router.replace("/signin");
    }
  }, [authUserError, dispatch, router]);

  const user = authUser || reduxUser;
  const userId =
    user?.id || user?.userId || user?.user_id || user?.customerId || user?.customer_id;

  // Fetch bookings for this user
  const {
    data: bookingsResponse,
    isLoading: loadingBookings,
    error: bookingsError,
  } = useGetBookingsByUserQuery(
    { userId: Number(userId), page: 0, size: 20 },
    { skip: !hasToken || !userId },
  );

  const bookingHistory = useMemo(() => {
    const raw =
      bookingsResponse?.content ||
      bookingsResponse?.data?.content ||
      bookingsResponse?.data ||
      bookingsResponse ||
      [];

    return (raw as any[]).map((b: any) => {
      const createdAt = b.createdAt || b.created_at;
      const departureTime = b.departureTime || b.departure_time;

      // timeAgo
      let timeAgo = "";
      if (createdAt) {
        const diffMs = Date.now() - new Date(createdAt).getTime();
        const minutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (days > 0) timeAgo = `${days} ${days === 1 ? "day" : "days"} ago`;
        else if (hours > 0)
          timeAgo = `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
        else timeAgo = `${minutes || 0} min${minutes === 1 ? "" : "s"} ago`;
      }

      // daysRemaining until departure
      let daysRemaining = 0;
      if (departureTime) {
        const diffMs = new Date(departureTime).getTime() - Date.now();
        daysRemaining = Math.max(
          0,
          Math.ceil(diffMs / (1000 * 60 * 60 * 24)),
        );
      }

      // Format departure text
      const departureText = departureTime
        ? new Date(departureTime).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "";

      return {
        id: b.id,
        company: b.companyName || "Cheetah Transport",
        logo: "/Logo.png",
        route: `${b.origin || ""} - ${b.destination || ""}`,
        price: b.price || 0,
        timeAgo,
        ticketId: b.bookingRef || b.booking_reference || `#BKG-${b.id}`,
        departure: departureText,
        daysRemaining,
        passengers: 1,
        seats: b.seatNumber ? [b.seatNumber] : [],
        status: (b.status || "").toUpperCase(),
        hasWifi: true,
        hasInsurance: true,
      };
    });
  }, [bookingsResponse]);

  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  // When bookings load, set default selection
  useEffect(() => {
    if (!selectedBooking && bookingHistory.length > 0) {
      setSelectedBooking(bookingHistory[0]);
    }
  }, [bookingHistory, selectedBooking]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen flex bg-[#F9F9F9]">
      <Sidebar
        activeTab="transports"
        mobileMenuOpen={false}
        onTabChange={(tab) => {
          if (tab === "activity") router.push("/dashboard?tab=activity");
          else if (tab === "settings") router.push("/dashboard?tab=settings");
          else if (tab === "compare") router.push("/dashboard?tab=compare");
          else router.push("/dashboard?tab=transports");
        }}
        onMobileMenuClose={() => {}}
        onLogout={() => {
          dispatch(logOut());
          router.push("/signin");
        }}
      />

      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => router.push("/dashboard?tab=activity")}
            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Go back"
            title="Go back"
          >
            <FaChevronLeft className="text-gray-600 w-5 h-5" />
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Booking History</h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 min-h-0 lg:h-[calc(100vh-180px)]">
          {/* Left Column - History */}
          <div className="bg-[#F2F2F2] rounded-xl p-4 sm:p-6 shadow-sm overflow-hidden flex flex-col h-full">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex-shrink-0">
              History
            </h2>
            {loadingBookings ? (
              <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
                Loading bookings...
              </div>
            ) : bookingsError ? (
              <div className="flex-1 flex items-center justify-center text-red-600 text-sm">
                Failed to load bookings. Please try again.
              </div>
            ) : bookingHistory.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
                You have no bookings yet.
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar min-h-0">
              {bookingHistory.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedBooking?.id === booking.id
                      ? " bg-white hover:bg-[#F5F0F0]"
                      : "  bg-gray-50 hover:bg-[#F5F0F0]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Image
                          src={booking.logo}
                          alt={booking.company}
                          width={56}
                          height={56}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 truncate">
                          {booking.company} {booking.id === 1 ? "Ticket Details" : "Details"}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">{booking.route}</p>
                        <p className="text-sm sm:text-base font-bold text-green-600">
                          {formatPrice(booking.price)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">{booking.timeAgo}</span>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>

          {/* Right Column - Ticket Details */}
          <div className="bg-[#F2F2F2] rounded-xl p-4 sm:p-6 shadow-sm">
            {!selectedBooking ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-600">
                Select a booking from the left to see details.
              </div>
            ) : (
            <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Ticket Details</h2>
              <span className="text-xs sm:text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {selectedBooking.ticketId}
              </span>
            </div>

            {/* Booking Information */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
                  <Image
                    src={selectedBooking.logo}
                    alt={selectedBooking.company}
                    width={56}
                    height={56}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-800">{selectedBooking.company}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{selectedBooking.route}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                <p className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                  {selectedBooking.passengers} {selectedBooking.passengers === 1 ? "Passenger" : "Passengers"}
                </p>
                <p className="text-base sm:text-lg font-bold text-gray-800 whitespace-nowrap">
                  {formatPrice(selectedBooking.price)}
                </p>
                <div className="flex items-center gap-2 bg-[#24C02F] px-2 sm:px-3 py-1 rounded-2xl flex-shrink-0">
                  <Image
                    src="/Confirm-tick.png"
                    alt="Confirmed"
                    width={16}
                    height={16}
                    className="w-3 h-3 sm:w-4 sm:h-4"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">{selectedBooking.status}</span>
                </div>
              </div>
            </div>

            {/* Departure Information */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                  <p className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Departure</p>
                  <p className="text-sm sm:text-base font-semibold text-[#4E4E4E] break-words">
                    {selectedBooking.departure}
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-[#80000080] h-1.5 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(0, (selectedBooking.daysRemaining / 30) * 100))}%`,
                    }}
                  ></div>
                </div>
              </div>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 whitespace-nowrap">
                Departs in {selectedBooking.daysRemaining} {selectedBooking.daysRemaining === 1 ? "day" : "days"}
              </p>
            </div>

            {/* Seat Number */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <Image
                  src="/Seat-Icon.png"
                  alt="Seat Icon"
                  width={20}
                  height={20}
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                />
                <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Seat Number</span>
                <div className="flex gap-2 flex-wrap">
                  {selectedBooking.seats.map((seat: any, idx: number) => (
                    <div
                      key={idx}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-[#757575] rounded-lg flex items-center justify-center flex-shrink-0"
                    >
                      <span className="text-xs sm:text-sm text-white">{seat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Amenities and Download Ticket Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {selectedBooking.hasWifi && (
                  <div className="flex items-center gap-2">
                    <FaWifi className="text-green-500 w-4 h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                      Free WiFi
                    </span>
                  </div>
                )}
                {selectedBooking.hasInsurance && (
                  <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-green-500 w-4 h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                      Free Insurance
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  // TODO: Implement download ticket functionality
                  console.log("Download ticket:", selectedBooking.ticketId);
                }}
                className="bg-[#8B2323] hover:bg-[#7A1F1F] text-white px-4 py-2.5 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-lg font-semibold transition-colors text-xs sm:text-sm md:text-base shadow-sm cursor-pointer w-full sm:w-auto"
              >
                Download Ticket
              </button>
            </div>
            </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

