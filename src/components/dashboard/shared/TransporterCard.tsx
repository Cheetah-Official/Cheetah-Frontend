import Image from "next/image"

type TransporterCardProps = {
  company: {
    name: string
    logo: string
    price: number
    route?: string
  }
  from?: string
  to?: string
  onClick?: () => void
}

export default function TransporterCard({ company, from, to, onClick }: TransporterCardProps) {
  return (
    <button 
      onClick={onClick}
      className="relative flex flex-col bg-white rounded-xl shadow-sm p-4 sm:p-5 cursor-pointer border border-gray-200 hover:border-[#8B2323] hover:shadow-md transition-all h-full min-h-[140px]"
    >
      {/* Logo and Name flexed together */}
      <div className="flex items-center gap-3 sm:gap-4 mb-2">
        <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center flex-shrink-0">
          <Image 
            src={company.logo} 
            alt={company.name} 
            width={64} 
            height={64} 
            className="w-full h-full object-contain" 
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700 text-sm sm:text-base">{company.name}</span>
          {company.route && (
            <span className="text-xs sm:text-sm text-gray-500 mt-0.5">{company.route}</span>
          )}
          {!company.route && from && to && (
            <span className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {from} - {to}
            </span>
          )}
        </div>
      </div>
      {/* Price at bottom right */}
      <div className="absolute bottom-4 right-4">
        <span className="text-green-600 font-bold text-sm sm:text-base">N{company.price?.toLocaleString() || '26,000'}</span>
      </div>
    </button>
  )
}

