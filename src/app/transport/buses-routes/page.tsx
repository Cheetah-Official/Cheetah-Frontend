"use client";

import { useState } from "react";
import Image from "next/image";
import { FaPlus, FaChevronRight, FaBus } from "react-icons/fa";

export default function BusesRoutesPage() {
  const [buses] = useState([
    {
      id: 1,
      busNumber: "KJA-453XZ",
      route: "Lagos - Abuja",
      capacity: "14 - 18 Seats",
      wifiStatus: "Active",
      scheduledTime: "In 2 hours",
      time: "(3:35 PM)",
    },
    {
      id: 2,
      busNumber: "EKY-709XM",
      route: "Awka - Lagos",
      capacity: "49 - 53 Seats",
      wifiStatus: "Active",
      scheduledTime: "Tonight at",
      time: "(8:35 PM)",
    },
    {
      id: 3,
      busNumber: "ABJ-903KT",
      route: "Lagos - Ilorin",
      capacity: "14 - 18 Seats",
      wifiStatus: "Active",
      scheduledTime: "Tomorrow at",
      time: "(8:35 AM)",
    },
    {
      id: 4,
      busNumber: "KRD-644XY",
      route: "Abeokuta - Lokoja",
      capacity: "14 - 18 Seats",
      wifiStatus: "Pending",
      scheduledTime: "Thurs, Dec 4",
      time: "(1:35 PM)",
    },
    {
      id: 5,
      busNumber: "BNW-762AX",
      route: "Lagos - Asaba",
      capacity: "54 - 59 Seats",
      wifiStatus: "Active",
      scheduledTime: "Sat, Dec 6 at",
      time: "(1:35 PM)",
    },
    {
      id: 6,
      busNumber: "OGB-198PQ",
      route: "Uyo - Lagos",
      capacity: "49 - 53 Seats",
      wifiStatus: "Pending",
      scheduledTime: "Mon, Dec 8 at",
      time: "(8:35 AM)",
    },
    {
      id: 7,
      busNumber: "BNW-932AX",
      route: "Lagos - Benin City",
      capacity: "14 - 18 Seats",
      wifiStatus: "Pending",
      scheduledTime: "Tue, Dec 9 at",
      time: "(3:35 PM)",
    },
    {
      id: 8,
      busNumber: "EKY-817XM",
      route: "Ibadan - Rivers",
      capacity: "14 - 18 Seats",
      wifiStatus: "Active",
      scheduledTime: "Wed, Dec 10 at",
      time: "(6:35 PM)",
    },
    {
      id: 9,
      busNumber: "KRD-604XY",
      route: "Lagos - Abuja",
      capacity: "54 - 59 Seats",
      wifiStatus: "Active",
      scheduledTime: "Thurs, Dec 10 at",
      time: "(8:35 AM)",
    },
  ]);

  return (
    <main className="flex-1 bg-[#F3F3F3]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-medium text-gray-600">Buses & Routes</h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">RC-TCF1234</span>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#8B2323] flex items-center justify-center">
              <span className="text-white font-bold text-sm">GIGM</span>
            </div>
            {/* <div className="w-10 h-10 rounded-full bg-[#8B2323] flex items-center justify-center">
              <span className="text-white font-bold text-sm">GIGM</span>
            </div> */}
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="p-8">
        <div className="flex gap-6 items-start">
          {/* Buses Table */}
          <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                  <thead className="bg-[#E0E0E0]">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                        Bus Number
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                        Route
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                        Wi-Fi Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                        Scheduled Time
                      </th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {buses.map((bus) => (
                    <tr key={bus.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {bus.busNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {bus.route}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {bus.capacity}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                            bus.wifiStatus === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {bus.wifiStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {bus.scheduledTime}{" "}
                        <span className="text-gray-500">{bus.time}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 space-y-4">
            {/* Add New Bus Button - positioned at top */}
            <div className="flex justify-start">
              <button className="bg-[#8B2323] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#7A1F1F] transition-colors cursor-pointer">
                <FaPlus className="w-4 h-4" />
                <span>Add New Bus</span>
              </button>
            </div>

            {/* Active Buses Location Card - smaller, moved down */}
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="text-base font-medium text-gray-900 mb-3">
                Active Buses Location
              </h3>
              {/* Map placeholder - smaller */}
              <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center text-gray-400 relative overflow-hidden">
                <span className="text-xs">Map of Nigeria</span>
                {/* Red bus icon marker */}
                <div className="absolute bottom-12 right-16">
                  <div className="w-5 h-5 bg-[#8B2323] rounded-full flex items-center justify-center">
                    <FaBus className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                {/* Dashed route line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M 200 150 Q 250 100 300 80"
                    stroke="#FF8C00"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            {/* Total Active Bus Card */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Total Active Bus</h3>
                <FaChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-end gap-4 mb-2">
                <p className="text-5xl font-bold text-gray-900">6</p>
                <div className="flex-1 flex justify-end">
                  <Image
                    src="/Cheetah Bus Image 1.png"
                    alt="Bus"
                    width={128}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">On the road</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}