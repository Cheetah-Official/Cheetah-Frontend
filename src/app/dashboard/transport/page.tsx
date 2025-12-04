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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-red-700 font-serif italic text-2xl font-bold">
              Cheetah
            </span>
            <span className="text-2xl">🐆</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">RC-TCF1234</span>
          <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full">
            <span className="font-bold">GIGM</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-screen border-r border-gray-200 p-4">
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-red-800 text-white rounded-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Dashboard</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                />
              </svg>
              <span>Buses & Routes</span>
            </button>
          </nav>

          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg mt-auto absolute bottom-8">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Log out</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Welcome Message */}
          <div className="mb-8 flex items-center gap-2 text-gray-600">
            <span className="text-2xl">👋</span>
            <h1 className="text-xl">Welcome to God is Good Motors</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Total Passengers Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
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
              <div className="flex items-center gap-4">
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
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
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
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                  +84.2%
                </span>
                <span className="text-gray-500 text-xs">vs Last week</span>
              </div>
            </div>
          </div>

          {/* Trips Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">
                Trips & Passengers Data
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Bus No.
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Route
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Departure Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Passengers
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Wi-Fi
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Insurance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
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
        </main>
      </div>
    </div>
  );
}
