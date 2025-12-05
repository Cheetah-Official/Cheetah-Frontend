"use client";

import { useState } from "react";

export default function TransportDashboard() {
  const [trips] = useState([
    {
      id: 1,
      busNo: "1.",
      route: "Lagos - Abuja",
      departureDate: "20 - Dec - 2025",
      passengers: "18 Adults",
      wifi: "Active",
      insurance: "Active",
    },
    {
      id: 2,
      busNo: "2.",
      route: "Abuja - Edo",
      departureDate: "20 - Dec - 2025",
      passengers: "3 Children / 15 Adults",
      wifi: "Active",
      insurance: "Active",
    },
    {
      id: 3,
      busNo: "3.",
      route: "Lagos - Calabar",
      departureDate: "21 - Dec - 2025",
      passengers: "1 Child / 17 Adults",
      wifi: "Pending",
      insurance: "Pending",
    },
    {
      id: 4,
      busNo: "4.",
      route: "Lagos - Abuja",
      departureDate: "21 - Dec - 2025",
      passengers: "18 Adults",
      wifi: "Pending",
      insurance: "Active",
    },
    {
      id: 5,
      busNo: "5.",
      route: "Abuja - Edo",
      departureDate: "21 - Dec - 2025",
      passengers: "3 Children / 15 Adults",
      wifi: "Pending",
      insurance: "Active",
    },
  ]);

  return (
    <main className="flex-1">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-2xl">👋</span>
          <h1 className="text-xl">Welcome to God is Good Motors</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">RC-TCF1234</span>
          <div className="flex items-center gap-2">
            <img src="/GIGMotors_Logo 1.png" alt="GIGM Logo" className="h-10 w-10" />
            <span className="font-bold text-gray-900">GIGM</span>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="p-8 space-y-6">
        {/* Stats Cards Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Total Passengers Card */}
          <div className="bg-[#F3F3F3] rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-gray-600 text-sm">
                Total Passengers Insured
              </h3>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
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

          {/* Active Wi-Fi Card */}
          <div className="bg-[#F3F3F3] rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-gray-600 text-sm">
                Active Wi-Fi Code Used
              </h3>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-4">310</p>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                +84.2%
              </span>
              <span className="text-gray-500 text-xs">vs Last week</span>
            </div>
          </div>
        </div>

        {/* Trips Table */}
        <div className="bg-[#F3F3F3] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Trips & Passengers Data
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Bus No.
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Departure Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Passengers
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Wi-Fi
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Insurance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-100">
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
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          trip.wifi === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {trip.wifi}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          trip.insurance === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {trip.insurance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}