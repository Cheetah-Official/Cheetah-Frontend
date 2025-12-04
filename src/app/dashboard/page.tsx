"use client";

import Image from "next/image";
import {
  FaBus,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaChevronRight,
  FaChevronLeft,
  FaUser,
  FaWifi,
  FaCheckCircle,
  FaExclamationTriangle,
  FaDownload,
  FaBars,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaHome,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { bookingsApi } from "@/lib/api/endpoints/bookings";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

const companies = [
  { name: "Peace Mass", logo: "/PeaceMass-Logo.jpg" },
  { name: "GIGM", logo: "/GIGMotors_Logo 1.png" },
  { name: "GUO", logo: "/GUO.png" },
  { name: "Chisco", logo: "/CHISCO.png" },
];

export default function DashboardPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [activeTab, setActiveTab] = useState("transports");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, error, signOut } = useAuth();

  // Format current date as DD/MM/YYYY
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Set default dates on component mount
  useEffect(() => {
    // Don't set default dates - let placeholders show
    setDeparture("");
    setReturnDate("");
  }, []);

  // Redirect unauthenticated users to signin
  useEffect(() => {
    if (!loading && user) {
      router.replace("/signin");
    }
  }, [loading, user, router]);

  // Pick up tab from query param for deep links (support legacy 'notifications' -> 'activity')
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      if (["transports", "activity", "settings"].includes(tab)) {
        setActiveTab(tab);
      } else if (tab === "notifications") {
        setActiveTab("activity");
      }
    }
  }, [searchParams]);

  // Activity: fetch user's bookings to populate Activity tab
  const {
    data: userBookings,
    isLoading: loadingBookings,
    refetch: refetchUserBookings,
  } = useQuery({
    queryKey: ["userBookings"],
    queryFn: () => bookingsApi.getUserBookings({ limit: 20, offset: 0 }),
    enabled: !!user,
  });

  // Ensure bookings refresh immediately when auth state changes
  useEffect(() => {
    if (user) {
      refetchUserBookings();
    }
  }, [user, refetchUserBookings]);

  // Provider statistics for Transports tab
  const { data: providerStats } = useQuery({
    queryKey: ["providerStatistics-dashboard"],
    queryFn: () => bookingsApi.getProviderStatistics(),
  });

  // Choose an active (latest upcoming) booking for the Activity left panel and Trip Progress
  const activeBooking = (() => {
    if (!userBookings || userBookings.length === 0) return null;
    const parseTime = (b: any) =>
      new Date(
        b.schedule_details?.departure_time || b.departure_time || 0,
      ).getTime();
    const now = Date.now();
    const future = userBookings
      .filter((b: any) => parseTime(b) >= now)
      .sort((a: any, b: any) => parseTime(a) - parseTime(b));
    if (future.length > 0) return future[0];
    // else pick most recent past
    return userBookings
      .slice()
      .sort((a: any, b: any) => parseTime(b) - parseTime(a))[0];
  })();

  // Handle date input formatting
  const handleDateChange = (value: string, setDate: (date: string) => void) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, "");

    // Format as DD/MM/YYYY
    let formatted = numbers;
    if (numbers.length >= 2) {
      formatted = numbers.slice(0, 2) + "/" + numbers.slice(2);
    }
    if (numbers.length >= 4) {
      formatted =
        numbers.slice(0, 2) +
        "/" +
        numbers.slice(2, 4) +
        "/" +
        numbers.slice(4, 8);
    }

    // Limit to 10 characters (DD/MM/YYYY)
    if (formatted.length <= 10) {
      setDate(formatted);
    }
  };

  const handleProceed = () => {
    if (!from || !to || !departure) {
      // Lightweight validation for demo purposes
      alert("Please select From, To and Departure date");
      return;
    }
    const params = new URLSearchParams({
      from,
      to,
      departure,
      returnDate,
      passengers: String(passengers),
    });
    router.push(`/compare/result?${params.toString()}`);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } finally {
      router.replace("/signin");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F9F9F9]">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 sm:w-80 md:w-64 lg:w-56 xl:w-64 2xl:w-72 bg-white border-r flex flex-col justify-between py-4 sm:py-6 md:py-8 px-3 sm:px-4 min-h-screen transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-8 sm:mb-10 md:mb-12">
            <Image
              src="/Cheetah 2.svg"
              alt="Cheetah"
              width={100}
              height={38}
              className="sm:w-[120px] sm:h-[45px]"
            />
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaTimes className="text-gray-600 w-5 h-5" />
            </button>
          </div>
          <nav className="space-y-2">
            <button
              className={`flex items-center w-full px-3 py-2.5 sm:py-3 rounded-lg font-semibold gap-3 cursor-pointer transition-colors text-sm sm:text-base ${
                activeTab === "transports"
                  ? "bg-[#8B2323] text-white"
                  : "text-[#8B2323] hover:bg-[#8B2323]/10"
              }`}
              onClick={() => {
                setActiveTab("transports");
                setMobileMenuOpen(false);
              }}
            >
              <FaBus className="w-4 h-4 sm:w-5 sm:h-5" /> Transports
            </button>

            <button
              onClick={() => router.push("/dashboard/transport")}
              className="flex items-center w-full px-3 py-2.5 sm:py-3 rounded-lg font-semibold gap-3 cursor-pointer transition-colors text-sm sm:text-base text-[#8B2323] hover:bg-[#8B2323]/10"
            >
              <FaBus className="w-4 h-4 sm:w-5 sm:h-5" /> Transport Manager
            </button>
            <button
              className={`flex items-center w-full px-3 py-2.5 sm:py-3 rounded-lg font-semibold gap-3 cursor-pointer transition-colors text-sm sm:text-base ${
                activeTab === "activity"
                  ? "bg-[#8B2323] text-white"
                  : "text-[#8B2323] hover:bg-[#8B2323]/10"
              }`}
              onClick={() => {
                setActiveTab("activity");
                setMobileMenuOpen(false);
              }}
            >
              <FaBell className="w-4 h-4 sm:w-5 sm:h-5" /> Activity
            </button>
            <button
              className={`flex items-center w-full px-3 py-2.5 sm:py-3 rounded-lg font-semibold gap-3 cursor-pointer transition-colors text-sm sm:text-base ${
                activeTab === "settings"
                  ? "bg-[#8B2323] text-white"
                  : "text-[#8B2323] hover:bg-[#8B2323]/10"
              }`}
              onClick={() => {
                setActiveTab("settings");
                setMobileMenuOpen(false);
              }}
            >
              <FaCog className="w-4 h-4 sm:w-5 sm:h-5" /> Settings
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-[#8B2323] mt-6 sm:mt-8 cursor-pointer text-sm sm:text-base"
        >
          <FaSignOutAlt className="w-4 h-4 sm:w-5 sm:h-5" /> Log out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 w-full">
        {loading && (
          <div className="text-center text-gray-600">Loading dashboard...</div>
        )}
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 md:hidden">
          <button
            className="p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(true)}
          >
            <FaBars className="text-gray-600 w-5 h-5" />
          </button>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#8B2323]">
            <Image
              src="/Hero-2.jpeg"
              alt="User"
              width={32}
              height={32}
              className="sm:w-10 sm:h-10"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-[#8B2323]/80 flex items-center gap-2">
            <span className="text-[#E08B2F] text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
              👋
            </span>{" "}
            Welcome,{" "}
            <span className="font-bold">{user ? user.first_name : ""}</span>
          </h2>
          <div className="hidden md:block w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full overflow-hidden border-2 border-[#8B2323]">
            <Image
              src="/Hero-2.jpeg"
              alt="User"
              width={40}
              height={40}
              className="lg:w-12 lg:h-12 xl:w-14 xl:h-14"
            />
          </div>
        </div>

        {/* Transports Tab */}
        {activeTab === "transports" && (
          <div className="bg-[#F6F6F6] rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col gap-3 sm:gap-4 md:gap-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-start gap-2 w-full sm:w-auto">
                <span className="text-gray-500 text-xs sm:text-sm md:text-base">
                  From
                </span>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="px-2 sm:px-3 md:px-4 py-2 rounded-lg border bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] cursor-pointer w-full sm:w-auto text-sm sm:text-base"
                >
                  <option value="">Select City</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Kano">Kano</option>
                </select>
              </div>
              <FaChevronRight className="text-gray-400 mx-2 hidden sm:block" />
              <div className="flex flex-col sm:flex-row items-start gap-2 w-full sm:w-auto">
                <span className="text-gray-500 text-xs sm:text-sm md:text-base">
                  To
                </span>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="px-2 sm:px-3 md:px-4 py-2 rounded-lg border bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] cursor-pointer w-full sm:w-auto text-sm sm:text-base"
                >
                  <option value="">Select City</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Kano">Kano</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-2 w-full sm:w-auto sm:ml-4">
                <span className="text-gray-500 text-xs sm:text-sm md:text-base">
                  Departure Date
                </span>
                <input
                  type="date"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="px-2 sm:px-3 md:px-4 py-2 rounded-lg border bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] w-full sm:w-28 md:w-32 font-medium text-sm sm:text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-2 w-full sm:w-auto sm:ml-4">
                <span className="text-gray-500 text-xs sm:text-sm md:text-base">
                  Return Date{" "}
                  <span className="text-xs text-[#E08B2F]">
                    (if round trip)
                  </span>
                </span>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="px-2 sm:px-3 md:px-4 py-2 rounded-lg border bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] w-full sm:w-28 md:w-32 font-medium text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Companies and Bus */}
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-start">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 flex-1">
                {(Array.isArray((providerStats as any)?.providers) &&
                (providerStats as any).providers.length > 0
                  ? (providerStats as any).providers.map((p: any) => ({
                      name: p.provider_name || p.name || "Provider",
                      logo: "/Logo.png",
                    }))
                  : companies
                )
                  .slice(0, 6)
                  .map((company: any) => (
                    <button
                      key={company.name}
                      className="flex items-center gap-2 sm:gap-3 bg-white rounded-lg shadow-sm px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 cursor-pointer border border-transparent hover:border-[#8B2323] transition"
                    >
                      <Image
                        src={company.logo}
                        alt={company.name}
                        width={28}
                        height={28}
                        className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain"
                      />
                      <span className="font-semibold text-[#222] text-xs sm:text-sm md:text-base">
                        {company.name}
                      </span>
                    </button>
                  ))}
              </div>
              <div className="flex-shrink-0 relative mt-6 sm:mt-8 lg:mt-16 self-center lg:self-start">
                {/* Passenger Counter positioned in upper-right above bus */}
                <div className="absolute -top-10 sm:-top-12 md:-top-16 -right-1 sm:-right-2 md:-right-4 bg-gray-100 rounded-lg shadow-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border border-gray-200">
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                    <span className="text-gray-600 font-medium text-xs sm:text-sm">
                      Passenger
                    </span>
                    <div className="flex items-center bg-gray-200 rounded-lg border border-gray-300">
                      <button
                        type="button"
                        className="px-1.5 sm:px-2 md:px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-300 transition-colors text-xs sm:text-sm"
                        onClick={() => setPassengers((p) => Math.max(1, p - 1))}
                      >
                        -
                      </button>
                      <span className="px-1.5 sm:px-2 md:px-4 py-1 font-bold text-black text-xs sm:text-sm">
                        {passengers}
                      </span>
                      <button
                        type="button"
                        className="px-1.5 sm:px-2 md:px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-300 transition-colors text-xs sm:text-sm"
                        onClick={() => setPassengers((p) => p + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <Image
                  src="/Cheetah Bus Image 1.png"
                  alt="Cheetah Bus"
                  width={200}
                  height={120}
                  className="w-48 h-28 sm:w-56 sm:h-32 md:w-64 md:h-36 lg:w-[300px] lg:h-[180px] xl:w-[350px] xl:h-[200px] object-contain"
                />
              </div>
            </div>

            {/* Proceed Button */}
            <div className="flex justify-center lg:justify-end mt-3 sm:mt-4 lg:mt-2">
              <button
                onClick={handleProceed}
                className="bg-[#8B2323] text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base md:text-lg cursor-pointer w-full sm:w-auto"
              >
                Proceed
              </button>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Panel - Settings Categories */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Settings
              </h3>

              {/* Account Settings - Active */}
              <div className="bg-gray-100 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">
                    Account Settings
                  </span>
                  <FaChevronRight className="text-gray-500" />
                </div>
              </div>

              {/* General Settings */}
              <div className="bg-gray-100 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">
                    General Settings
                  </span>
                  <FaChevronRight className="text-gray-500" />
                </div>
              </div>

              {/* Help & Support */}
              <div className="bg-gray-100 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">
                    Help & Support
                  </span>
                  <FaChevronRight className="text-gray-500" />
                </div>
              </div>

              {/* Terms & Policies */}
              <div className="bg-gray-100 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">
                    Terms & Policies
                  </span>
                  <FaChevronRight className="text-gray-500" />
                </div>
              </div>
            </div>

            {/* Right Panel - User Profile */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                {/* Large Profile Picture */}
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-gray-200">
                  <Image
                    src="/Hero-2.jpeg"
                    alt="User Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* User Name */}
                <h3 className="text-xl font-semibold text-gray-800">
                  {user ? `${user.first_name} ${user.last_name}` : ""}
                </h3>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaEnvelope className="text-gray-500 w-5 h-5" />
                  <span className="text-gray-700">{user?.email || ""}</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaPhone className="text-gray-500 w-5 h-5" />
                  <span className="text-gray-700">{user?.phone ?? ""}</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaHome className="text-gray-500 w-5 h-5" />
                  <span className="text-gray-700">&nbsp;</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Left Column - Narrow */}
            <div className="w-full lg:w-1/3 space-y-3 sm:space-y-4">
              {/* Ticket Details Card */}
              <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
                  Ticket Details
                </h3>

                {/* Company and Passenger Info */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Image
                      src="/CHISCO.png"
                      alt="Provider"
                      width={36}
                      height={36}
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
                    />
                    <div>
                      <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                        {activeBooking?.schedule_details?.provider_name ||
                          activeBooking?.provider_name ||
                          "—"}
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                        {activeBooking
                          ? `${activeBooking.schedule_details?.origin || activeBooking.origin || "-"} - ${activeBooking.schedule_details?.destination || activeBooking.destination || "-"}`
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                    <span className="text-gray-800 font-medium text-xs sm:text-sm">
                      {activeBooking?.passenger_count ??
                        activeBooking?.passengers?.length ??
                        0}{" "}
                      Passenger(s)
                    </span>
                  </div>
                </div>

                {/* Departure Date and Progress */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span className="text-gray-500 text-xs sm:text-sm md:text-base">
                        Departure
                      </span>
                      <span className="text-gray-800 font-bold text-xs sm:text-sm md:text-base">
                        {activeBooking?.schedule_details?.departure_time
                          ? new Date(
                              activeBooking.schedule_details.departure_time,
                            ).toLocaleString()
                          : "—"}
                      </span>
                    </div>
                    <span className="text-gray-800 font-bold text-xs sm:text-sm md:text-base">
                      {activeBooking ? "" : "—"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <div
                      className="bg-[#8B2323] h-1.5 sm:h-2 rounded-full"
                      style={{ width: activeBooking ? "60%" : "0%" }}
                    ></div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-6 mb-4 sm:mb-6">
                  {(
                    activeBooking?.schedule_details?.amenities || [
                      "Free WiFi",
                      "Insurance",
                    ]
                  )
                    .slice(0, 2)
                    .map((label: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-green-500 text-base sm:text-lg">
                          ✓
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm">
                          {label}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Download Button */}
                <div className="flex justify-center lg:justify-end">
                  <button
                    className="bg-[#8B2323] text-white py-2.5 sm:py-3 px-4 sm:px-6 md:px-8 rounded-lg font-semibold hover:bg-[#7A1F1F] transition-colors w-full sm:w-auto text-sm sm:text-base disabled:bg-gray-300 disabled:text-gray-600"
                    disabled={!activeBooking?.schedule_details?.schedule_id}
                    onClick={() =>
                      activeBooking?.schedule_details?.schedule_id &&
                      router.push(
                        `/bookings/${encodeURIComponent(activeBooking.schedule_details.schedule_id)}?passengers=${encodeURIComponent(activeBooking.passenger_count ?? activeBooking.passengers?.length ?? 1)}`,
                      )
                    }
                  >
                    {activeBooking ? "View Ticket" : "Download Ticket"}
                  </button>
                </div>
              </div>

              {/* Activity List Card */}
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
                  Activity
                </h3>
                <div className="space-y-2 sm:space-y-3 max-h-48 overflow-y-auto">
                  {loadingBookings && (
                    <div className="text-gray-600 text-sm">
                      Loading recent activity…
                    </div>
                  )}
                  {!loadingBookings &&
                    (!userBookings || userBookings.length === 0) && (
                      <div className="text-gray-600 text-sm">
                        No recent activity.
                      </div>
                    )}
                  {!loadingBookings &&
                    userBookings &&
                    userBookings.slice(0, 10).map((bk: any) => {
                      const scheduleId =
                        bk.schedule_id ||
                        bk.schedule_details?.schedule_id ||
                        "";
                      const provider =
                        bk.schedule_details?.provider_name ||
                        bk.provider_name ||
                        "Provider";
                      const origin =
                        bk.schedule_details?.origin || bk.origin || "-";
                      const destination =
                        bk.schedule_details?.destination ||
                        bk.destination ||
                        "-";
                      const dep =
                        bk.schedule_details?.departure_time ||
                        bk.departure_time;
                      const dateLabel = dep
                        ? new Date(dep).toLocaleString()
                        : "";
                      const status = (
                        bk.booking_status ||
                        bk.status ||
                        ""
                      ).toString();
                      const passengers =
                        bk.passenger_count ?? bk.passengers?.length ?? "-";
                      const statusColor = status
                        .toLowerCase()
                        .includes("confirm")
                        ? "text-green-600"
                        : status.toLowerCase().includes("cancel")
                          ? "text-red-600"
                          : "text-yellow-600";
                      return (
                        <div
                          key={bk.booking_id || bk.booking_reference}
                          className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg"
                        >
                          <FaCheckCircle
                            className={`${statusColor} w-3 h-3 sm:w-4 sm:h-4 mt-0.5 sm:mt-1 flex-shrink-0`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                                {provider} — {origin} → {destination}
                              </span>
                              <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                {dateLabel}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <span className={`font-medium ${statusColor}`}>
                                {status || "Pending"}
                              </span>
                              <span>•</span>
                              <span>{passengers} passenger(s)</span>
                              {bk.booking_reference && (
                                <>
                                  <span>•</span>
                                  <span>Ref: {bk.booking_reference}</span>
                                </>
                              )}
                            </div>
                          </div>
                          {scheduleId && (
                            <button
                              className="text-[#8B2323] text-xs sm:text-sm font-semibold hover:underline cursor-pointer"
                              onClick={() =>
                                router.push(
                                  `/bookings/${encodeURIComponent(scheduleId)}?passengers=${encodeURIComponent(passengers || 1)}`,
                                )
                              }
                            >
                              View
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Right Column - Wide */}
            <div className="w-full lg:w-2/3 space-y-3 sm:space-y-4">
              {/* Trip Progress Card */}
              <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
                  Trip Progress
                </h3>

                {/* Progress Steps (driven by active booking) */}
                <div className="space-y-4 sm:space-y-6">
                  {(() => {
                    const steps = [] as Array<{
                      title: string;
                      at?: string | null;
                      done: boolean;
                    }>;
                    const bookedAt =
                      (activeBooking as any)?.created_at ||
                      (activeBooking as any)?.booking_time ||
                      null;
                    const paymentDone = (
                      (activeBooking as any)?.payment_status || ""
                    )
                      .toLowerCase()
                      .includes("paid");
                    const depTime =
                      (activeBooking as any)?.schedule_details
                        ?.departure_time || null;
                    const arrTime =
                      (activeBooking as any)?.schedule_details?.arrival_time ||
                      null;
                    steps.push({
                      title: "Ticket Booked",
                      at: bookedAt,
                      done: Boolean(activeBooking),
                    });
                    steps.push({
                      title: "Payment Confirmed",
                      at: paymentDone ? bookedAt : null,
                      done: paymentDone,
                    });
                    steps.push({ title: "Boarding", at: depTime, done: false });
                    steps.push({
                      title: "Departure",
                      at: depTime,
                      done: false,
                    });
                    steps.push({ title: "Arrival", at: arrTime, done: false });

                    return steps.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 sm:gap-4">
                        <div
                          className={`w-6 h-6 sm:w-8 sm:h-8 ${s.done ? "bg-[#8B2323] text-white" : "bg-gray-300 text-gray-600"} rounded-full flex items-center justify-center font-bold text-xs sm:text-sm`}
                        >
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                            {s.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {s.at ? new Date(s.at).toLocaleString() : "—"}
                          </p>
                        </div>
                        {s.done ? (
                          <FaCheckCircle className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded-full" />
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Amenities Card */}
              <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
                  Trip Amenities
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <FaWifi className="text-[#8B2323] w-4 h-4 sm:w-5 sm:h-5" />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                        Free WiFi
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        High-speed internet access
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <FaDownload className="text-[#8B2323] w-4 h-4 sm:w-5 sm:h-5" />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                        Free Insurance
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Comprehensive travel coverage
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <FaUser className="text-[#8B2323] w-4 h-4 sm:w-5 sm:h-5" />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                        Professional Driver
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Experienced and certified
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <FaCheckCircle className="text-[#8B2323] w-4 h-4 sm:w-5 sm:h-5" />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                        Safety First
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Regular maintenance checks
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
