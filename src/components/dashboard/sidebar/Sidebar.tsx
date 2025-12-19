import Image from "next/image"
import { useRouter } from "next/navigation"
import { FaSignOutAlt, FaTimes } from "react-icons/fa"

type SidebarProps = {
  activeTab: string
  mobileMenuOpen: boolean
  onTabChange: (tab: string) => void
  onMobileMenuClose: () => void
  onLogout: () => void
}

export default function Sidebar({
  activeTab,
  mobileMenuOpen,
  onTabChange,
  onMobileMenuClose,
  onLogout,
}: SidebarProps) {
  const router = useRouter()

  const handleLogoClick = () => {
    router.push("/")
  }

  return (
    <>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onMobileMenuClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 sm:w-80 md:w-64 lg:w-56 xl:w-64 2xl:w-72 bg-white border-r flex flex-col justify-between py-4 sm:py-6 md:py-8 px-3 sm:px-4 min-h-screen transform transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div>
          <div className="flex items-center justify-between mb-8 sm:mb-10 md:mb-12">
            <button 
              onClick={handleLogoClick}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Go to home page"
            >
              <Image src="/Cheetah 2.svg" alt="Cheetah" width={100} height={38} className="sm:w-[120px] sm:h-[45px]" />
            </button>
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={onMobileMenuClose}
              aria-label="Close menu"
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
                onTabChange("transports")
                onMobileMenuClose()
              }}
            >
              <Image src="/Bus-route.png" alt="Transports" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5" /> Transports
            </button>
            <button 
              className={`flex items-center w-full px-3 py-2.5 sm:py-3 rounded-lg font-semibold gap-3 cursor-pointer transition-colors text-sm sm:text-base ${
                activeTab === "compare" 
                  ? "bg-[#8B2323] text-white" 
                  : "text-[#8B2323] hover:bg-[#8B2323]/10"
              }`}
              onClick={() => {
                onTabChange("compare")
                onMobileMenuClose()
              }}
            >
              <Image src="/Compare.png" alt="Compare" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5" /> Compare
            </button>
            <button 
              className={`flex items-center w-full px-3 py-2.5 sm:py-3 rounded-lg font-semibold gap-3 cursor-pointer transition-colors text-sm sm:text-base ${
                activeTab === "activity" 
                  ? "bg-[#8B2323] text-white" 
                  : "text-[#8B2323] hover:bg-[#8B2323]/10"
              }`}
              onClick={() => {
                onTabChange("activity")
                onMobileMenuClose()
              }}
            >
              <Image src="/Notification.png" alt="Notifications" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5" /> Notifications
            </button>
            <button 
              className={`flex items-center w-full px-3 py-2.5 sm:py-3 rounded-lg font-semibold gap-3 cursor-pointer transition-colors text-sm sm:text-base ${
                activeTab === "settings" 
                  ? "bg-[#8B2323] text-white" 
                  : "text-[#8B2323] hover:bg-[#8B2323]/10"
              }`}
              onClick={() => {
                onTabChange("settings")
                onMobileMenuClose()
              }}
            >
              <Image src="/Settings.png" alt="Settings" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5" /> Settings
            </button>
          </nav>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-[#8B2323] mt-6 sm:mt-8 cursor-pointer text-sm sm:text-base">
          <FaSignOutAlt className="w-4 h-4 sm:w-5 sm:h-5 text-[#DD945B]" /> Log out
        </button>
      </aside>
    </>
  )
}

