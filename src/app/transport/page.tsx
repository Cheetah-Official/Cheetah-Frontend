"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { FaChevronRight, FaExchangeAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentAccessToken, selectCurrentUser } from "@/feature/authentication/authSlice";
import { useGetAuthenticatedUserQuery } from "@/feature/auth/authApiSlice";
import { useGetTripsByCompanyQuery } from "@/feature/trips/tripApiSlice";
import { useGetVehiclesByCompanyQuery } from "@/feature/vehicles/vehicleApiSlice";
import { useGetPaginatedSchedulesByStatusQuery } from "@/feature/schedules/scheduleApiSlice";
import { useGetBookingsByScheduleQuery } from "@/feature/bookings/bookingApiSlice";
import { useGetDailyAnalyticsQuery } from "@/feature/analytics/analyticsApiSlice";

// Component to fetch bookings for a single schedule
function ScheduleBookings({ scheduleId, children }: { scheduleId: number; children: (data: { adults: number; children: number; total: number }) => React.ReactNode }) {
  const { data: bookingsData } = useGetBookingsByScheduleQuery(
    { scheduleId, page: 0, size: 100 },
    { skip: !scheduleId }
  );

  const bookings = bookingsData?.content || bookingsData || [];
  const passengerCounts = bookings.reduce(
    (acc: { adults: number; children: number; total: number }, booking: any) => {
      const adults = booking.numberOfAdults || 0;
      const children = booking.numberOfChildren || 0;
      return {
        adults: acc.adults + adults,
        children: acc.children + children,
        total: acc.total + adults + children,
      };
    },
    { adults: 0, children: 0, total: 0 }
  );

  return <>{children(passengerCounts)}</>;
}

