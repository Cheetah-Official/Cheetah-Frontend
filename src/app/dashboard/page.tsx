"use client"

import Image from "next/image"
import { FaExchangeAlt, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaExclamationTriangle, FaWifi, FaCheckCircle } from "react-icons/fa"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/useAuth"
import {
  Sidebar,
  DashboardHeader,
  TransportsTab,
  CompareTab,
  CompareBookingView,
  SettingsTab,
} from "@/components/dashboard"

const companies = [
  { name: "Peace Mass", logo: "/PeaceMass-Logo.jpg", price: 32000, route: "Lagos - Abuja" },
  { name: "GIGM", logo: "/GIGMotors_Logo 1.png", price: 36000, route: "Lagos - Abuja" },
  { name: "GUO", logo: "/GUO.png", price: 34000, route: "Lagos - Abuja" },
  { name: "Chisco", logo: "/CHISCO.png", price: 26000, route: "Lagos - Abuja" },
]

const compareCompanies = [
  { name: "Peace Mass", logo: "/PeaceMass-Logo.jpg", price: 32000, route: "Lagos - Abuja" },
  { name: "GIGM", logo: "/GIGMotors_Logo 1.png", price: 36000, route: "Lagos - Abuja" },
  { name: "GUO", logo: "/GUO.png", price: 34000, route: "Lagos - Abuja" },
  { name: "Chisco", logo: "/CHISCO.png", price: 26000, route: "Lagos - Abuja" },
]

const totalPages = 4

