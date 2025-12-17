import Image from "next/image"
import { FaExchangeAlt, FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa"
import { TransporterCard, Pagination } from "../shared"

type Company = {
  name: string
  logo: string
  price: number
}

type TransportsTabProps = {
  from: string
  to: string
  departure: string
  returnDate: string
  adults: number
  children: number
  currentPage: number
  totalPages: number
  companies: Company[]
  totalPrice: number
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  onDepartureChange: (value: string) => void
  onReturnDateChange: (value: string) => void
  onSwapCities: () => void
  onAdultsChange: (value: number) => void
  onChildrenChange: (value: number) => void
  onPageChange: (page: number) => void
  onProceed: () => void
}

export default function TransportsTab({
  from,
  to,
  departure,
  returnDate,
  adults,
  children,
  currentPage,
  totalPages,
  companies,
  totalPrice,
  onFromChange,
  onToChange,
  onDepartureChange,
  onReturnDateChange,
  onSwapCities,
  onAdultsChange,
  onChildrenChange,
  onPageChange,
  onProceed,
}: TransportsTabProps) {
  return (
    <div className="bg-[#F6F6F6] rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col gap-3 sm:gap-4 md:gap-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-end sm:items-end gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="relative w-full sm:w-auto">
          <span className="absolute left-3 top-[13px] text-gray-700 text-xs sm:text-sm font-medium pointer-events-none z-10">From</span>
          <select 
            value={from} 
            onChange={e => onFromChange(e.target.value)} 
            className="appearance-none pl-14 sm:pl-16 pr-3 sm:pr-4 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] cursor-pointer w-full sm:w-40 text-sm sm:text-base shadow-sm h-[42px]" 
            aria-label="Departure city"
          >
            <option value="">Select City</option>
            <option value="Lagos">Lagos</option>
            <option value="Abuja">Abuja</option>
            <option value="Kano">Kano</option>
          </select>
        </div>
        <button 
          onClick={onSwapCities}
          className="mb-0.5 sm:mb-0.5 flex-shrink-0 cursor-pointer"
          aria-label="Swap cities"
        >
          <FaExchangeAlt className="text-[#E08B2F] w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <div className="relative w-full sm:w-auto">
          <span className="absolute left-3 top-[13px] text-gray-700 text-xs sm:text-sm font-medium pointer-events-none z-10">To</span>
          <select 
            value={to} 
            onChange={e => onToChange(e.target.value)} 
            className="appearance-none pl-12 sm:pl-14 pr-3 sm:pr-4 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] cursor-pointer w-full sm:w-40 text-sm sm:text-base shadow-sm h-[42px]" 
            aria-label="Destination city"
          >
            <option value="">Select City</option>
            <option value="Lagos">Lagos</option>
            <option value="Abuja">Abuja</option>
            <option value="Kano">Kano</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto sm:ml-4">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-600 w-4 h-4" />
            <span className="text-gray-700 text-xs sm:text-sm md:text-base font-medium">Departure Date</span>
          </div>
          <input 
            type="date" 
            value={departure}
            onChange={(e) => onDepartureChange(e.target.value)}
            className="px-3 sm:px-4 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] w-full sm:w-40 md:w-44 font-medium text-sm sm:text-base shadow-sm h-[42px]" 
            placeholder="DD/MM/YYYY"
            aria-label="Departure Date"
          />
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto sm:ml-4">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-600 w-4 h-4" />
            <span className="text-gray-700 text-xs sm:text-sm md:text-base font-medium">Return Date <span className="text-xs text-[#E08B2F]">(if round trip)</span></span>
          </div>
          <input 
            type="date" 
            value={returnDate}
            onChange={(e) => onReturnDateChange(e.target.value)}
            className="px-3 sm:px-4 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] w-full sm:w-40 md:w-44 font-medium text-sm sm:text-base shadow-sm h-[42px]" 
            placeholder="DD/MM/YYYY"
            aria-label="Return Date"
          />
        </div>
      </div>

      {/* Companies and Bus */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-start">
        {/* Transporters Section */}
        <div className="flex-1 w-full lg:w-auto">
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700">Transporters</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 mb-6">
            {companies.slice((currentPage - 1) * 4, currentPage * 4).map((company) => (
              <TransporterCard 
                key={company.name}
                company={company}
              />
            ))}
          </div>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>

        {/* Passengers and Vehicle Section */}
        <div className="flex-shrink-0 w-full lg:w-auto mt-4 lg:mt-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Passengers</h3>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
            <div className="flex items-center gap-3 sm:gap-4 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3">
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
                <span className="px-2.5 py-1 font-bold text-black text-sm sm:text-base min-w-[2rem] text-center">{adults}</span>
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
            <div className="flex items-center gap-3 sm:gap-4 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3">
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
                <span className="px-2.5 py-1 font-bold text-black text-sm sm:text-base min-w-[2rem] text-center">{children}</span>
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
          <div className="rounded-lg p-4">
            <Image src="/Cheetah Bus Image 1.png" alt="Cheetah Bus" width={300} height={180} className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:w-[300px] lg:max-w-none h-auto object-contain mx-auto" />
          </div>
          <div className="text-center">
            <p className="text-green-600 font-bold text-2xl sm:text-3xl ml-36">N{totalPrice.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Proceed Button */}
      <div className="flex justify-center lg:justify-end mt-3 sm:mt-4 lg:mt-2">
        <button 
          onClick={onProceed} 
          className="bg-[#8B2323] text-white px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 rounded-lg font-semibold text-base sm:text-lg md:text-xl cursor-pointer w-full sm:w-auto hover:bg-[#7A1F1F] transition-colors shadow-md"
        >
          Proceed
        </button>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 sm:mt-6 text-xs sm:text-sm text-gray-600">
        <FaExclamationTriangle className="text-[#E08B2F] w-4 h-4 flex-shrink-0" />
        <span>Remember to confirm your travel details before proceeding</span>
      </div>
    </div>
  )
}

