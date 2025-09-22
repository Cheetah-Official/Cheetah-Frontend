"use client"

import Image from "next/image"
import { FaBus, FaBell, FaCog, FaSignOutAlt, FaChevronRight, FaChevronLeft, FaUser, FaWifi, FaCheckCircle, FaExclamationTriangle, FaDownload, FaBars, FaTimes, FaEnvelope, FaPhone, FaHome } from "react-icons/fa"
import { useState, useEffect } from "react"

const companies = [
  { name: "Peace Mass", logo: "/PeaceMass-Logo.jpg" },
  { name: "GIGM", logo: "/GIGMotors_Logo 1.png" },
  { name: "GUO", logo: "/GUO.png" },
  { name: "Chisco", logo: "/CHISCO.png" },
]

export default function DashboardPage() {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [departure, setDeparture] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [passengers, setPassengers] = useState(1)
  const [activeTab, setActiveTab] = useState("transports")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  return (
    <div className="min-h-screen flex bg-[#F9F9F9]">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 sm:w-80 md:w-64 lg:w-56 xl:w-64 2xl:w-72 bg-white border-r flex flex-col justify-between py-4 sm:py-6 md:py-8 px-3 sm:px-4 min-h-screen transform transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div>
          <div className="flex items-center justify-between mb-8 sm:mb-10 md:mb-12">
            <Image src="/Cheetah 2.svg" alt="Cheetah" width={100} height={38} className="sm:w-[120px] sm:h-[45px]" />
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
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
                setActiveTab("transports")
                setMobileMenuOpen(false)
              }}
            >
              <FaBus className="w-4 h-4 sm:w-5 sm:h-5" /> Transports
            </button>
            <button 
              className={`flex items-center w-full px-3 py-2.5 sm:py-3 rounded-lg font-semibold gap-3 cursor-pointer transition-colors text-sm sm:text-base ${
                activeTab === "notifications" 
                  ? "bg-[#8B2323] text-white" 
                  : "text-[#8B2323] hover:bg-[#8B2323]/10"
              }`}
              onClick={() => {
                setActiveTab("notifications")
                setMobileMenuOpen(false)
              }}
            >
              <FaBell className="w-4 h-4 sm:w-5 sm:h-5" /> Notifications
            </button>
            <button 
              className={`flex items-center w-full px-3 py-2.5 sm:py-3 rounded-lg font-semibold gap-3 cursor-pointer transition-colors text-sm sm:text-base ${
                activeTab === "settings" 
                  ? "bg-[#8B2323] text-white" 
                  : "text-[#8B2323] hover:bg-[#8B2323]/10"
              }`}
              onClick={() => {
                setActiveTab("settings")
                setMobileMenuOpen(false)
              }}
            >
              <FaCog className="w-4 h-4 sm:w-5 sm:h-5" /> Settings
            </button>
          </nav>
        </div>
        <button className="flex items-center gap-2 text-[#8B2323] mt-6 sm:mt-8 cursor-pointer text-sm sm:text-base">
          <FaSignOutAlt className="w-4 h-4 sm:w-5 sm:h-5" /> Log out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 w-full">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 md:hidden">
          <button 
            className="p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(true)}
          >
            <FaBars className="text-gray-600 w-5 h-5" />
          </button>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#8B2323]">
            <Image src="/Hero-2.jpeg" alt="User" width={32} height={32} className="sm:w-10 sm:h-10" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-[#8B2323]/80 flex items-center gap-2">
            <span className="text-[#E08B2F] text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">👋</span> Welcome, <span className="font-bold">Docky</span>
          </h2>
          <div className="hidden md:block w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full overflow-hidden border-2 border-[#8B2323]">
            <Image src="/Hero-2.jpeg" alt="User" width={40} height={40} className="lg:w-12 lg:h-12 xl:w-14 xl:h-14" />
          </div>
        </div>

        {/* Transports Tab */}
        {activeTab === "transports" && (
          <div className="bg-[#F6F6F6] rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col gap-3 sm:gap-4 md:gap-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-start gap-2 w-full sm:w-auto">
                <span className="text-gray-500 text-xs sm:text-sm md:text-base">From</span>
                <select value={from} onChange={e => setFrom(e.target.value)} className="px-2 sm:px-3 md:px-4 py-2 rounded-lg border text-gray-500 bg-white focus:outline-none cursor-pointer w-full sm:w-auto text-sm sm:text-base">
                  <option value="">Select City</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Kano">Kano</option>
                </select>
              </div>
              <FaChevronRight className="text-gray-400 mx-2 hidden sm:block" />
              <div className="flex flex-col sm:flex-row items-start gap-2 w-full sm:w-auto">
                <span className="text-gray-500 text-xs sm:text-sm md:text-base">To</span>
                <select value={to} onChange={e => setTo(e.target.value)} className="px-2 sm:px-3 md:px-4 py-2 rounded-lg border text-gray-500 bg-white focus:outline-none cursor-pointer w-full sm:w-auto text-sm sm:text-base">
                  <option value="">Select City</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Kano">Kano</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-2 w-full sm:w-auto sm:ml-4">
                <span className="text-gray-500 text-xs sm:text-sm md:text-base">Departure Date</span>
                <input 
                  type="text" 
                  value={departure}
                  onChange={(e) => handleDateChange(e.target.value, setDeparture)}
                  placeholder="DD/MM/YYYY" 
                  className="px-2 sm:px-3 md:px-4 py-2 rounded-lg border text-gray-700 bg-white focus:outline-none w-full sm:w-28 md:w-32 font-medium text-sm sm:text-base" 
                />
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-2 w-full sm:w-auto sm:ml-4">
                <span className="text-gray-500 text-xs sm:text-sm md:text-base">Return Date <span className="text-xs text-[#E08B2F]">(if round trip)</span></span>
                <input 
                  type="text" 
                  value={returnDate}
                  onChange={(e) => handleDateChange(e.target.value, setReturnDate)}
                  placeholder="DD/MM/YYYY" 
                  className="px-2 sm:px-3 md:px-4 py-2 rounded-lg border text-gray-700 bg-white focus:outline-none w-full sm:w-28 md:w-32 font-medium text-sm sm:text-base" 
                />
              </div>
            </div>

            {/* Companies and Bus */}
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-start">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 flex-1">
                {companies.map((company, idx) => (
                  <button key={company.name} className="flex items-center gap-2 sm:gap-3 bg-white rounded-lg shadow-sm px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 cursor-pointer border border-transparent hover:border-[#8B2323] transition">
                    <Image src={company.logo} alt={company.name} width={28} height={28} className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain" />
                    <span className="font-semibold text-[#222] text-xs sm:text-sm md:text-base">{company.name}</span>
                  </button>
                ))}
              </div>
              <div className="flex-shrink-0 relative mt-6 sm:mt-8 lg:mt-16 self-center lg:self-start">
                {/* Passenger Counter positioned in upper-right above bus */}
                <div className="absolute -top-10 sm:-top-12 md:-top-16 -right-1 sm:-right-2 md:-right-4 bg-gray-100 rounded-lg shadow-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border border-gray-200">
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                    <span className="text-gray-600 font-medium text-xs sm:text-sm">Passenger</span>
                    <div className="flex items-center bg-gray-200 rounded-lg border border-gray-300">
                      <button type="button" className="px-1.5 sm:px-2 md:px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-300 transition-colors text-xs sm:text-sm" onClick={() => setPassengers(p => Math.max(1, p - 1))}>-</button>
                      <span className="px-1.5 sm:px-2 md:px-4 py-1 font-bold text-black text-xs sm:text-sm">{passengers}</span>
                      <button type="button" className="px-1.5 sm:px-2 md:px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-300 transition-colors text-xs sm:text-sm" onClick={() => setPassengers(p => p + 1)}>+</button>
                    </div>
                  </div>
                </div>
                <Image src="/Cheetah Bus Image 1.png" alt="Cheetah Bus" width={200} height={120} className="w-48 h-28 sm:w-56 sm:h-32 md:w-64 md:h-36 lg:w-[300px] lg:h-[180px] xl:w-[350px] xl:h-[200px] object-contain" />
              </div>
            </div>

            {/* Proceed Button */}
            <div className="flex justify-center lg:justify-end mt-3 sm:mt-4 lg:mt-2">
              <button className="bg-[#8B2323] text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base md:text-lg cursor-pointer w-full sm:w-auto">Proceed</button>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Panel - Settings Categories */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Settings</h3>
              
              {/* Account Settings - Active */}
              <div className="bg-gray-100 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">Account Settings</span>
                  <FaChevronRight className="text-gray-500" />
                </div>
              </div>

              {/* General Settings */}
              <div className="bg-gray-100 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">General Settings</span>
                  <FaChevronRight className="text-gray-500" />
                </div>
              </div>

              {/* Help & Support */}
              <div className="bg-gray-100 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">Help & Support</span>
                  <FaChevronRight className="text-gray-500" />
                </div>
              </div>

              {/* Terms & Policies */}
              <div className="bg-gray-100 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">Terms & Policies</span>
                  <FaChevronRight className="text-gray-500" />
                </div>
              </div>
            </div>

            {/* Right Panel - User Profile */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                {/* Large Profile Picture */}
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-gray-200">
                  <Image 
                    src="/Hero-2.jpeg" 
                    alt="User Profile" 
                    width={128} 
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* User Name */}
                <h3 className="text-xl font-semibold text-gray-800">Godwin Obi</h3>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaEnvelope className="text-gray-500 w-5 h-5" />
                  <span className="text-gray-700">godwinobi17@gmail.com</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaPhone className="text-gray-500 w-5 h-5" />
                  <span className="text-gray-700">08110051665</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaHome className="text-gray-500 w-5 h-5" />
                  <span className="text-gray-700">Ikorodu, Lagos.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Left Column - Narrow */}
            <div className="w-full lg:w-1/3 space-y-3 sm:space-y-4">
              {/* Ticket Details Card */}
              <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Ticket Details</h3>
                
                {/* Company and Passenger Info */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Image src="/CHISCO.png" alt="Chisco" width={36} height={36} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain" />
                    <div>
                      <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">Chisco</h4>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base">Lagos - Abuja</p>
                    </div>
                  </div>
                  <div className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                    <span className="text-gray-800 font-medium text-xs sm:text-sm">2 Passengers</span>
                  </div>
                </div>
                
                {/* Departure Date and Progress */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span className="text-gray-500 text-xs sm:text-sm md:text-base">Departure Date</span>
                      <span className="text-gray-800 font-bold text-xs sm:text-sm md:text-base">July 28th, 2025</span>
                    </div>
                    <span className="text-gray-800 font-bold text-xs sm:text-sm md:text-base">4 days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <div className="bg-[#8B2323] h-1.5 sm:h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                {/* Amenities */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-6 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 text-base sm:text-lg">✓</span>
                    <span className="text-gray-500 text-xs sm:text-sm">Free WiFi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 text-base sm:text-lg">✓</span>
                    <span className="text-gray-500 text-xs sm:text-sm">Free Insurance</span>
                  </div>
                </div>
                
                {/* Download Button */}
                <div className="flex justify-center lg:justify-end">
                  <button className="bg-[#8B2323] text-white py-2.5 sm:py-3 px-4 sm:px-6 md:px-8 rounded-lg font-semibold hover:bg-[#7A1F1F] transition-colors w-full sm:w-auto text-sm sm:text-base">
                    Download Ticket
                  </button>
                </div>
              </div>

              {/* Notification List Card */}
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Notification</h3>
                <div className="space-y-2 sm:space-y-3 max-h-32 sm:max-h-48 overflow-y-auto">
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                    <FaWifi className="text-[#8B2323] w-3 h-3 sm:w-4 sm:h-4 mt-0.5 sm:mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs sm:text-sm font-semibold text-gray-800">WiFi Connected</span>
                        <span className="text-xs text-gray-500">2 min ago</span>
                      </div>
                      <p className="text-xs text-gray-600">Your device is now connected to the free WiFi network.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                    <FaCheckCircle className="text-green-500 w-3 h-3 sm:w-4 sm:h-4 mt-0.5 sm:mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs sm:text-sm font-semibold text-gray-800">Ticket Confirmed</span>
                        <span className="text-xs text-gray-500">1 hour ago</span>
                      </div>
                      <p className="text-xs text-gray-600">Your ticket has been confirmed and is ready for download.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                    <FaExclamationTriangle className="text-yellow-500 w-3 h-3 sm:w-4 sm:h-4 mt-0.5 sm:mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs sm:text-sm font-semibold text-gray-800">Departure Reminder</span>
                        <span className="text-xs text-gray-500">3 hours ago</span>
                      </div>
                      <p className="text-xs text-gray-600">Your bus departs in 4 days. Don't forget to arrive early!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Wide */}
            <div className="w-full lg:w-2/3 space-y-3 sm:space-y-4">
              {/* Trip Progress Card */}
              <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Trip Progress</h3>
                
                {/* Progress Steps */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#8B2323] rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">1</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Ticket Booked</h4>
                      <p className="text-xs sm:text-sm text-gray-600">July 24th, 2025 at 2:30 PM</p>
                    </div>
                    <FaCheckCircle className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#8B2323] rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">2</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Payment Confirmed</h4>
                      <p className="text-xs sm:text-sm text-gray-600">July 24th, 2025 at 2:32 PM</p>
                    </div>
                    <FaCheckCircle className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs sm:text-sm">3</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Boarding</h4>
                      <p className="text-xs sm:text-sm text-gray-600">July 28th, 2025 at 6:00 AM</p>
                    </div>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded-full"></div>
                  </div>
                  
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs sm:text-sm">4</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Departure</h4>
                      <p className="text-xs sm:text-sm text-gray-600">July 28th, 2025 at 7:00 AM</p>
                    </div>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded-full"></div>
                  </div>
                  
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs sm:text-sm">5</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Arrival</h4>
                      <p className="text-xs sm:text-sm text-gray-600">July 28th, 2025 at 3:00 PM</p>
                    </div>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Amenities Card */}
              <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Trip Amenities</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <FaWifi className="text-[#8B2323] w-4 h-4 sm:w-5 sm:h-5" />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Free WiFi</h4>
                      <p className="text-xs sm:text-sm text-gray-600">High-speed internet access</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <FaDownload className="text-[#8B2323] w-4 h-4 sm:w-5 sm:h-5" />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Free Insurance</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Comprehensive travel coverage</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <FaUser className="text-[#8B2323] w-4 h-4 sm:w-5 sm:h-5" />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Professional Driver</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Experienced and certified</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <FaCheckCircle className="text-[#8B2323] w-4 h-4 sm:w-5 sm:h-5" />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Safety First</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Regular maintenance checks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 