export default function TransportDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const accessToken = useSelector(selectCurrentAccessToken);
  const reduxUser = useSelector(selectCurrentUser);
  const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const hasToken = !!(accessToken || localStorageToken);
  
  const { data: authUser, isFetching: authUserFetching, error: authUserError } = useGetAuthenticatedUserQuery(undefined, {
    skip: !hasToken,
  });

  useEffect(() => {
    if (authUserError && (authUserError as any)?.status === 401) {
      dispatch(logOut());
      router.replace("/transport-signin");
    }
  }, [authUserError, dispatch, router]);

  // Get company ID from authenticated user or Redux state
  const companyId = authUser?.companyId || authUser?.id || authUser?.userId || reduxUser?.companyId || reduxUser?.id || reduxUser?.userId;
  
  // Use state to prevent hydration mismatch for company name and code
  const [companyName, setCompanyName] = useState("Transport Company");
  const [companyCode, setCompanyCode] = useState("");
  
  // Update company name after mount to prevent hydration mismatch
  useEffect(() => {
    const name = authUser?.companyName || reduxUser?.companyName || "Transport Company";
    const code = authUser?.companyCode || reduxUser?.companyCode || "";
    setCompanyName(name);
    setCompanyCode(code);
  }, [authUser?.companyName, reduxUser?.companyName, authUser?.companyCode, reduxUser?.companyCode]);

  // Fetch data from APIs
  const { data: tripsData, isLoading: tripsLoading } = useGetTripsByCompanyQuery(Number(companyId), {
    skip: !hasToken || !companyId,
  });

  const { data: vehiclesData, isLoading: vehiclesLoading } = useGetVehiclesByCompanyQuery(Number(companyId), {
    skip: !hasToken || !companyId,
  });

  const { data: schedulesData, isLoading: schedulesLoading } = useGetPaginatedSchedulesByStatusQuery(
    { status: "OPEN", companyId: Number(companyId), page: 0, size: 50 },
    { skip: !hasToken || !companyId }
  );

  // Get today's date for analytics
  const today = new Date().toISOString().split('T')[0];
  const { data: analyticsData, isLoading: analyticsLoading } = useGetDailyAnalyticsQuery(
    { companyId: Number(companyId), date: today },
    { skip: !hasToken || !companyId }
  );

  // Extract data from API responses
  const trips = tripsData || [];
  const vehicles = vehiclesData || [];
  const schedules = schedulesData?.content || schedulesData || [];
  
  // Get unique cities from trips for route selection
  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    trips.forEach((trip: any) => {
      if (trip.origin) cities.add(trip.origin);
      if (trip.destination) cities.add(trip.destination);
    });
    return Array.from(cities).sort();
  }, [trips]);

  // State for price management
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | "">("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [busFare, setBusFare] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);

  // Initialize from/to with first available cities
  useEffect(() => {
    if (uniqueCities.length > 0 && !from) {
      setFrom(uniqueCities[0]);
      if (uniqueCities.length > 1) {
        setTo(uniqueCities[1]);
      }
    }
  }, [uniqueCities, from]);

  // Find matching trip for selected route
  const selectedTrip = useMemo(() => {
    if (!from || !to) return null;
    return trips.find((trip: any) => 
      trip.origin === from && trip.destination === to
    );
  }, [trips, from, to]);

  // Find matching schedule for price management
  useEffect(() => {
    if (selectedTrip && selectedVehicleId) {
      const schedule = schedules.find((s: any) => 
        s.tripId === selectedTrip.id && s.vehicleId === selectedVehicleId
      );
      if (schedule) {
        setSelectedScheduleId(schedule.id);
        setBusFare(schedule.price?.toLocaleString() || "");
      } else {
        setSelectedScheduleId(null);
        setBusFare(selectedTrip.amount?.toLocaleString() || "");
      }
    } else if (selectedTrip) {
      setBusFare(selectedTrip.amount?.toLocaleString() || "");
    }
  }, [selectedTrip, selectedVehicleId, schedules]);

  // Format schedules for trips table - using available seats calculation as fallback
  // Actual passenger counts will be fetched per schedule in the table component
  const formattedTrips = useMemo(() => {
    return schedules.slice(0, 20).map((schedule: any, index: number) => {
      const trip = trips.find((t: any) => t.id === schedule.tripId);
      const vehicle = vehicles.find((v: any) => v.id === schedule.vehicleId);
      const totalSeats = vehicle?.capacity || 0;
      const bookedSeats = totalSeats - (schedule.availableSeats || 0);
      
      return {
        id: schedule.id,
        scheduleId: schedule.id,
        busNo: `${index + 1}.`,
        route: trip ? `${trip.origin} - ${trip.destination}` : "N/A",
        departureDate: schedule.departureTime 
          ? new Date(schedule.departureTime).toLocaleDateString('en-GB', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            }).replace(/ /g, ' - ')
          : "N/A",
        // Fallback calculation (will be replaced with actual booking data)
        passengers: `${bookedSeats} / ${totalSeats} Seats`,
        totalSeats,
        bookedSeats,
      };
    });
  }, [schedules, trips, vehicles]);

  // Calculate statistics
  const totalPassengers = useMemo(() => {
    return schedules.reduce((total: number, schedule: any) => {
      const vehicle = vehicles.find((v: any) => v.id === schedule.vehicleId);
      const totalSeats = vehicle?.capacity || 0;
      const bookedSeats = totalSeats - (schedule.availableSeats || 0);
      return total + bookedSeats;
    }, 0);
  }, [schedules, vehicles]);

  // Get analytics statistics
  const analyticsStats = analyticsData || {};
  const displayPassengers = analyticsStats.totalPassengers || totalPassengers || 0;

  const handleSwapCities = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSaveChanges = async () => {
    if (!selectedScheduleId || !busFare) {
      alert("Please select a vehicle and route, and enter a fare amount.");
      return;
    }

    // TODO: Implement schedule price update API call
    // For now, just show success message
    alert("Price updated successfully!");
  };

  return (
    <main className="flex-1 bg-[#F3F3F3]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-2xl">👋</span>
          <h1 className="text-xl font-medium">
            {authUserFetching ? "Loading..." : `Welcome ${companyName}`}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {companyCode && (
            <span className="text-gray-600 text-sm">{companyCode}</span>
          )}
          <div className="w-10 h-10 rounded-full bg-[#8B2323] flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {companyName.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 4)}
            </span>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="p-8 bg-[#F3F3F3]">
        {/* Grid Layout: 3 columns, 2 rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Passengers Card - Row 1, Col 1 */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-gray-600 text-sm font-medium">
                Total Passengers Insured
              </h3>
              <FaChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-4">
              {analyticsLoading ? "Loading..." : displayPassengers.toLocaleString()}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {analyticsStats.passengerGrowthMonth && (
                <>
                  <span className={`inline-flex items-center px-2 py-1 ${
                    analyticsStats.passengerGrowthMonth > 0 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  } text-xs font-medium rounded`}>
                    {analyticsStats.passengerGrowthMonth > 0 ? "+" : ""}
                    {analyticsStats.passengerGrowthMonth?.toFixed(1)}%
                  </span>
                  <span className="text-gray-500 text-xs">vs Last month</span>
                </>
              )}
              {analyticsStats.passengerGrowthWeek && (
                <>
                  <span className={`inline-flex items-center px-2 py-1 ${
                    analyticsStats.passengerGrowthWeek > 0 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  } text-xs font-medium rounded`}>
                    {analyticsStats.passengerGrowthWeek > 0 ? "+" : ""}
                    {analyticsStats.passengerGrowthWeek?.toFixed(1)}%
                  </span>
                  <span className="text-gray-500 text-xs">vs Last week</span>
                </>
              )}
            </div>
          </div>

          {/* Active Wi-Fi Card - Row 1, Col 2 */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-gray-600 text-sm font-medium">
                Active Wi-Fi Code Used
              </h3>
              <FaChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-4">
              {analyticsLoading ? "Loading..." : (analyticsStats.wifiCodesUsed || 0).toLocaleString()}
            </p>
            <div className="flex items-center gap-3">
              {analyticsStats.wifiGrowthWeek && (
                <>
                  <span className={`inline-flex items-center px-2 py-1 ${
                    analyticsStats.wifiGrowthWeek > 0 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  } text-xs font-medium rounded`}>
                    {analyticsStats.wifiGrowthWeek > 0 ? "+" : ""}
                    {analyticsStats.wifiGrowthWeek?.toFixed(1)}%
                  </span>
                  <span className="text-gray-500 text-xs">vs Last week</span>
                </>
              )}
            </div>
          </div>

          {/* Price Management Card - Row 1 & 2, Col 3 (spans 2 rows) */}
          <div className="bg-white rounded-xl p-6 flex flex-col shadow-md md:row-span-2 h-full">
            <h3 className="text-gray-900 text-base font-bold mb-8">
              Price Management
            </h3>
            
            <div className="flex flex-col flex-1 justify-between space-y-6">
              {/* Bus Selection */}
              <div>
                <div className="relative inline-block">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 pointer-events-none">
                    Bus
                  </div>
                  <select
                    id="bus-seats"
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value ? Number(e.target.value) : "")}
                    className="w-auto min-w-[220px] pl-12 pr-8 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] cursor-pointer"
                    aria-label="Select vehicle"
                    disabled={vehiclesLoading || vehicles.length === 0}
                  >
                    <option value="" className="text-gray-900">Select Vehicle</option>
                    {vehicles.map((vehicle: any) => (
                      <option key={vehicle.id} value={vehicle.id} className="text-gray-900">
                        {vehicle.vehicleNo} ({vehicle.capacity} Seats)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Route Selection */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">Route Selection</label>
                <div className="flex flex-col items-start space-y-2">
                  <select
                    id="from-city"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-[180px] px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] cursor-pointer"
                    aria-label="Select departure city"
                    disabled={tripsLoading || uniqueCities.length === 0}
                  >
                    <option value="" className="text-gray-900">Select Origin</option>
                    {uniqueCities.map((city) => (
                      <option key={city} value={city} className="text-gray-900">
                        {city}
                      </option>
                    ))}
                  </select>
                  <div className="w-[180px] flex justify-center">
                    <button
                      onClick={handleSwapCities}
                      className="p-1 text-orange-700 hover:text-orange-800 transition-colors cursor-pointer"
                      aria-label="Swap cities"
                      disabled={!from || !to}
                    >
                      <FaExchangeAlt className="w-4 h-4" />
                    </button>
                  </div>
                  <select
                    id="to-city"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-[180px] px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] cursor-pointer"
                    aria-label="Select destination city"
                    disabled={tripsLoading || uniqueCities.length === 0}
                  >
                    <option value="" className="text-gray-900">Select Destination</option>
                    {uniqueCities.filter(city => city !== from).map((city) => (
                      <option key={city} value={city} className="text-gray-900">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bus Fare */}
              <div className="mt-6">
                <div className="relative inline-block">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 pointer-events-none">
                    Bus Fare
                  </div>
                  <input
                    type="text"
                    value={busFare}
                    onChange={(e) => setBusFare(e.target.value)}
                    className="w-auto max-w-[200px] pl-20 pr-3 py-3 bg-white border border-gray-300 rounded-lg text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323]"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Save Changes Button - Pushed to bottom, aligned right */}
              <div className="mt-auto pt-4 flex justify-end">
                <button
                  onClick={handleSaveChanges}
                  className="bg-[#8B2323] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#7A1F1F] transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Trips Table - Row 2, Col 1 & 2 (spans 2 columns) */}
          <div className="md:col-span-2 bg-white rounded-xl overflow-hidden shadow-md flex flex-col">
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg font-medium text-gray-900">
                Trips & Passengers Data
              </h2>
            </div>

            <div className="overflow-x-auto overflow-y-auto h-[400px]">
              <table className="w-full">
                <thead className="bg-[#E0E0E0] sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                      Bus No.
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                      Departure Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                      Passengers
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {schedulesLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        Loading schedules...
                      </td>
                    </tr>
                  ) : formattedTrips.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No schedules found. Create schedules in the Buses & Routes page.
                      </td>
                    </tr>
                  ) : (
                    formattedTrips.map((trip: any) => (
                      <ScheduleBookings key={trip.id} scheduleId={trip.scheduleId}>
                        {({ adults, children, total }) => {
                          const passengerText = 
                            children > 0 
                              ? `${children} ${children === 1 ? 'Child' : 'Children'} / ${adults} ${adults === 1 ? 'Adult' : 'Adults'}`
                              : `${total} ${total === 1 ? 'Adult' : 'Adults'}`;
                          const displayText = total > 0 
                            ? passengerText 
                            : `${trip.bookedSeats} / ${trip.totalSeats} Seats`;
                          
                          return (
                            <tr className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {trip.busNo}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {trip.route}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {trip.departureDate}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {displayText}
                              </td>
                            </tr>
                          );
                        }}
                      </ScheduleBookings>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}