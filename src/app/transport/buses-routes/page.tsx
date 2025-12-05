"use client";

import { useState } from "react";

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
      busNumber: "BNW-782AX",
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
    <main className="flex-1">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl text-gray-600">Buses & Routes</h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">RC-TCF1234</span>
          <div className="flex items-center gap-2">
            <img
              src="/GIGMotors_Logo 1.png"
              alt="GIGM Logo"
              className="h-10 w-10"
            />
            <span className="font-bold text-gray-900">GIGM</span>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="p-8">
        <div className="flex gap-6">
          {/* Buses Table */}
          <div className="flex-1 bg-[#F3F3F3] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="grid grid-cols-5 gap-4 flex-1 text-sm font-medium text-gray-600">
                <span>Bus Number</span>
                <span>Route</span>
                <span className="text-blue-600 underline cursor-pointer">
                  Capacity
                </span>
                <span>Wi-Fi Status</span>
                <span>Scheduled Time</span>
              </div>
              <button className="bg-red-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 ml-6">
                <span className="text-xl">+</span>
                <span>Add New Bus</span>
              </button>
            </div>

            <div className="divide-y divide-gray-200">
              {buses.map((bus, index) => (
                <div
                  key={bus.id}
                  className="grid grid-cols-5 gap-4 p-6 hover:bg-gray-100 items-center"
                >
                  <span className="text-sm text-gray-900">
                    {index + 1}. {bus.busNumber}
                  </span>
                  <span className="text-sm text-gray-900">
                    {bus.route}
                  </span>
                  <span className="text-sm text-gray-900">
                    {bus.capacity}
                  </span>
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-medium rounded-full w-fit ${
                      bus.wifiStatus === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {bus.wifiStatus}
                  </span>
                  <span className="text-sm text-gray-900">
                    {bus.scheduledTime}{" "}
                    <span className="text-gray-500">{bus.time}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-96 space-y-6">
            {/* Active Buses Location Card */}
            <div className="bg-[#F3F3F3] rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Active Buses Location
              </h3>
              {/* Map placeholder - you can insert your map image here */}
              <div className="bg-gray-300 rounded-lg h-64 flex items-center justify-center text-gray-500">
                Map placeholder
              </div>
            </div>

            {/* Total Active Bus Card */}
            <div className="bg-[#F3F3F3] rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-600">Total Active Bus</h3>
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
              <div className="flex items-end gap-4">
                <p className="text-5xl font-bold text-gray-900">6</p>
                {/* Bus image placeholder */}
                <div className="flex-1 flex justify-end">
                  <div className="bg-gray-300 rounded-lg w-32 h-20 flex items-center justify-center text-gray-500 text-xs">
                    Bus image
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">On the road</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}