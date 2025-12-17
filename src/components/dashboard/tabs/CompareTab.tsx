import Image from "next/image"
import { FaExchangeAlt, FaExclamationTriangle } from "react-icons/fa"
import { TransporterCard, Pagination } from "../shared"

type Company = {
  name: string
  logo: string
  price: number
  route?: string
}

type CompareTabProps = {
  from: string
  to: string
  currentPage: number
  totalPages: number
  companies: Company[]
  selectedCompany: Company | null
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  onSwapCities: () => void
  onPageChange: (page: number) => void
  onCompanySelect: (company: Company) => void
  onCompare: () => void
}

export default function CompareTab({
  from,
  to,
  currentPage,
  totalPages,
  companies,
  selectedCompany,
  onFromChange,
  onToChange,
  onSwapCities,
  onPageChange,
  onCompanySelect,
  onCompare,
}: CompareTabProps) {
  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6">
      {/* Compare Form */}
      <div className="flex flex-col sm:flex-row items-end gap-3 sm:gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <span className="absolute left-3 top-[13px] text-gray-700 text-xs sm:text-sm font-medium pointer-events-none z-10">From</span>
          <select 
            value={from || "Lagos"} 
            onChange={e => onFromChange(e.target.value)} 
            className="appearance-none pl-14 sm:pl-16 pr-3 sm:pr-4 py-2.5 rounded-lg border bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] cursor-pointer w-full sm:w-40 text-sm sm:text-base shadow-sm h-[42px]" 
            aria-label="Departure city"
          >
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
            value={to || "Abuja"} 
            onChange={e => onToChange(e.target.value)} 
            className="appearance-none pl-12 sm:pl-14 pr-3 sm:pr-4 py-2.5 rounded-lg border bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] cursor-pointer w-full sm:w-40 text-sm sm:text-base shadow-sm h-[42px]" 
            aria-label="Destination city"
          >
            <option value="Lagos">Lagos</option>
            <option value="Abuja">Abuja</option>
            <option value="Kano">Kano</option>
          </select>
        </div>
        <button 
          onClick={onCompare}
          className="bg-[#8B2323] text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base md:text-lg cursor-pointer w-full sm:w-auto hover:bg-[#7A1F1F] transition-colors shadow-md h-[42px]"
        >
          Compare
        </button>
      </div>

      {/* Transporters Section */}
      {!selectedCompany && (
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-start">
          <div className="flex-1 w-full lg:w-auto mb-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <Image src="/Companies.png" alt="Companies" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700">Transporters</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 mb-6">
              {companies.slice((currentPage - 1) * 4, currentPage * 4).map((company) => (
                <TransporterCard 
                  key={company.name}
                  company={company}
                  from={from || "Lagos"}
                  to={to || "Abuja"}
                  onClick={() => onCompanySelect(company)}
                />
              ))}
            </div>
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>

          {/* Bus Image Section */}
          <div className="flex-shrink-0 w-full lg:w-auto mt-4 lg:mt-0">
            <div className="rounded-lg p-4">
              <Image
                src="/Cheetah Bus Image 1.png"
                alt="Cheetah Bus"
                width={300}
                height={180}
                className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:w-[300px] lg:max-w-none h-auto object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
        <FaExclamationTriangle className="text-[#E08B2F] w-4 h-4 flex-shrink-0" />
        <span>Remember to confirm your travel details before proceeding</span>
      </div>
    </div>
  )
}

