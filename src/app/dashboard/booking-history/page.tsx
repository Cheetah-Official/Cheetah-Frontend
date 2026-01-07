"use client";

import Image from "next/image";
import { FaChevronLeft, FaCheckCircle, FaWifi, FaShieldAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";

// Mock booking history data - replace with API call
const bookingHistory = [
  {
    id: 1,
    company: "Chisco",
    logo: "/CHISCO.png",
    route: "Lagos - Abuja",
    price: 64000,
    timeAgo: "30 Mins ago",
    ticketId: "#CH-992831",
    departure: "08:30 AM, July 28th, 2025",
    daysRemaining: 4,
    passengers: 2,
    seats: [6, 7],
    status: "Confirmed",
    hasWifi: true,
    hasInsurance: true,
  },
  {
    id: 2,
    company: "Peace Mass",
    logo: "/PeaceMass-Logo.jpg",
    route: "Awka - Lagos",
    price: 32000,
    timeAgo: "14 Days ago",
    ticketId: "#PM-882145",
    departure: "10:00 AM, July 14th, 2025",
    daysRemaining: 0,
    passengers: 1,
    seats: [12],
    status: "Completed",
    hasWifi: true,
    hasInsurance: true,
  },
];

export default function BookingHistoryPage() {
  const router = useRouter();
  const [selectedBooking, setSelectedBooking] = useState(bookingHistory[0]);

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
        onLogout={() => router.push("/signin")}
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
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex-shrink-0">History</h2>
            <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar min-h-0">
              {bookingHistory.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedBooking.id === booking.id
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
          </div>

          {/* Right Column - Ticket Details */}
          <div className="bg-[#F2F2F2] rounded-xl p-4 sm:p-6 shadow-sm">
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
                  {selectedBooking.seats.map((seat, idx) => (
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
                    <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">Free WiFi</span>
                  </div>
                )}
                {selectedBooking.hasInsurance && (
                  <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-green-500 w-4 h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">Free Insurance</span>
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
        </div>
      </main>
    </div>
  );
}

