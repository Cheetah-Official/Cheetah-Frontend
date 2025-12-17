import Image from "next/image"
import { FaCalendarAlt, FaArrowLeft } from "react-icons/fa"

type Company = {
  name: string
  logo: string
  price: number
}

type CompareBookingViewProps = {
  company: Company
  from: string
  to: string
  departure: string
  returnDate: string
  adults: number
  children: number
  totalPrice: number
  onDepartureChange: (value: string) => void
  onReturnDateChange: (value: string) => void
  onAdultsChange: (value: number) => void
  onChildrenChange: (value: number) => void
  onProceed: () => void
  onBack: () => void
}

export default function CompareBookingView({
  company,
  from,
  to,
  departure,
  returnDate,
  adults,
  children,
  totalPrice,
  onDepartureChange,
  onReturnDateChange,
  onAdultsChange,
  onChildrenChange,
  onProceed,
  onBack,
}: CompareBookingViewProps) {
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

      <div className="flex flex-col lg:flex-row gap-8 items-start">
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

        <div className="mb-6">
          <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">
            Passengers
          </h4>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 bg-white">
              <span className="text-gray-700 font-medium text-sm sm:text-base">Adult</span>
              <div className="flex items-center rounded-lg border">
                <button
                  type="button"
                  className="px-2 py-1 bg-[#606060] text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors text-sm font-semibold rounded-l-lg"
                  onClick={() => onAdultsChange(Math.max(1, adults - 1))}
                  aria-label="Decrease adults"
                >
                  -
                </button>
                <span className="px-2.5 py-1 font-bold text-black text-sm sm:text-base min-w-[2rem] text-center">
                  {adults}
                </span>
                <button
                  type="button"
                  className="px-2 py-1 bg-[#606060] text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors text-sm font-semibold rounded-r-lg"
                  onClick={() => onAdultsChange(adults + 1)}
                  aria-label="Increase adults"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 bg-white">
              <span className="text-gray-700 font-medium text-sm sm:text-base">Children</span>
              <div className="flex items-center rounded-lg border">
                <button
                  type="button"
                  className="px-2 py-1 bg-[#606060] text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors text-sm font-semibold rounded-l-lg"
                  onClick={() => onChildrenChange(Math.max(0, children - 1))}
                  aria-label="Decrease children"
                >
                  -
                </button>
                <span className="px-2.5 py-1 font-bold text-black text-sm sm:text-base min-w-[2rem] text-center">
                  {children}
                </span>
                <button
                  type="button"
                  className="px-2 py-1 bg-[#606060] text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors text-sm font-semibold rounded-r-lg"
                  onClick={() => onChildrenChange(children + 1)}
                  aria-label="Increase children"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 justify-end">
          <p className="text-green-600 font-bold text-2xl sm:text-3xl">
            N{totalPrice.toLocaleString()}
          </p>
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
          onClick={onProceed}
          className="self-end bg-[#8B2323] text-white px-10 py-3 rounded-lg font-semibold text-base sm:text-lg cursor-pointer hover:bg-[#7A1F1F] transition-colors shadow-md"
        >
          Proceed
        </button>
      </div>
    </div>
    </div>
  )
}

