"use client";

import { useState } from "react";
import Image from "next/image";
import { FaChevronRight, FaExchangeAlt } from "react-icons/fa";

export default function TransportDashboard() {
  const [busSeats, setBusSeats] = useState("18 Seats");
  const [from, setFrom] = useState("Lagos");
  const [to, setTo] = useState("Abuja");
  const [busFare, setBusFare] = useState("34,000.00");

  const [trips] = useState([
    {
      id: 1,
      busNo: "1.",
      route: "Lagos - Abuja",
      departureDate: "20 - Dec - 2025",
      passengers: "18 Adults",
    },
    {
      id: 2,
      busNo: "2.",
      route: "Abuja - Edo",
      departureDate: "20 - Dec - 2025",
      passengers: "3 Children / 15 Adults",
    },
    {
      id: 3,
      busNo: "3.",
      route: "Lagos - Calabar",
      departureDate: "21 - Dec - 2025",
      passengers: "1 Child / 17 Adults",
    },
    {
      id: 4,
      busNo: "4.",
      route: "Lagos - Abuja",
      departureDate: "21 - Dec - 2025",
      passengers: "18 Adults",
    },
    {
      id: 5,
      busNo: "5.",
      route: "Abuja - Edo",
      departureDate: "21 - Dec - 2025",
      passengers: "3 Children / 15 Adults",
    },
    {
      id: 6,
      busNo: "6.",
      route: "Lagos - Kano",
      departureDate: "22 - Dec - 2025",
      passengers: "20 Adults",
    },
    {
      id: 7,
      busNo: "7.",
      route: "Abuja - Lagos",
      departureDate: "22 - Dec - 2025",
      passengers: "2 Children / 16 Adults",
    },
    {
      id: 8,
      busNo: "8.",
      route: "Calabar - Lagos",
      departureDate: "23 - Dec - 2025",
      passengers: "18 Adults",
    },
    {
      id: 9,
      busNo: "9.",
      route: "Edo - Abuja",
      departureDate: "23 - Dec - 2025",
      passengers: "4 Children / 14 Adults",
    },
    {
      id: 10,
      busNo: "10.",
      route: "Lagos - Abuja",
      departureDate: "24 - Dec - 2025",
      passengers: "18 Adults",
    },
  ]);

  const handleSwapCities = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSaveChanges = () => {
    // TODO: Implement save functionality
    alert("Changes saved successfully!");
  };

  return (
    <main className="flex-1 bg-[#F3F3F3]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-2xl">👋</span>
          <h1 className="text-xl font-medium">Welcome to God is Good Motors</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">RC-TCF1234</span>
          <div className="w-10 h-10 rounded-full bg-[#8B2323] flex items-center justify-center">
            <span className="text-white font-bold text-sm">GIGM</span>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="p-8 bg-[#F3F3F3]">
        {/* Grid Layout: 3 columns, 2 rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Passengers Card - Row 1, Col 1 */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-gray-600 text-sm font-medium">
                Total Passengers Insured
              </h3>
              <FaChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-4">13,400</p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                +23.6%
              </span>
              <span className="text-gray-500 text-xs">vs Last month</span>
              <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                -3.4%
              </span>
              <span className="text-gray-500 text-xs">vs Last week</span>
            </div>
          </div>

          {/* Active Wi-Fi Card - Row 1, Col 2 */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-gray-600 text-sm font-medium">
                Active Wi-Fi Code Used
              </h3>
              <FaChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-4">310</p>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                +84.2%
              </span>
              <span className="text-gray-500 text-xs">vs Last week</span>
            </div>
          </div>

          {/* Price Management Card - Row 1 & 2, Col 3 (spans 2 rows) */}
          <div className="bg-white rounded-xl p-6 flex flex-col shadow-md md:row-span-2 h-full">
            <h3 className="text-gray-900 text-base font-bold mb-8">
              Price Management
            </h3>
            
            <div className="flex flex-col flex-1 justify-between space-y-6">
              {/* Bus Selection */}
              <div>
                <div className="relative inline-block">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 pointer-events-none">
                    Bus
                  </div>
                  <select
                    id="bus-seats"
                    value={busSeats}
                    onChange={(e) => setBusSeats(e.target.value)}
                    className="w-auto min-w-[220px] pl-12 pr-8 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] cursor-pointer"
                    aria-label="Select bus seats"
                  >
                    <option value="18 Seats" className="text-gray-900">18 Seats</option>
                    <option value="30 Seats" className="text-gray-900">30 Seats</option>
                    <option value="45 Seats" className="text-gray-900">45 Seats</option>
                  </select>
                </div>
              </div>

              {/* Route Selection */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">Route Selection</label>
                <div className="flex flex-col items-start space-y-2">
                  <select
                    id="from-city"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-[180px] px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] cursor-pointer"
                    aria-label="Select departure city"
                  >
                    <option value="Lagos" className="text-gray-900">Lagos</option>
                    <option value="Abuja" className="text-gray-900">Abuja</option>
                    <option value="Kano" className="text-gray-900">Kano</option>
                    <option value="Edo" className="text-gray-900">Edo</option>
                    <option value="Calabar" className="text-gray-900">Calabar</option>
                  </select>
                  <div className="w-[180px] flex justify-center">
                    <button
                      onClick={handleSwapCities}
                      className="p-1 text-orange-700 hover:text-orange-800 transition-colors cursor-pointer"
                      aria-label="Swap cities"
                    >
                      <FaExchangeAlt className="w-4 h-4" />
                    </button>
                  </div>
                  <select
                    id="to-city"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-[180px] px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] cursor-pointer"
                    aria-label="Select destination city"
                  >
                    <option value="Lagos" className="text-gray-900">Lagos</option>
                    <option value="Abuja" className="text-gray-900">Abuja</option>
                    <option value="Kano" className="text-gray-900">Kano</option>
                    <option value="Edo" className="text-gray-900">Edo</option>
                    <option value="Calabar" className="text-gray-900">Calabar</option>
                  </select>
                </div>
              </div>

              {/* Bus Fare */}
              <div className="mt-6">
                <div className="relative inline-block">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 pointer-events-none">
                    Bus Fare
                  </div>
                  <input
                    type="text"
                    value={busFare}
                    onChange={(e) => setBusFare(e.target.value)}
                    className="w-auto max-w-[200px] pl-20 pr-3 py-3 bg-white border border-gray-300 rounded-lg text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323]"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Save Changes Button - Pushed to bottom, aligned right */}
              <div className="mt-auto pt-4 flex justify-end">
                <button
                  onClick={handleSaveChanges}
                  className="bg-[#8B2323] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#7A1F1F] transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Trips Table - Row 2, Col 1 & 2 (spans 2 columns) */}
          <div className="md:col-span-2 bg-white rounded-xl overflow-hidden shadow-md flex flex-col">
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg font-medium text-gray-900">
                Trips & Passengers Data
              </h2>
            </div>

            <div className="overflow-x-auto overflow-y-auto h-[400px]">
              <table className="w-full">
                <thead className="bg-[#E0E0E0] sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                      Bus No.
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                      Departure Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                      Passengers
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {trips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {trip.busNo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {trip.route}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {trip.departureDate}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {trip.passengers}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}