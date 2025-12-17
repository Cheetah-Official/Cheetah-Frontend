import { FaBars, FaSearch } from "react-icons/fa"

type DashboardHeaderProps = {
  userName: string
  searchQuery: string
  onSearchChange: (query: string) => void
  onMobileMenuOpen: () => void
  showSearchBar?: boolean
}

export default function DashboardHeader({
  userName,
  searchQuery,
  onSearchChange,
  onMobileMenuOpen,
  showSearchBar = false,
}: DashboardHeaderProps) {
  return (
    <>
      {/* Mobile Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 md:hidden">
        <button 
          className="p-2 rounded-lg hover:bg-gray-100"
          onClick={onMobileMenuOpen}
          aria-label="Open menu"
        >
          <FaBars className="text-gray-600 w-5 h-5" />
        </button>
        {showSearchBar && (
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search"
              className="pl-8 pr-28 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] text-sm w-64 sm:w-72"
            />
            <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
            <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-[#8B2323] text-white px-6 py-1 rounded-lg font-semibold text-xs hover:bg-[#7A1F1F] transition-colors">
              Search
            </button>
          </div>
        )}
      </div>

      <div className={`flex items-center ${showSearchBar ? 'justify-between' : 'justify-start'} mb-4 sm:mb-6`}>
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-[#8B2323]/80 flex items-center gap-2">
          <span className="text-[#E08B2F] text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">👋</span> Welcome, <span className="font-bold">{userName}</span>
        </h2>
        {showSearchBar && (
          <div className="hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search"
                className="pl-10 pr-32 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] text-sm w-80 lg:w-96"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-[#8B2323] text-white px-8 py-1.5 rounded-lg font-semibold text-sm hover:bg-[#7A1F1F] transition-colors">
                Search
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

