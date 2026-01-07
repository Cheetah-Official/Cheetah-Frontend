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
import { useGetScheduleByIdQuery } from "@/feature/schedules/scheduleApiSlice";

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

      // Calculate time remaining until departure (in minutes, hours, or days)
      let timeRemaining = "";
      let timeRemainingMinutes = 0;
      let progressPercentage = 0;
      if (departureTime && createdAt) {
        const departureMs = new Date(departureTime).getTime();
        const bookingMs = new Date(createdAt).getTime();
        const nowMs = Date.now();
        const totalDurationMs = departureMs - bookingMs; // Total time from booking to departure
        const remainingMs = departureMs - nowMs; // Time remaining until departure
        
        if (remainingMs > 0) {
          timeRemainingMinutes = Math.floor(remainingMs / (1000 * 60));
          const hours = Math.floor(timeRemainingMinutes / 60);
          const days = Math.floor(hours / 24);
          const minutes = timeRemainingMinutes % 60;
          
          if (days > 0) {
            timeRemaining = `${days} ${days === 1 ? "day" : "days"} ${hours % 24} ${hours % 24 === 1 ? "hour" : "hours"}`;
          } else if (hours > 0) {
            timeRemaining = `${hours} ${hours === 1 ? "hour" : "hours"} ${minutes} ${minutes === 1 ? "min" : "mins"}`;
          } else {
            timeRemaining = `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
          }
          
          // Calculate progress: 100% when just booked, 0% at departure
          if (totalDurationMs > 0) {
            progressPercentage = Math.max(0, Math.min(100, (remainingMs / totalDurationMs) * 100));
          }
        } else {
          timeRemaining = "Departed";
          progressPercentage = 0;
        }
      } else if (departureTime) {
        // Fallback if no booking time: use a 7-day window
        const diffMs = new Date(departureTime).getTime() - Date.now();
        if (diffMs > 0) {
          timeRemainingMinutes = Math.floor(diffMs / (1000 * 60));
          const hours = Math.floor(timeRemainingMinutes / 60);
          const days = Math.floor(hours / 24);
          const minutes = timeRemainingMinutes % 60;
          
          if (days > 0) {
            timeRemaining = `${days} ${days === 1 ? "day" : "days"} ${hours % 24} ${hours % 24 === 1 ? "hour" : "hours"}`;
          } else if (hours > 0) {
            timeRemaining = `${hours} ${hours === 1 ? "hour" : "hours"} ${minutes} ${minutes === 1 ? "min" : "mins"}`;
          } else {
            timeRemaining = `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
          }
          
          // Use 7 days as reference window
          const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
          progressPercentage = Math.max(0, Math.min(100, (diffMs / sevenDaysMs) * 100));
        } else {
          timeRemaining = "Departed";
          progressPercentage = 0;
        }
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

      // Format booking time (when ticket was booked)
      const bookingTime = createdAt
        ? new Date(createdAt).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "";

      // Extract vehicle number from various possible locations
      // Also get scheduleId for fetching schedule details
      const scheduleId = b.scheduleId || b.schedule_id;
      const vehicleNo = 
        b.vehicleNo || 
        b.vehicle?.vehicleNo || 
        b.vehicle_no ||
        b.schedule_details?.vehicleNo ||
        b.schedule_details?.vehicle?.vehicleNo ||
        b.schedule_details?.vehicleNo ||
        b.scheduleDetails?.vehicleNo ||
        b.scheduleDetails?.vehicle?.vehicleNo ||
        "";

      return {
        id: b.id,
        company: b.companyName || b.schedule_details?.companyName || "Cheetah Transport", // Will be updated from schedule
        logo: "/Logo.png",
        route: `${b.origin || ""} - ${b.destination || ""}`,
        price: b.price || 0,
        timeAgo,
        bookingTime, // When the ticket was booked
        ticketId: b.bookingRef || b.booking_reference || `#BKG-${b.id}`,
        departure: departureText,
        timeRemaining,
        timeRemainingMinutes,
        progressPercentage,
        vehicleNo,
        scheduleId, // Store scheduleId to fetch schedule details
        passengers: 1,
        seats: b.seatNumber ? [b.seatNumber] : [],
        status: (b.status || "").toUpperCase(),
        hasWifi: true,
        hasInsurance: true,
      };
    });
  }, [bookingsResponse]);

  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [scheduleDataMap, setScheduleDataMap] = useState<Map<number, any>>(new Map());

  // Get all unique schedule IDs from bookings
  const uniqueScheduleIds = useMemo(() => {
    const ids = new Set<number>();
    bookingHistory.forEach((booking: any) => {
      if (booking.scheduleId) {
        ids.add(Number(booking.scheduleId));
      }
    });
    return Array.from(ids);
  }, [bookingHistory]);

  // Fetch schedules for the first 10 bookings to populate company names
  // We'll fetch them individually and store in a map
  const schedule1Id = uniqueScheduleIds[0];
  const schedule2Id = uniqueScheduleIds[1];
  const schedule3Id = uniqueScheduleIds[2];
  const schedule4Id = uniqueScheduleIds[3];
  const schedule5Id = uniqueScheduleIds[4];
  const schedule6Id = uniqueScheduleIds[5];
  const schedule7Id = uniqueScheduleIds[6];
  const schedule8Id = uniqueScheduleIds[7];
  const schedule9Id = uniqueScheduleIds[8];
  const schedule10Id = uniqueScheduleIds[9];

  const { data: s1 } = useGetScheduleByIdQuery(schedule1Id || 0, { skip: !schedule1Id });
  const { data: s2 } = useGetScheduleByIdQuery(schedule2Id || 0, { skip: !schedule2Id });
  const { data: s3 } = useGetScheduleByIdQuery(schedule3Id || 0, { skip: !schedule3Id });
  const { data: s4 } = useGetScheduleByIdQuery(schedule4Id || 0, { skip: !schedule4Id });
  const { data: s5 } = useGetScheduleByIdQuery(schedule5Id || 0, { skip: !schedule5Id });
  const { data: s6 } = useGetScheduleByIdQuery(schedule6Id || 0, { skip: !schedule6Id });
  const { data: s7 } = useGetScheduleByIdQuery(schedule7Id || 0, { skip: !schedule7Id });
  const { data: s8 } = useGetScheduleByIdQuery(schedule8Id || 0, { skip: !schedule8Id });
  const { data: s9 } = useGetScheduleByIdQuery(schedule9Id || 0, { skip: !schedule9Id });
  const { data: s10 } = useGetScheduleByIdQuery(schedule10Id || 0, { skip: !schedule10Id });

  // Update schedule data map when schedules are fetched
  useEffect(() => {
    const newMap = new Map<number, any>();
    if (s1 && schedule1Id) newMap.set(schedule1Id, s1);
    if (s2 && schedule2Id) newMap.set(schedule2Id, s2);
    if (s3 && schedule3Id) newMap.set(schedule3Id, s3);
    if (s4 && schedule4Id) newMap.set(schedule4Id, s4);
    if (s5 && schedule5Id) newMap.set(schedule5Id, s5);
    if (s6 && schedule6Id) newMap.set(schedule6Id, s6);
    if (s7 && schedule7Id) newMap.set(schedule7Id, s7);
    if (s8 && schedule8Id) newMap.set(schedule8Id, s8);
    if (s9 && schedule9Id) newMap.set(schedule9Id, s9);
    if (s10 && schedule10Id) newMap.set(schedule10Id, s10);
    
    if (newMap.size > 0) {
      setScheduleDataMap(prev => {
        const updated = new Map(prev);
        newMap.forEach((value, key) => updated.set(key, value));
        return updated;
      });
    }
  }, [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, schedule1Id, schedule2Id, schedule3Id, schedule4Id, schedule5Id, schedule6Id, schedule7Id, schedule8Id, schedule9Id, schedule10Id]);

  // Fetch schedule details for selected booking to get vehicle number
  const scheduleId = selectedBooking?.scheduleId ? Number(selectedBooking.scheduleId) : null;
  const { data: scheduleData } = useGetScheduleByIdQuery(scheduleId!, {
    skip: !scheduleId,
  });

  // Also add selected booking's schedule to the map
  useEffect(() => {
    if (scheduleData && scheduleId) {
      setScheduleDataMap(prev => {
        const updated = new Map(prev);
        updated.set(scheduleId, scheduleData);
        return updated;
      });
    }
  }, [scheduleData, scheduleId]);

  // Update bookingHistory with schedule data
  const enrichedBookingHistory = useMemo(() => {
    return bookingHistory.map((booking: any) => {
      const scheduleDataForBooking = booking.scheduleId ? scheduleDataMap.get(Number(booking.scheduleId)) : null;
      if (scheduleDataForBooking) {
        return {
          ...booking,
          company: scheduleDataForBooking.companyName || booking.company,
          vehicleNo: scheduleDataForBooking.vehicleNo || scheduleDataForBooking.vehicle?.vehicleNo || booking.vehicleNo,
        };
      }
      return booking;
    });
  }, [bookingHistory, scheduleDataMap]);

  // Update selected booking with vehicle number and company name from schedule
  useEffect(() => {
    if (selectedBooking && scheduleData && scheduleId && selectedBooking.scheduleId === scheduleId) {
      const vehicleNo = 
        scheduleData.vehicleNo || 
        scheduleData.vehicle?.vehicleNo || 
        scheduleData.vehicle_no ||
        "";
      
      const companyName = 
        scheduleData.companyName || 
        scheduleData.company?.name ||
        "";
      
      // Always update with schedule data if available (ensures vehicle number and company name are set)
      if (vehicleNo || companyName) {
        setSelectedBooking((prev: any) => {
          if (!prev || prev.scheduleId !== scheduleId) return prev;
          const updates: any = {};
          if (vehicleNo) {
            updates.vehicleNo = vehicleNo;
          }
          if (companyName) {
            updates.company = companyName;
          }
          // Merge updates with existing booking to preserve all data
          return { ...prev, ...updates };
        });
      }
    }
  }, [scheduleData, scheduleId, selectedBooking?.scheduleId]); // Include scheduleId to track changes

  // When bookings load, set default selection
  useEffect(() => {
    if (!selectedBooking && enrichedBookingHistory.length > 0) {
      setSelectedBooking(enrichedBookingHistory[0]);
    }
  }, [enrichedBookingHistory]);

  // Prevent double-click from clearing selection and preserve schedule data
  const handleBookingClick = (booking: any) => {
    // Only update if it's a different booking
    if (selectedBooking?.id !== booking.id) {
      // If we're switching to a different booking, reset to the base booking
      // The schedule data will be fetched and merged in the useEffect
      setSelectedBooking(booking);
    }
    // If it's the same booking, do nothing (prevents clearing on double-click)
  };

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
            ) : enrichedBookingHistory.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
                You have no bookings yet.
              </div>
            ) : (
            <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar min-h-0">
              {enrichedBookingHistory.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() => handleBookingClick(booking)}
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
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">{booking.route}</p>
                        {booking.vehicleNo && (
                          <p className="text-xs text-gray-500 mb-2">Vehicle: {booking.vehicleNo}</p>
                        )}
                        <p className="text-sm sm:text-base font-bold text-green-600">
                          {formatPrice(booking.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-gray-500 whitespace-nowrap">{booking.timeAgo}</span>
                      {booking.bookingTime && (
                        <span className="text-xs text-gray-400 whitespace-nowrap">{booking.bookingTime}</span>
                      )}
                    </div>
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
              <div className="flex flex-col items-end gap-1">
              <span className="text-xs sm:text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {selectedBooking.ticketId}
              </span>
                {selectedBooking.bookingTime && (
                  <span className="text-xs text-gray-500">Booked: {selectedBooking.bookingTime}</span>
                )}
              </div>
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
                  {selectedBooking.vehicleNo && (
                    <p className="text-xs text-gray-500 mt-1">Vehicle: {selectedBooking.vehicleNo}</p>
                  )}
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
                {selectedBooking.timeRemainingMinutes > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                    <div
                      className="bg-[#8B2323] h-1.5 rounded-full transition-all"
                      style={{
                        width: `${selectedBooking.progressPercentage || 0}%`,
                      }}
                    ></div>
                  </div>
                )}
                {selectedBooking.timeRemainingMinutes <= 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                    <div
                      className="bg-gray-400 h-1.5 rounded-full"
                    style={{
                        width: "100%",
                    }}
                  ></div>
                </div>
                )}
              </div>
              {selectedBooking.timeRemaining && (
                <div className="text-right">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 whitespace-nowrap">
                    {selectedBooking.timeRemainingMinutes > 0 ? (
                      <>Departs in {selectedBooking.timeRemaining}</>
                    ) : (
                      <span className="text-gray-500">Departed</span>
                    )}
                  </p>
                </div>
              )}
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

