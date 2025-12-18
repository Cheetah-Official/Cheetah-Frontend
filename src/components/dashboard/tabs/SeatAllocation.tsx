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
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-black hover:text-gray-800 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <FaArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Panel - Seat Map */}
        <div className="flex-1 flex gap-6">
          {/* Seat Map Section */}
          <div className="flex-1 bg-gray-50 rounded-xl p-6">
            {/* Steering Wheel and Row 1 Seats - Flexed together */}
            <div className="flex items-center gap-12 mb-6">
              {/* Steering Wheel Icon (Driver Position) */}
              <Image
                src="/Sterling.png"
                alt="Steering wheel"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              {/* Row 1 Seats */}
              {seatRows[0].map((seatNum) => {
                const seat = seats.find((s) => s.number === seatNum)
                if (!seat) return null
                return (
                  <div
                    key={seat.number}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-semibold cursor-pointer transition-all ${
                      seat.status === "open"
                        ? "hover:bg-gray-400 text-gray-700"
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

            {/* Remaining Seat Rows */}
            <div className="space-y-6">
              {seatRows.slice(1).map((row, rowIndex) => (
                <div key={rowIndex + 1} className="flex gap-6 justify-start">
                  {row.map((seatNum) => {
                    const seat = seats.find((s) => s.number === seatNum)
                    if (!seat) return null
                    return (
                      <div
                        key={seat.number}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-semibold cursor-pointer transition-all ${
                          seat.status === "open"
                            ? "hover:bg-gray-400 text-gray-700"
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

          {/* Legend - vertically centered on the right side */}
          <div className="flex flex-col gap-2 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm text-black">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span className="text-sm text-black">Open</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#8B2323] rounded"></div>
              <span className="text-sm text-black">Unavailable</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Vehicle Information */}
        <div className="flex-1 flex flex-col items-center">
          {/* Company Logo and Name */}
          <div className="flex items-center gap-4 mb-4">
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
              <h3 className="text-xl font-semibold text-black">
                {company.name}
              </h3>
              <p className="text-sm text-black">
                {from} - {to}
              </p>
            </div>
          </div>

          {/* Bus Image */}
          <div className="w-full max-w-md mb-6">
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-black">
          <FaExclamationTriangle className="text-[#E08B2F] w-4 h-4 flex-shrink-0" />
          <span>Remember to confirm your travel details before proceeding</span>
        </div>
        <button
          onClick={onProceed}
          className="bg-[#8B2323] text-white px-10 py-3 rounded-lg font-semibold text-base sm:text-lg cursor-pointer hover:bg-[#7A1F1F] transition-colors shadow-md"
        >
          Proceed
        </button>
      </div>
    </div>
  )
}

