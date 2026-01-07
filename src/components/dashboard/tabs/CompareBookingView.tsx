import Image from "next/image"
import { FaCalendarAlt, FaArrowLeft, FaClock, FaMapMarkerAlt } from "react-icons/fa"
import { useFilterSchedulesQuery } from "@/feature/schedules/scheduleApiSlice"
import { useMemo, useState, useEffect } from "react"

type Company = {
  name: string
  logo: string
  price: number
  primarySchedule?: any
  companyId?: number
  schedules?: any[]
}

type CompareBookingViewProps = {
  company: Company
  from: string
  to: string
  departure: string
  returnDate: string
  totalPrice: number
  onDepartureChange: (value: string) => void
  onReturnDateChange: (value: string) => void
  onProceed: (selectedSchedule?: any) => void
  onBack: () => void
}

export default function CompareBookingView({
  company,
  from,
  to,
  departure,
  returnDate,
  totalPrice,
  onDepartureChange,
  onReturnDateChange,
  onProceed,
  onBack,
}: CompareBookingViewProps) {
  // Fetch all schedules for this company on this route
  const companyId = company.companyId || company.primarySchedule?.companyId;
  const { data: schedulesData, isLoading: loadingSchedules } = useFilterSchedulesQuery({
    origin: from,
    destination: to,
    companyId: companyId ? Number(companyId) : undefined,
    status: "OPEN",
    page: 0,
    size: 50,
  }, {
    skip: !companyId || !from || !to,
  });

  // Filter schedules by departure date if selected
  const schedules = useMemo(() => {
    const raw = schedulesData?.content || schedulesData?.data?.content || schedulesData?.data || schedulesData || [];
    let filtered = Array.isArray(raw) ? raw : [];
    
    // Filter by departure date if provided
    if (departure) {
      try {
        const selectedDate = new Date(departure);
        const selectedDateStr = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
        
        filtered = filtered.filter((schedule: any) => {
          const scheduleDate = schedule.departureTime || schedule.departure_time;
          if (!scheduleDate) return false;
          
          const scheduleDateObj = new Date(scheduleDate);
          const scheduleDateStr = scheduleDateObj.toISOString().split('T')[0]; // YYYY-MM-DD
          
          return scheduleDateStr === selectedDateStr;
        });
      } catch (error) {
        console.error("Error filtering by departure date:", error);
      }
    }
    
    return filtered;
  }, [schedulesData, departure]);

  const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null);

  // Reset selected schedule when departure date changes
  useEffect(() => {
    setSelectedSchedule(null);
  }, [departure]);

  // Format time for display
  const formatTime = (dateTime: string) => {
    if (!dateTime) return "";
    try {
      const date = new Date(dateTime);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "";
    }
  };

  // Format date for display
  const formatDate = (dateTime: string) => {
    if (!dateTime) return "";
    try {
      const date = new Date(dateTime);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors self-start cursor-pointer"
      >
        <FaArrowLeft className="w-4 h-4" />
        <span className="font-medium">Back</span>
      </button>

      {/* Available Schedules List - Full Width */}
      <div className="w-full bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          Available Departures - {company.name}
        </h3>
        {loadingSchedules ? (
          <div className="text-center py-8 text-gray-600">Loading schedules...</div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No available schedules found for this route.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {schedules.map((schedule: any) => {
              const isSelected = selectedSchedule?.id === schedule.id;
              return (
                <div
                  key={schedule.id}
                  onClick={() => setSelectedSchedule(schedule)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#8B2323]/10 border-[#8B2323]"
                      : "bg-gray-50 border-gray-200 hover:border-[#8B2323]/50"
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-[#8B2323] w-4 h-4" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {formatTime(schedule.departureTime || schedule.departure_time)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(schedule.departureTime || schedule.departure_time)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400 w-3 h-3" />
                      <p className="text-xs text-gray-600">
                        {schedule.origin || from} → {schedule.destination || to}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        {schedule.vehicleNo || schedule.vehicle?.vehicleNo || "Vehicle N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {schedule.availableSeats || schedule.available_seats || 0} seats
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-lg font-bold text-[#8B2323]">
                        ₦{(schedule.price || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
      {/* Booking Card (left) */}
      <div className="flex-1 max-w-xl bg-[#F6F6F6] rounded-xl p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm text-gray-700 font-medium">
              <FaCalendarAlt className="text-gray-600 w-4 h-4" />
              <span>Departure Date</span>
            </div>
            <input
              type="date"
              value={departure}
              onChange={(e) => onDepartureChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border bg-white text-gray-900 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323]"
              placeholder="DD/MM/YYYY"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm text-gray-700 font-medium">
              <FaCalendarAlt className="text-gray-600 w-4 h-4" />
              <span>
                Return Date <span className="text-[#E08B2F] text-xs">(if round trip)</span>
              </span>
            </div>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => onReturnDateChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border bg-white text-gray-900 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323]"
              placeholder="DD/MM/YYYY"
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Total Price</p>
            <p className="text-green-600 font-bold text-2xl sm:text-3xl">
              {selectedSchedule 
                ? `₦${(selectedSchedule.price || 0).toLocaleString()}`
                : "₦0"
              }
            </p>
            {selectedSchedule && (
              <p className="text-xs text-gray-500 mt-2">
                1 seat selected
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Selected Company & Bus (right) */}
      <div className="flex-1 flex flex-col items-center mt-6 lg:mt-0">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-sm">
            <Image
              src={company.logo}
              alt={company.name}
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {company.name}
            </h3>
            <p className="text-sm text-gray-500">
              {from || "Lagos"} - {to || "Abuja"}
            </p>
          </div>
        </div>

        <div className="w-full max-w-md mb-6">
          <Image
            src="/Cheetah Bus Image 1.png"
            alt="Cheetah Bus"
            width={400}
            height={220}
            className="w-full h-auto object-contain"
          />
        </div>

        <button
          onClick={() => {
            if (!selectedSchedule) {
              alert("Please select a departure time");
              return;
            }
            onProceed(selectedSchedule);
          }}
          disabled={!selectedSchedule}
          className={`self-end px-10 py-3 rounded-lg font-semibold text-base sm:text-lg cursor-pointer transition-colors shadow-md ${
            selectedSchedule
              ? "bg-[#8B2323] text-white hover:bg-[#7A1F1F]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Proceed
        </button>
      </div>
    </div>
    </div>
  )
}

