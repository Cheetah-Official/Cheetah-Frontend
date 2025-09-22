"use client"

import Image from "next/image"
import { FaBus, FaBell, FaCog, FaSignOutAlt, FaWifi, FaCheckCircle, FaExclamationCircle } from "react-icons/fa"

export default function NotificationsPage() {
  return (
    <div className="min-h-screen flex bg-[#F9F9F9]">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r flex flex-col justify-between py-8 px-4 min-h-screen">
        <div>
          <div className="flex items-center mb-12">
            <Image src="/Logo.png" alt="Cheetah Logo" width={40} height={40} className="mr-2" />
            <span className="text-[#8B2323] font-bold text-xl">Cheetah</span>
          </div>
          <nav className="space-y-2">
            <button className="flex items-center w-full px-3 py-2 rounded-lg text-[#8B2323] hover:bg-[#8B2323]/10 gap-3 cursor-pointer">
              <FaBus /> Transports
            </button>
            <button className="flex items-center w-full px-3 py-2 rounded-lg bg-[#8B2323] text-white font-semibold gap-3 cursor-pointer">
              <FaBell /> Notifications
            </button>
            <button className="flex items-center w-full px-3 py-2 rounded-lg text-[#8B2323] hover:bg-[#8B2323]/10 gap-3 cursor-pointer">
              <FaCog /> Settings
            </button>
          </nav>
        </div>
        <button className="flex items-center gap-2 text-[#8B2323] mt-8 cursor-pointer">
          <FaSignOutAlt /> Log out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-[#8B2323]/80 flex items-center gap-2">
            <span className="text-[#E08B2F] text-3xl">👋</span> Welcome, <span className="font-bold">Docky</span>
          </h2>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#8B2323]">
            <Image src="/Hero-2.jpeg" alt="User" width={40} height={40} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Ticket Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <Image src="/Chisco-Logo.png" alt="Chisco" width={48} height={48} className="object-contain" />
                <div>
                  <div className="font-semibold text-lg text-[#222]">Chisco</div>
                  <div className="text-gray-500 text-sm">Lagos - Abuja</div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">2 Passengers</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-gray-500 text-sm">Departure Date</span>
                <span className="font-semibold text-[#8B2323]">July 28th, 2025</span>
                <span className="ml-auto text-2xl font-bold text-[#8B2323]">4 days</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full mb-3">
                <div className="h-2 bg-[#8B2323] rounded-full" style={{ width: '60%' }} />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center gap-1 text-green-600 text-sm"><FaCheckCircle /> Free WiFi</span>
                <span className="flex items-center gap-1 text-green-600 text-sm"><FaCheckCircle /> Free Insurance</span>
              </div>
              <button className="bg-[#8B2323] text-white px-6 py-2 rounded-lg font-semibold cursor-pointer w-full">Download Ticket</button>
            </div>
            {/* Notification List */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="font-semibold text-base mb-3">Notification</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#F6F6F6]">
                  <FaWifi className="text-[#8B2323] w-6 h-6 mt-1" />
                  <div className="flex-1">
                    <div className="font-semibold text-[#8B2323]">Wi-Fi Code</div>
                    <div className="text-gray-500 text-xs">Your free onboard Wi-Fi code is ready. Stay connected throughout your trip.</div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">30 Mins ago</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#F6F6F6]">
                  <FaExclamationCircle className="text-[#E08B2F] w-6 h-6 mt-1" />
                  <div className="flex-1">
                    <div className="font-semibold text-[#E08B2F]">Reminder</div>
                    <div className="text-gray-500 text-xs">Trip starts soon. Don&apos;t forget to...</div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">2 Days ago</span>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <FaWifi className="text-[#8B2323] w-6 h-6" />
              <span className="font-semibold text-lg">Wi-Fi Code</span>
              <span className="ml-auto text-xs text-gray-400">30 Mins ago</span>
            </div>
            <div className="text-gray-500 text-sm mb-2">
              You&apos;ve received a free Wi-Fi code for your upcoming trip. Stay connected and enjoy smooth browsing throughout your journey — courtesy of Cheetah.
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm mb-2">
                <tbody>
                  <tr>
                    <td className="py-1 text-gray-500">Wi-Fi Code:</td>
                    <td className="py-1"><span className="bg-[#8B2323]/20 text-[#8B2323] px-3 py-1 rounded font-semibold">CHEETAH-8324</span></td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-500">Trip Date:</td>
                    <td className="py-1 font-semibold">June 24, 2025</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-500">Transport Provider:</td>
                    <td className="py-1">Chisco</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-500">Coverage:</td>
                    <td className="py-1 font-semibold">Full trip duration</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-500">Status:</td>
                    <td className="py-1 text-green-600 font-semibold">Active</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-500">Cost:</td>
                    <td className="py-1 text-[#E08B2F] font-semibold">Free</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-2 text-[#E08B2F] text-sm mt-2">
              <FaExclamationCircle className="w-5 h-5" />
              <span>To use, simply connect to the "Cheetah Bus Wi-Fi" network and enter the code when prompted.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 