function DashboardContent() {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [departure, setDeparture] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [activeTab, setActiveTab] = useState("transports")
  const [activeSettingsSubPage, setActiveSettingsSubPage] = useState("account")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCompareCompany, setSelectedCompareCompany] = useState<any | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<Array<{ id: number; text: string; sender: "user" | "agent" }>>([
    { id: 1, text: "Hello! How can I help you today?", sender: "agent" },
    { id: 2, text: "I need help with my booking", sender: "user" },
  ])
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading, error, signOut } = useAuth()

  // Format current date as DD/MM/YYYY
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Set default dates on component mount
  useEffect(() => {
    // Don't set default dates - let placeholders show
    setDeparture("")
    setReturnDate("")
  }, [])

  // Redirect unauthenticated users to signin
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin")
    }
  }, [loading, user, router])

  // Pick up tab from query param for deep links (support legacy 'notifications' -> 'activity')
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      if (["transports", "activity", "settings", "compare"].includes(tab)) {
        setActiveTab(tab)
      } else if (tab === "notifications") {
        setActiveTab("activity")
      }
    }
  }, [searchParams])

  // Set default values for Compare tab
  useEffect(() => {
    if (activeTab === "compare" && !from && !to) {
      setFrom("Lagos")
      setTo("Abuja")
    }
  }, [activeTab, from, to])

  // TODO: Replace with RTK Query hooks
  // Activity: fetch user's bookings to populate Activity tab
  // const { data: userBookings, isLoading: loadingBookings } = useGetBookingsByUserQuery({
  //   userId: user?.id || 0,
  //   page: 0,
  //   size: 20,
  // });
  const userBookings: any[] = []; // TODO: Get from RTK Query
  const loadingBookings = false; // TODO: Get from RTK Query

  // TODO: Provider statistics - Need to check if this endpoint exists in Swagger
  // If not, may need to create a new endpoint or use existing schedule/trip endpoints
  const providerStats = null; // TODO: Implement with appropriate RTK Query hook

  // Choose an active (latest upcoming) booking for the Activity left panel and Trip Progress
  const activeBooking = (() => {
    if (!userBookings || userBookings.length === 0) return null
    const parseTime = (b: any) => new Date(b.schedule_details?.departure_time || b.departure_time || 0).getTime()
    const now = Date.now()
    const future = userBookings.filter((b: any) => parseTime(b) >= now).sort((a: any, b: any) => parseTime(a) - parseTime(b))
    if (future.length > 0) return future[0]
    // else pick most recent past
    return userBookings.slice().sort((a: any, b: any) => parseTime(b) - parseTime(a))[0]
  })()

  // Handle date input formatting
  const handleDateChange = (value: string, setDate: (date: string) => void) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '')
    
    // Format as DD/MM/YYYY
    let formatted = numbers
    if (numbers.length >= 2) {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2)
    }
    if (numbers.length >= 4) {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8)
    }
    
    // Limit to 10 characters (DD/MM/YYYY)
    if (formatted.length <= 10) {
      setDate(formatted)
    }
  }

  const totalPassengers = adults + children
  const selectedPrice = 26000 // Default price, can be made dynamic based on selected transporter
  const totalPrice = selectedPrice * totalPassengers

  const handleProceed = () => {
    if (!from || !to || !departure) {
      // Lightweight validation for demo purposes
      alert("Please select From, To and Departure date")
      return
    }
    const params = new URLSearchParams({
      from,
      to,
      departure,
      returnDate,
      passengers: String(totalPassengers),
    })
    router.push(`/compare/result?${params.toString()}`)
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } finally {
      router.replace("/signin")
    }
  }

  return (
    <div className="min-h-screen flex bg-[#F9F9F9]">
      <Sidebar
        activeTab={activeTab}
        mobileMenuOpen={mobileMenuOpen}
        onTabChange={setActiveTab}
        onMobileMenuClose={() => setMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 w-full">
        {loading && (
          <div className="text-center text-gray-600">Loading dashboard...</div>
        )}
        <DashboardHeader
          userName={user?.first_name || ""}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
          showSearchBar={activeTab === "transports"}
        />

        {/* Transports Tab */}
        {activeTab === "transports" && (
          <TransportsTab
            from={from}
            to={to}
            departure={departure}
            returnDate={returnDate}
            adults={adults}
            children={children}
            currentPage={currentPage}
            totalPages={totalPages}
            companies={Array.isArray((providerStats as any)?.providers) && (providerStats as any).providers.length > 0
              ? (providerStats as any).providers.map((p: any) => ({ name: p.provider_name || p.name || 'Provider', logo: '/Logo.png', price: p.price || 26000 }))
              : companies}
            totalPrice={totalPrice}
            onFromChange={setFrom}
            onToChange={setTo}
            onDepartureChange={setDeparture}
            onReturnDateChange={setReturnDate}
            onSwapCities={() => { const temp = from; setFrom(to); setTo(temp); }}
            onAdultsChange={setAdults}
            onChildrenChange={setChildren}
            onPageChange={setCurrentPage}
            onProceed={handleProceed}
          />
        )}

        {/* Compare Tab */}
        {activeTab === "compare" && (
          <>
            {selectedCompareCompany ? (
              <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6">
                <CompareBookingView
                  company={selectedCompareCompany}
                  from={from || "Lagos"}
                  to={to || "Abuja"}
                  departure={departure}
                  returnDate={returnDate}
                  adults={adults}
                  children={children}
                  totalPrice={((selectedCompareCompany?.price as number | undefined) || 0) * totalPassengers}
                  onDepartureChange={setDeparture}
                  onReturnDateChange={setReturnDate}
                  onAdultsChange={setAdults}
                  onChildrenChange={setChildren}
                  onProceed={handleProceed}
                  onBack={() => setSelectedCompareCompany(null)}
                />
            </div>
            ) : (
              <CompareTab
                from={from || "Lagos"}
                to={to || "Abuja"}
                currentPage={currentPage}
                totalPages={totalPages}
                companies={compareCompanies}
                selectedCompany={selectedCompareCompany}
                onFromChange={setFrom}
                onToChange={setTo}
                onSwapCities={() => { const temp = from; setFrom(to); setTo(temp); }}
                onPageChange={setCurrentPage}
                onCompanySelect={setSelectedCompareCompany}
                onCompare={handleProceed}
              />
            )}
          </>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <SettingsTab
            activeSubPage={activeSettingsSubPage}
            user={user ? {
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              phone: user.phone || undefined,
            } : null}
            chatMessages={chatMessages}
            chatMessage={chatMessage}
            onSubPageChange={setActiveSettingsSubPage}
            onChatMessageChange={setChatMessage}
            onSendMessage={() => {
              if (chatMessage.trim()) {
                const newMessage = {
                  id: chatMessages.length + 1,
                  text: chatMessage,
                  sender: "user" as const,
                }
                setChatMessages([...chatMessages, newMessage])
                setChatMessage("")
              }
            }}
          />
        )}

        {/* Old duplicate Settings Tab code removed - using SettingsTab component now */}

        {/* Notifications Tab */}
        {activeTab === "activity" && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Notifications</h2>
            
            {/* Check if user has bookings */}
            {!activeBooking && (!userBookings || userBookings.length === 0) ? (
              /* Empty State - No Bookings */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:items-stretch">
                {/* Top Left - Ticket Details Empty State */}
                <div className="bg-[#F2F2F2] rounded-xl p-3 sm:p-4 shadow-sm flex flex-col items-center justify-center min-h-[200px]">
                  <FaExclamationTriangle className="text-gray-400 w-12 h-12 sm:w-16 sm:h-16 mb-4" />
                  <p className="text-sm sm:text-base text-gray-600 font-medium">No Ticket Details Yet</p>
                </div>

                {/* Bottom Left - Notification List Empty State */}
                <div className="bg-[#F2F2F2] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col items-center justify-center min-h-[200px]">
                  <FaExclamationTriangle className="text-gray-400 w-12 h-12 sm:w-16 sm:h-16 mb-4" />
                  <p className="text-sm sm:text-base text-gray-600 font-medium">No Notifications Yet</p>
                </div>

                {/* Right Column - Wi-Fi Code Empty State */}
                <div className="bg-[#F2F2F2] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col items-center justify-center min-h-[400px] lg:col-span-1 lg:row-span-2">
                  <FaExclamationTriangle className="text-gray-400 w-12 h-12 sm:w-16 sm:h-16 mb-4" />
                  <p className="text-sm sm:text-base text-gray-600 font-medium">No Notifications Yet</p>
                </div>
              </div>
            ) : (
              /* Content - User has bookings */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:items-stretch">
              {/* Left Column - Stacked Cards */}
              <div className="flex flex-col gap-4 sm:gap-6 h-full">
                {/* Top Left - Ticket Details Card */}
                <div className="bg-[#F2F2F2] rounded-xl p-3 sm:p-4 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">Ticket Details</h3>
                
                {/* Company and Route */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center overflow-hidden">
                      <Image 
                        src="/CHISCO.png" 
                        alt="CHISCO express" 
                        width={40} 
                        height={40} 
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-800">Chisco</h4>
                      <p className="text-xs text-gray-600">
                        {activeBooking ? `${activeBooking.schedule_details?.origin || activeBooking.origin || "Lagos"} - ${activeBooking.schedule_details?.destination || activeBooking.destination || "Abuja"}` : "Lagos - Abuja"}
                      </p>
                    </div>
                  </div>
                  <div className="border border-gray-300 px-2 py-1 rounded-full bg-white">
                    <span className="text-xs font-medium text-gray-800">
                      <span className="font-bold">{activeBooking?.passenger_count ?? (activeBooking?.passengers?.length ?? 2)}</span> Passengers
                    </span>
                  </div>
                </div>

                {/* Departure Date and Days Remaining */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Departure Date</p>
                      <p className="text-sm font-bold text-gray-800">
                        {activeBooking?.schedule_details?.departure_time 
                          ? (() => {
                              const date = new Date(activeBooking.schedule_details.departure_time);
                              const day = date.getDate();
                              const month = date.toLocaleDateString('en-US', { month: 'long' });
                              const year = date.getFullYear();
                              const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
                              return `${month} ${day}${suffix}, ${year}`;
                            })()
                          : "July 28th, 2025"}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-gray-800">
                      {(() => {
                        if (activeBooking?.schedule_details?.departure_time) {
                          const days = Math.ceil((new Date(activeBooking.schedule_details.departure_time).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                          return days > 0 ? days : 0
                        }
                        return 4
                      })()} days
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-[#ad6e6e] h-1.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                {/* Included Features */}
                <div className="flex flex-row gap-2 mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-green-500 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm text-gray-700">Free WiFi</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-green-500 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm text-gray-700">Free Insurance</span>
                  </div>
                </div>

                {/* Download Ticket Button */}
                <div className="flex justify-end">
                  <button
                    className="bg-[#8B2323] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#7A1F1F] transition-colors text-sm cursor-pointer"
                    onClick={() => {
                      if (activeBooking?.schedule_details?.schedule_id) {
                        router.push(`/bookings/${encodeURIComponent(activeBooking.schedule_details.schedule_id)}?passengers=${encodeURIComponent(activeBooking.passenger_count ?? (activeBooking.passengers?.length ?? 1))}`)
                      }
                    }}
                  >
                    Download Ticket
                  </button>
                </div>
                </div>

                {/* Bottom Left - Notification List Card */}
                <div className="bg-[#F2F2F2] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col flex-1 min-h-0 lg:h-full">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Notification</h3>
                  <div className="space-y-4 flex-1 overflow-y-auto">
                  {/* Wi-Fi Code Notification */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaWifi className="text-[#8B2323] w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-800">Wi-Fi Code</span>
                        <span className="text-xs text-gray-500">30 Mins ago</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Your free onboard Wi-Fi code is ready. Stay connected throughout your trip.
                      </p>
                    </div>
                  </div>

                  {/* Reminder Notification */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaExclamationTriangle className="text-[#8B2323] w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-800">Reminder</span>
                        <span className="text-xs text-gray-500">2 Days ago</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Trip starts soon. Don't forget to prepare for your journey.
                      </p>
                    </div>
                  </div>

                  {/* Additional notifications from bookings */}
                  {!loadingBookings && userBookings && userBookings.slice(0, 3).map((bk: any, idx: number) => {
                    const provider = bk.schedule_details?.provider_name || bk.provider_name || "Provider"
                    const origin = bk.schedule_details?.origin || bk.origin || "-"
                    const destination = bk.schedule_details?.destination || bk.destination || "-"
                    const dep = bk.schedule_details?.departure_time || bk.departure_time
                    const timeAgo = dep ? Math.floor((Date.now() - new Date(dep).getTime()) / (1000 * 60 * 60)) : idx + 1
                    return (
                      <div key={bk.booking_id || idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <FaCheckCircle className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-800">Booking Confirmed</span>
                            <span className="text-xs text-gray-500">{timeAgo} {timeAgo === 1 ? 'Hour' : 'Hours'} ago</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Your booking for {provider} - {origin} to {destination} has been confirmed.
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  </div>
                </div>
              </div>

              {/* Right Column - Wi-Fi Code Card */}
              <div className="bg-[#F2F2F2] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#8B2323] rounded-full p-2 flex items-center justify-center">
                      <FaWifi className="text-white w-5 h-5" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">Wi-Fi Code</h3>
                  </div>
                  <span className="text-xs text-gray-500">30 Mins ago</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  You've received a free Wi-Fi code for your upcoming trip. Stay connected and enjoy smooth browsing throughout your journey — courtesy of Cheetah.
                </p>

                <div className="flex-1 flex flex-col">
                  {/* Details in table-like format with separators */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Wi-Fi Code:</span>
                      <div className="bg-[#d5b5b5]/20 border border-[#d5b5b5]/30 rounded-lg px-3 py-2">
                        <span className="text-sm font-mono font-semibold text-[#800000]">CHEETAH-8324</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Trip Date:</span>
                      <span className="text-sm text-gray-800 font-medium">
                        {activeBooking?.schedule_details?.departure_time 
                          ? new Date(activeBooking.schedule_details.departure_time).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                          : "June 24, 2025"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Transport Provider:</span>
                      <span className="text-sm text-gray-800 font-medium">
                        {activeBooking?.schedule_details?.provider_name || activeBooking?.provider_name || "Chisco"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Coverage:</span>
                      <span className="text-sm text-gray-800 font-medium">Full trip duration</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className="text-sm text-green-600 font-medium">Active</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm text-gray-600">Cost:</span>
                      <span className="text-sm text-[#E08B2F] font-medium">Free</span>
                    </div>
                  </div>

                  {/* Instructions at bottom */}
                  <div className="flex items-start gap-3 pt-4 mt-auto">
                    <div className="bg-[#E08B2F] rounded-full p-2 flex items-center justify-center flex-shrink-0">
                      <FaExclamationTriangle className="text-white w-4 h-4" />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      To use, simply connect to the "Cheetah Bus Wi-Fi" network and enter the code when prompted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <div className="text-center">
          <div className="text-xl font-semibold text-[#8B2323]">Loading Dashboard...</div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}