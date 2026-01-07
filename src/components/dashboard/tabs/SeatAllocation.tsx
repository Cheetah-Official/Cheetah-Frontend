import Image from "next/image"
import { FaArrowLeft, FaExclamationTriangle, FaCar } from "react-icons/fa"

type Company = {
  name: string
  logo: string
  price: number
}

type SeatStatus = "open" | "booked" | "unavailable"

type SeatAllocationProps = {
  company: Company
  from: string
  to: string
  onBack: () => void
  onProceed: () => void
}

export default function SeatAllocation({
  company,
  from,
  to,
  onBack,
  onProceed,
}: SeatAllocationProps) {
  // Seat data: 1-15 with their statuses (matching the image)
  // Seats 5,6 are booked (orange), seat 8 is unavailable (dark red), rest are open (light gray)
  const seats: Array<{ number: number; status: SeatStatus }> = [
    { number: 1, status: "open" },
    { number: 2, status: "open" },
    { number: 3, status: "open" },
    { number: 4, status: "open" },
    { number: 5, status: "booked" },
    { number: 6, status: "booked" },
    { number: 7, status: "open" },
    { number: 8, status: "unavailable" },
    { number: 9, status: "open" },
    { number: 10, status: "open" },
    { number: 11, status: "open" },
    { number: 12, status: "open" },
    { number: 13, status: "open" },
    { number: 14, status: "open" },
    { number: 15, status: "open" },
  ]

  const getSeatColor = (status: SeatStatus) => {
    switch (status) {
      case "booked":
        return "bg-orange-500"
      case "unavailable":
        return "bg-[#8B2323]"
      case "open":
        return "bg-gray-300"
    }
  }

  // Arrange seats in rows: 15 seats total (matching the image)
  const seatRows = [
    [1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [9, 10, 11],
    [12, 13, 14, 15],
  ]

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6">
      {/* Header with Back Button */}
      <div className="flex items-center mb-2 sm:mb-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center text-black hover:text-gray-800 transition-colors cursor-pointer p-2 -ml-2"
          aria-label="Go back"
        >
          <FaArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Left Panel - Seat Map */}
        <div className="flex-1 flex flex-col gap-4 sm:gap-6">
          {/* Seat Map Section */}
          <div className="flex-1 bg-gray-50 rounded-xl p-4 sm:p-5 md:p-6">
            {/* Steering Wheel and Row 1 Seats - Centered on mobile */}
            <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-6 md:gap-8 lg:gap-12 mb-4 sm:mb-6">
              {/* Steering Wheel Icon (Driver Position) */}
              <Image
                src="/Sterling.png"
                alt="Steering wheel"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
              />
              {/* Row 1 Seats */}
              {seatRows[0].map((seatNum) => {
                const seat = seats.find((s) => s.number === seatNum)
                if (!seat) return null
                return (
                  <div
                    key={seat.number}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-sm sm:text-base font-semibold transition-all flex-shrink-0 ${
                      seat.status === "open"
                        ? "hover:bg-gray-400 active:bg-gray-500 text-gray-700 cursor-pointer"
                        : "cursor-not-allowed"
                    } ${getSeatColor(seat.status)} ${
                      seat.status === "open" ? "text-gray-700" : "text-white"
                    }`}
                  >
                    {seat.number}
                  </div>
                )
              })}
            </div>

            {/* Remaining Seat Rows - Centered on mobile */}
            <div className="space-y-4 sm:space-y-4 md:space-y-6">
              {seatRows.slice(1).map((row, rowIndex) => (
                <div key={rowIndex + 1} className="flex gap-3 sm:gap-4 md:gap-6 justify-center sm:justify-start">
                  {row.map((seatNum) => {
                    const seat = seats.find((s) => s.number === seatNum)
                    if (!seat) return null
                    return (
                      <div
                        key={seat.number}
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-sm sm:text-base font-semibold transition-all flex-shrink-0 ${
                          seat.status === "open"
                            ? "hover:bg-gray-400 active:bg-gray-500 text-gray-700 cursor-pointer"
                            : "cursor-not-allowed"
                        } ${getSeatColor(seat.status)} ${
                          seat.status === "open" ? "text-gray-700" : "text-white"
                        }`}
                      >
                        {seat.number}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend - Centered on mobile, right-aligned on desktop */}
          <div className="flex flex-row sm:flex-row md:flex-col gap-4 sm:gap-3 justify-center sm:justify-start md:justify-center items-center md:items-start">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded flex-shrink-0"></div>
              <span className="text-xs sm:text-sm text-black whitespace-nowrap">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded flex-shrink-0"></div>
              <span className="text-xs sm:text-sm text-black whitespace-nowrap">Open</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#8B2323] rounded flex-shrink-0"></div>
              <span className="text-xs sm:text-sm text-black whitespace-nowrap">Unavailable</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Vehicle Information */}
        <div className="flex-1 flex flex-col items-center">
          {/* Company Logo and Name - Centered on mobile */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-4 w-full">
            <div className="w-16 h-16 sm:w-16 sm:h-16 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-sm flex-shrink-0">
              <Image
                src={company.logo}
                alt={company.name}
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-lg md:text-xl font-semibold text-black">
                {company.name}
              </h3>
              <p className="text-sm sm:text-sm text-black">
                {from} - {to}
              </p>
            </div>
          </div>

          {/* Bus Image */}
          <div className="w-full max-w-md mb-4 sm:mb-6">
            <Image
              src="/Cheetah Bus Image 1.png"
              alt="Bus"
              width={400}
              height={220}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section - Warning and Proceed Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mt-2 sm:mt-4">
        <div className="flex items-start sm:items-center gap-2 text-xs sm:text-sm text-black flex-1">
          <FaExclamationTriangle className="text-[#E08B2F] w-4 h-4 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-relaxed">Remember to confirm your travel details before proceeding</span>
        </div>
        <button
          onClick={onProceed}
          className="bg-[#8B2323] text-white px-6 sm:px-8 md:px-10 py-3 sm:py-3 rounded-lg font-semibold text-base sm:text-base md:text-lg cursor-pointer hover:bg-[#7A1F1F] active:bg-[#6B1A1A] transition-colors shadow-md w-full sm:w-auto"
        >
          Proceed
        </button>
      </div>
    </div>
  )
}

