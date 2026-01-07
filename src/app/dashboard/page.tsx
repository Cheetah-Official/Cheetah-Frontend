"use client"

import Image from "next/image"
import { FaExchangeAlt, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaExclamationTriangle, FaWifi, FaCheckCircle } from "react-icons/fa"
import { useState, useEffect, useMemo, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/useAuth"
import { useDispatch, useSelector } from "react-redux"
import { logOut, selectCurrentAccessToken, selectCurrentUser } from "@/feature/authentication/authSlice"
import { useGetAuthenticatedUserQuery } from "@/feature/auth/authApiSlice"
import { useGetNotificationsQuery } from "@/feature/notifications/notificationApiSlice"
import { useCreateBookingMutation } from "@/feature/bookings/bookingApiSlice"
import { useGetBookingsByUserQuery } from "@/feature/bookings/bookingApiSlice"
import { useFilterSchedulesQuery } from "@/feature/schedules/scheduleApiSlice"
import {
  Sidebar,
  DashboardHeader,
  TransportsTab,
  CompareTab,
  CompareBookingView,
  SettingsTab,
  SeatAllocation,
} from "@/components/dashboard"

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
  const [showSeatAllocation, setShowSeatAllocation] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<Array<{ id: number; text: string; sender: "user" | "agent" }>>([
    { id: 1, text: "Hello! How can I help you today?", sender: "agent" },
    { id: 2, text: "I need help with my booking", sender: "user" },
  ])
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const { user: useAuthUser, loading: useAuthLoading } = useAuth()
  
  // Check Redux state for authentication (more reliable)
  const accessToken = useSelector(selectCurrentAccessToken)
  const reduxUser = useSelector(selectCurrentUser)
  // Also check localStorage as fallback - this ensures we have the token even if Redux hasn't synced yet
  const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  const effectiveToken = accessToken || localStorageToken
  const hasToken = !!effectiveToken && effectiveToken.trim() !== ''
  const isAuthenticated = !!(hasToken || reduxUser)
  const isLoading = useAuthLoading

  // Log token status for debugging
  useEffect(() => {
    console.log("Dashboard auth check - Redux token:", !!accessToken, "localStorage token:", !!localStorageToken, "hasToken:", hasToken);
  }, [accessToken, localStorageToken, hasToken])

  // Fetch authenticated user profile (firstName/lastName/email) when authenticated and token is available
  const { data: authUser, isFetching: authUserFetching, error: authUserError } = useGetAuthenticatedUserQuery(undefined, {
    skip: !hasToken,
  })
  
  // Debug: Log when query is executed
  useEffect(() => {
    if (!hasToken) {
      console.log("Dashboard - Skipping profile fetch, no token. Redux:", !!accessToken, "localStorage:", !!localStorageToken);
    } else {
      console.log("Dashboard - Fetching profile with token. Redux:", !!accessToken, "localStorage:", !!localStorageToken, "effectiveToken length:", effectiveToken?.length);
    }
  }, [hasToken, accessToken, localStorageToken, effectiveToken])
  
  // Handle 401 errors from profile fetch - redirect to signin
  useEffect(() => {
    if (authUserError && (authUserError as any)?.status === 401) {
      dispatch(logOut())
      router.replace("/signin")
    }
  }, [authUserError, dispatch, router])

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

  // Protect dashboard - redirect unauthenticated users to signin
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/signin")
    }
  }, [isLoading, isAuthenticated, router])

  // Use fetched auth user first, then Redux, then fallback to legacy hook
  const user = authUser || reduxUser || useAuthUser

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

  // Fetch user's bookings to populate Activity tab
  const userId = user?.id || user?.userId || 0;
  const { data: bookingsResponse, isLoading: loadingBookings } = useGetBookingsByUserQuery(
    { userId, page: 0, size: 20 },
    { skip: !hasToken || !userId }
  );
  
  // Extract bookings array from response
  const userBookings = Array.isArray(bookingsResponse?.content)
    ? bookingsResponse.content
    : Array.isArray(bookingsResponse?.data)
    ? bookingsResponse.data
    : Array.isArray(bookingsResponse)
    ? bookingsResponse
    : [];

  // Fetch notifications from API
  const { data: notificationsResponse, isLoading: loadingNotifications } = useGetNotificationsQuery(
    { page: 0, size: 20 },
    { skip: !hasToken }
  );
  
  // Extract notifications array from response (handle different response formats)
  const notifications = Array.isArray(notificationsResponse?.data) 
    ? notificationsResponse.data 
    : Array.isArray(notificationsResponse) 
    ? notificationsResponse 
    : [];

  // Booking mutation for seat allocation flow
  const [createBooking, { isLoading: creatingBooking }] = useCreateBookingMutation()

  // Fetch schedules using filter endpoint - filter by route and date if selected
  const { data: schedulesResponse, isLoading: loadingSchedules } = useFilterSchedulesQuery(
    {
      ...(from && { origin: from }),
      ...(to && { destination: to }),
      ...(departure && { startDate: new Date(departure).toISOString() }),
      status: 'OPEN', // Only show open schedules
      page: 0,
      size: 50,
    },
    { skip: !hasToken || !from || !to } // Only fetch when both from and to are selected
  );
  
  // Extract schedules from response
  const filteredSchedules = Array.isArray(schedulesResponse?.content)
    ? schedulesResponse.content
    : Array.isArray(schedulesResponse?.data)
    ? schedulesResponse.data
    : Array.isArray(schedulesResponse)
    ? schedulesResponse
    : [];
  
  // Group schedules by company/provider to show in transports tab
  const providerStats = useMemo(() => {
    if (loadingSchedules) return null;
    
    const providersMap = new Map();
    
    filteredSchedules.forEach((schedule: any) => {
      const companyName = schedule.companyName || schedule.company?.name || schedule.provider_name || 'Unknown Provider';
      const companyId = schedule.companyId || schedule.company?.id;
      const price = schedule.price || 0;
      
      if (!providersMap.has(companyId)) {
        providersMap.set(companyId, {
          provider_name: companyName,
          companyId,
          price,
          schedules: [schedule],
        });
      } else {
        const provider = providersMap.get(companyId);
        provider.schedules.push(schedule);
        // Use minimum price or average price
        provider.price = Math.min(provider.price, price);
      }
    });
    
    return {
      providers: Array.from(providersMap.values()),
    };
  }, [filteredSchedules, loadingSchedules]);
  
  // Calculate total pages based on providers
  const calculatedTotalPages = useMemo(() => {
    if (providerStats && Array.isArray(providerStats.providers)) {
      return Math.ceil(providerStats.providers.length / 4); // 4 companies per page
    }
    return totalPages;
  }, [providerStats, totalPages]);

  // Map provider stats to company objects for tabs
  const providerCompanies = useMemo(
    () =>
      providerStats && Array.isArray(providerStats.providers)
        ? (providerStats.providers as any[]).map((p: any) => {
            const schedules = Array.isArray(p.schedules) ? p.schedules : [];
            // Pick the first schedule for now (could be earliest/cheapest)
            const primarySchedule = schedules[0] || null;
            return {
              name: p.provider_name || p.name || "Provider",
              logo: "/Logo.png",
              price: p.price || primarySchedule?.price || 0,
              primarySchedule,
            };
          })
        : [],
    [providerStats],
  );

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
  
  // Calculate price based on available providers
  const selectedPrice = useMemo(() => {
    if (providerStats && Array.isArray(providerStats.providers) && providerStats.providers.length > 0) {
      // Use minimum price from available providers
      return Math.min(...providerStats.providers.map((p: any) => p.price || 0));
    }
    return 0; // No price if no providers available
  }, [providerStats]);
  
  const totalPrice = selectedPrice * totalPassengers

  const handleProceed = () => {
    if (!from || !to || !departure) {
      // Lightweight validation for demo purposes
      alert("Please select From, To and Departure date")
      return
    }
    if (totalPassengers === 0) {
      alert("Please select at least one passenger")
      return
    }
    if (selectedPrice === 0 || !providerStats || !Array.isArray(providerStats.providers) || providerStats.providers.length === 0) {
      alert("No available transporters found for this route. Please try a different route.")
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

  const handleLogout = () => {
    // Clear Redux auth state (this also clears localStorage via the reducer)
    dispatch(logOut())
    // Redirect to signin page
    router.replace("/signin")
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
        {(isLoading || !isAuthenticated) && (
          <div className="text-center text-gray-600 py-8">
            {isLoading ? "Loading dashboard..." : "Redirecting to sign in..."}
          </div>
        )}
        {!isLoading && isAuthenticated && (
          <>
            <DashboardHeader
          userName={
            user?.lastName ||
            user?.last_name ||
            user?.firstName ||
            user?.first_name ||
            ""
          }
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
            totalPages={calculatedTotalPages}
            companies={
              loadingSchedules
                ? []
                : providerCompanies
            }
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
            {showSeatAllocation && selectedCompareCompany ? (
              <SeatAllocation
                company={selectedCompareCompany}
                from={from || "Lagos"}
                to={to || "Abuja"}
                onBack={() => setShowSeatAllocation(false)}
                onProceed={async ({ scheduleId, seatNumber }) => {
                  if (!user) {
                    alert("Please sign in again to complete your booking.")
                    router.replace("/signin")
                    return
                  }

                  const userId = (user as any)?.id || (user as any)?.userId
                  if (!userId) {
                    alert("Unable to determine your user ID. Please sign in again.")
                    router.replace("/signin")
                    return
                  }

                  try {
                    const res: any = await createBooking({
                      scheduleId,
                      userId,
                      seatNumber: String(seatNumber),
                    }).unwrap()

                    const paymentLink =
                      res?.paymentLink ||
                      res?.data?.paymentLink

                    if (paymentLink) {
                      // Redirect directly to Flutterwave payment link
                      window.location.href = paymentLink
                    } else {
                      alert("Booking created, but payment link was not returned.")
                    }
                  } catch (err: any) {
                    console.error("Error creating booking:", err)
                    alert(
                      err?.data?.message ||
                        "Failed to create booking. Please try again.",
                    )
                  }
                }}
              />
            ) : selectedCompareCompany ? (
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
                  onProceed={() => setShowSeatAllocation(true)}
                  onBack={() => setSelectedCompareCompany(null)}
                />
            </div>
            ) : (
              <CompareTab
                from={from || "Lagos"}
                to={to || "Abuja"}
                currentPage={currentPage}
                totalPages={calculatedTotalPages}
                companies={loadingSchedules ? [] : providerCompanies}
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
            {/* Header with Notifications title and Booking History button */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Notifications</h2>
              <button
                onClick={() => {
                  router.push("/dashboard/booking-history");
                }}
                className="flex items-center gap-2 bg-[#8B2323] hover:bg-[#7A1F1F] text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base shadow-sm cursor-pointer"
              >
                <Image 
                  src="/BookingHistory.png" 
                  alt="Booking History" 
                  width={20} 
                  height={20} 
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
                <span>Booking History</span>
              </button>
            </div>
            
            {/* Always show notifications section */}
            {loadingNotifications ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-600">Loading notifications...</div>
              </div>
            ) : (
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
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <FaExclamationTriangle className="text-gray-400 w-12 h-12 mb-4" />
                      <p className="text-sm text-gray-600 font-medium">No Notifications Yet</p>
                    </div>
                  ) : (
                    notifications.map((notification: any, idx: number) => {
                      // Format time ago
                      const createdAt = notification.created_at || notification.createdAt || notification.timestamp;
                      const timeAgo = createdAt 
                        ? (() => {
                            const diff = Date.now() - new Date(createdAt).getTime();
                            const minutes = Math.floor(diff / (1000 * 60));
                            const hours = Math.floor(diff / (1000 * 60 * 60));
                            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                            if (days > 0) return `${days} ${days === 1 ? 'Day' : 'Days'} ago`;
                            if (hours > 0) return `${hours} ${hours === 1 ? 'Hour' : 'Hours'} ago`;
                            return `${minutes} ${minutes === 1 ? 'Min' : 'Mins'} ago`;
                          })()
                        : 'Recently';
                      
                      // Choose icon based on notification type
                      const getIcon = () => {
                        const type = notification.type?.toLowerCase() || notification.notification_type?.toLowerCase() || '';
                        if (type.includes('wifi') || type.includes('wifi')) return <FaWifi className="text-[#8B2323] w-5 h-5 mt-0.5 flex-shrink-0" />;
                        if (type.includes('booking') || type.includes('confirm')) return <FaCheckCircle className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />;
                        return <FaExclamationTriangle className="text-[#8B2323] w-5 h-5 mt-0.5 flex-shrink-0" />;
                      };
                      
                      return (
                        <div key={notification.id || notification.notification_id || idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          {getIcon()}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-gray-800">
                                {notification.title || notification.subject || 'Notification'}
                              </span>
                              <span className="text-xs text-gray-500">{timeAgo}</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {notification.message || notification.content || notification.body || 'No message'}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
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
          </>
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