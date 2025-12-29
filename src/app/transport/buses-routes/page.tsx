"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaPlus, FaChevronRight, FaBus, FaExchangeAlt, FaTimes, FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentAccessToken, selectCurrentUser } from "@/feature/authentication/authSlice";
import { useGetAuthenticatedUserQuery } from "@/feature/auth/authApiSlice";

export default function BusesRoutesPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const accessToken = useSelector(selectCurrentAccessToken);
  const reduxUser = useSelector(selectCurrentUser);
  const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const hasToken = !!(accessToken || localStorageToken);

  const { data: authUser, isFetching: authUserFetching, error: authUserError } = useGetAuthenticatedUserQuery(undefined, {
    skip: !hasToken,
  });

  useEffect(() => {
    if (authUserError && (authUserError as any)?.status === 401) {
      dispatch(logOut());
      router.replace("/transport-signin");
    }
  }, [authUserError, dispatch, router]);

  // Get company name and code from authenticated user or Redux state
  const companyName = authUser?.companyName || reduxUser?.companyName || "";
  const companyCode = authUser?.companyCode || reduxUser?.companyCode || "";
  
  // Generate initials from company name
  const getInitials = (name: string) => {
    if (!name) return "";
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 4);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    registrationNumber: "",
    seatCapacity: "15 Seats",
    routeFrom: "Lagos",
    routeTo: "Abuja",
  });

  const handleSwapRoutes = () => {
    setFormData({
      ...formData,
      routeFrom: formData.routeTo,
      routeTo: formData.routeFrom,
    });
  };

  const handleSaveChanges = () => {
    // TODO: Implement save functionality
    console.log("Saving bus:", formData);
    setIsModalOpen(false);
    // Reset form
    setFormData({
      registrationNumber: "",
      seatCapacity: "15 Seats",
      routeFrom: "Lagos",
      routeTo: "Abuja",
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormData({
      registrationNumber: "",
      seatCapacity: "15 Seats",
      routeFrom: "Lagos",
      routeTo: "Abuja",
    });
  };

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
          {companyCode && (
            <span className="text-gray-600 text-sm">{companyCode}</span>
          )}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#8B2323] flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {authUserFetching ? "..." : getInitials(companyName)}
              </span>
            </div>
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
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#8B2323] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#7A1F1F] transition-colors cursor-pointer"
              >
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

      {/* Add Bus Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url(/Hero-1.jpeg)'
            }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6 z-10">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Bus</h2>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Registration Number and Seat Capacity Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Registration Number */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Registration Number
                    </label>
                    <span className="text-xs text-[#A65555]">(License Plate Number)</span>
                  </div>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    placeholder="Enter registration number"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900"
                  />
                </div>

                {/* Total Seat Capacity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Seat Capacity
                  </label>
                  <div className="relative">
                    <select
                      value={formData.seatCapacity}
                      onChange={(e) => setFormData({ ...formData, seatCapacity: e.target.value })}
                      className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900 cursor-pointer appearance-none bg-white"
                      aria-label="Select total seat capacity"
                    >
                      <option value="15 Seats">15 Seats</option>
                      <option value="18 Seats">18 Seats</option>
                      <option value="30 Seats">30 Seats</option>
                      <option value="45 Seats">45 Seats</option>
                      <option value="49 Seats">49 Seats</option>
                      <option value="54 Seats">54 Seats</option>
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Route Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Route
                </label>
                <div className="flex items-end gap-3">
                  {/* From */}
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 pointer-events-none z-10">
                        From
                      </div>
                      <select
                        value={formData.routeFrom}
                        onChange={(e) => setFormData({ ...formData, routeFrom: e.target.value })}
                        className="w-full pl-12 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900 cursor-pointer appearance-none bg-white"
                        aria-label="Select departure city"
                      >
                      <option value="Lagos">Lagos</option>
                      <option value="Abuja">Abuja</option>
                      <option value="Kano">Kano</option>
                      <option value="Edo">Edo</option>
                      <option value="Calabar">Calabar</option>
                      <option value="Awka">Awka</option>
                      <option value="Ilorin">Ilorin</option>
                      <option value="Abeokuta">Abeokuta</option>
                      <option value="Lokoja">Lokoja</option>
                      <option value="Asaba">Asaba</option>
                      <option value="Uyo">Uyo</option>
                      <option value="Benin City">Benin City</option>
                      <option value="Ibadan">Ibadan</option>
                      <option value="Rivers">Rivers</option>
                      </select>
                      <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Swap Icon */}
                  <button
                    type="button"
                    onClick={handleSwapRoutes}
                    className="mb-1 p-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                    aria-label="Swap routes"
                  >
                    <FaExchangeAlt className="w-4 h-4" />
                  </button>

                  {/* To */}
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 pointer-events-none z-10">
                        To
                      </div>
                      <select
                        value={formData.routeTo}
                        onChange={(e) => setFormData({ ...formData, routeTo: e.target.value })}
                        className="w-full pl-12 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900 cursor-pointer appearance-none bg-white"
                        aria-label="Select destination city"
                      >
                      <option value="Lagos">Lagos</option>
                      <option value="Abuja">Abuja</option>
                      <option value="Kano">Kano</option>
                      <option value="Edo">Edo</option>
                      <option value="Calabar">Calabar</option>
                      <option value="Awka">Awka</option>
                      <option value="Ilorin">Ilorin</option>
                      <option value="Abeokuta">Abeokuta</option>
                      <option value="Lokoja">Lokoja</option>
                      <option value="Asaba">Asaba</option>
                      <option value="Uyo">Uyo</option>
                      <option value="Benin City">Benin City</option>
                      <option value="Ibadan">Ibadan</option>
                      <option value="Rivers">Rivers</option>
                      </select>
                      <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 border border-[#8B2323] text-[#8B2323] rounded-lg font-medium hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-6 py-2.5 bg-[#8B2323] text-white rounded-lg font-medium hover:bg-[#7A1F1F] transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}