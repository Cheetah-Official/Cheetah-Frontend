"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaPlus, FaChevronRight, FaBus, FaExchangeAlt, FaTimes, FaChevronDown, FaEdit, FaTrash, FaCalendarAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentAccessToken, selectCurrentUser } from "@/feature/authentication/authSlice";
import { useGetAuthenticatedUserQuery } from "@/feature/auth/authApiSlice";
import {
  useGetVehiclesByCompanyQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useUpdateVehicleStatusMutation,
} from "@/feature/vehicles/vehicleApiSlice";
import {
  useGetTripsByCompanyQuery,
} from "@/feature/trips/tripApiSlice";
import {
  useGetPaginatedSchedulesByStatusQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} from "@/feature/schedules/scheduleApiSlice";

// Type definitions
type Vehicle = {
  id: number;
  companyId: number;
  companyName: string;
  vehicleNo: string;
  type: "BUS" | "TRAIN" | "FLIGHT";
  capacity: number;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  vehicleCode: string;
  createdAt: string;
  assigned: boolean;
};

type Trip = {
  id: number;
  companyId: number;
  companyName: string;
  origin: string;
  destination: string;
  amount: number;
  distance: number;
  estimatedDurationMinutes: number;
  createdAt: string;
};

type Schedule = {
  id: number;
  tripId: number;
  origin: string;
  destination: string;
  vehicleId: number;
  vehicleNo: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  scheduleStatus: "OPEN" | "CLOSED" | "CANCELLED";
  price: number;
  companyId: number;
  companyName: string;
};

type VehicleFormData = {
  companyId: number;
  vehicleNo: string;
  type: "BUS" | "TRAIN" | "FLIGHT";
  capacity: number;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  vehicleCode: string;
};

type ScheduleFormData = {
  tripId: number;
  vehicleId: number;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  scheduleStatus: "OPEN" | "CLOSED" | "CANCELLED";
};

const NIGERIAN_CITIES = [
  "Lagos",
  "Abuja",
  "Kano",
  "Edo",
  "Calabar",
  "Awka",
  "Ilorin",
  "Abeokuta",
  "Lokoja",
  "Asaba",
  "Uyo",
  "Benin City",
  "Ibadan",
  "Rivers",
  "Port Harcourt",
  "Enugu",
  "Kaduna",
  "Jos",
  "Maiduguri",
  "Sokoto",
];

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

  // Get companyId
  const companyId = authUser?.companyId || authUser?.id || authUser?.userId || reduxUser?.companyId || reduxUser?.id || reduxUser?.userId;

  // Fetch vehicles by company
  const { data: vehiclesData, isLoading: vehiclesLoading, error: vehiclesError, refetch: refetchVehicles } = useGetVehiclesByCompanyQuery(Number(companyId), {
    skip: !hasToken || !companyId,
  });

  // Fetch trips by company
  const { data: tripsData, isLoading: tripsLoading } = useGetTripsByCompanyQuery(Number(companyId), {
    skip: !hasToken || !companyId,
  });

  // State for schedule status filter (must be declared before use in query)
  const [scheduleStatusFilter, setScheduleStatusFilter] = useState<"OPEN" | "CLOSED" | "CANCELLED">("OPEN");

  // Fetch schedules by company and status (correct order: status first, then companyId)
  const { data: schedulesData, isLoading: schedulesLoading, refetch: refetchSchedules } = useGetPaginatedSchedulesByStatusQuery(
    { status: scheduleStatusFilter, companyId: Number(companyId), page: 0, size: 100 },
    { skip: !hasToken || !companyId }
  );

  const [createVehicle, { isLoading: isCreatingVehicle }] = useCreateVehicleMutation();
  const [updateVehicle, { isLoading: isUpdatingVehicle }] = useUpdateVehicleMutation();
  const [deleteVehicle, { isLoading: isDeletingVehicle }] = useDeleteVehicleMutation();
  const [updateVehicleStatus] = useUpdateVehicleStatusMutation();

  const [createSchedule, { isLoading: isCreatingSchedule }] = useCreateScheduleMutation();
  const [updateSchedule, { isLoading: isUpdatingSchedule }] = useUpdateScheduleMutation();
  const [deleteSchedule, { isLoading: isDeletingSchedule }] = useDeleteScheduleMutation();

  useEffect(() => {
    if (authUserError && (authUserError as any)?.status === 401) {
      dispatch(logOut());
      router.replace("/transport-signin");
    }
  }, [authUserError, dispatch, router]);

  // Get company name and code from authenticated user or Redux state
  // Use state to prevent hydration mismatch
  const [companyName, setCompanyName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  
  // Update company name after mount to prevent hydration mismatch
  useEffect(() => {
    const name = authUser?.companyName || reduxUser?.companyName || "";
    const code = authUser?.companyCode || reduxUser?.companyCode || "";
    setCompanyName(name);
    setCompanyCode(code);
  }, [authUser?.companyName, reduxUser?.companyName, authUser?.companyCode, reduxUser?.companyCode]);
  
  // Generate initials from company name
  const getInitials = (name: string) => {
    if (!name) return "";
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 4);
  };

  // State for vehicle modal
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleFormData, setVehicleFormData] = useState<VehicleFormData>({
    companyId: Number(companyId) || 0,
    vehicleNo: "",
    type: "BUS",
    capacity: 0,
    status: "ACTIVE",
    vehicleCode: "",
  });

  // State for schedule modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [scheduleFormData, setScheduleFormData] = useState<ScheduleFormData>({
    tripId: 0,
    vehicleId: 0,
    departureTime: "",
    arrivalTime: "",
    availableSeats: 0,
    scheduleStatus: "OPEN",
  });

  // State for view toggle (vehicles or schedules)
  const [activeView, setActiveView] = useState<"vehicles" | "schedules">("vehicles");

  // Set companyId when authUser is loaded
  useEffect(() => {
    if (companyId && vehicleFormData.companyId === 0) {
      setVehicleFormData(prev => ({ ...prev, companyId: Number(companyId) }));
    }
  }, [companyId, vehicleFormData.companyId]);

  const vehicles: Vehicle[] = vehiclesData || [];
  const trips: Trip[] = tripsData || [];
  // Schedules are already filtered by company and status from the API
  const schedules: Schedule[] = schedulesData?.content || [];

  // Get active vehicles count
  const activeVehiclesCount = vehicles.filter(v => v.status === "ACTIVE").length;

  // Vehicle handlers
  const handleOpenVehicleModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setVehicleFormData({
        companyId: vehicle.companyId,
        vehicleNo: vehicle.vehicleNo,
        type: vehicle.type,
        capacity: vehicle.capacity,
        status: vehicle.status,
        vehicleCode: vehicle.vehicleCode,
      });
    } else {
      setEditingVehicle(null);
      setVehicleFormData({
        companyId: Number(companyId) || 0,
        vehicleNo: "",
        type: "BUS",
        capacity: 0,
        status: "ACTIVE",
        vehicleCode: "",
      });
    }
    setIsVehicleModalOpen(true);
  };

  const handleCloseVehicleModal = () => {
    setIsVehicleModalOpen(false);
    setEditingVehicle(null);
    setVehicleFormData({
      companyId: Number(companyId) || 0,
      vehicleNo: "",
      type: "BUS",
      capacity: 0,
      status: "ACTIVE",
      vehicleCode: "",
    });
  };

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        await updateVehicle({
          id: editingVehicle.id,
          ...vehicleFormData,
        }).unwrap();
      } else {
        await createVehicle(vehicleFormData).unwrap();
      }
      handleCloseVehicleModal();
      refetchVehicles();
    } catch (error: any) {
      console.error("Error saving vehicle:", error);
      alert(error?.data?.message || error?.message || "Failed to save vehicle. Please try again.");
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) {
      return;
    }
    try {
      await deleteVehicle(id).unwrap();
      refetchVehicles();
    } catch (error: any) {
      console.error("Error deleting vehicle:", error);
      alert(error?.data?.message || error?.message || "Failed to delete vehicle. Please try again.");
    }
  };

  // Schedule handlers
  const handleOpenScheduleModal = (schedule?: Schedule, preSelectedVehicleId?: number) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setScheduleFormData({
        tripId: schedule.tripId,
        vehicleId: schedule.vehicleId,
        departureTime: new Date(schedule.departureTime).toISOString().slice(0, 16),
        arrivalTime: new Date(schedule.arrivalTime).toISOString().slice(0, 16),
        availableSeats: schedule.availableSeats,
        scheduleStatus: schedule.scheduleStatus,
      });
    } else {
      setEditingSchedule(null);
      const selectedVehicle = preSelectedVehicleId 
        ? vehicles.find(v => v.id === preSelectedVehicleId)
        : null;
      setScheduleFormData({
        tripId: 0,
        vehicleId: preSelectedVehicleId || 0,
        departureTime: "",
        arrivalTime: "",
        availableSeats: selectedVehicle?.capacity || 0,
        scheduleStatus: "OPEN",
      });
    }
    setIsScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setEditingSchedule(null);
    setScheduleFormData({
      tripId: 0,
      vehicleId: 0,
      departureTime: "",
      arrivalTime: "",
      availableSeats: 0,
      scheduleStatus: "OPEN",
    });
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...scheduleFormData,
        departureTime: new Date(scheduleFormData.departureTime).toISOString(),
        arrivalTime: new Date(scheduleFormData.arrivalTime).toISOString(),
      };

      if (editingSchedule) {
        await updateSchedule({
          id: editingSchedule.id,
          ...payload,
        }).unwrap();
      } else {
        await createSchedule(payload).unwrap();
      }
      handleCloseScheduleModal();
      refetchSchedules();
      refetchVehicles();
    } catch (error: any) {
      console.error("Error saving schedule:", error);
      alert(error?.data?.message || error?.message || "Failed to save schedule. Please try again.");
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    if (!confirm("Are you sure you want to delete this schedule?")) {
      return;
    }
    try {
      await deleteSchedule(id).unwrap();
      refetchSchedules();
    } catch (error: any) {
      console.error("Error deleting schedule:", error);
      alert(error?.data?.message || error?.message || "Failed to delete schedule. Please try again.");
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatScheduleTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${dateStr} ${timeStr}`;
  };

  // Get all schedules for a vehicle (a vehicle can have multiple schedules)
  const getVehicleSchedules = (vehicleId: number) => {
    return schedules.filter(s => s.vehicleId === vehicleId);
  };

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
        {/* View Toggle */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setActiveView("vehicles")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              activeView === "vehicles"
                ? "bg-[#8B2323] text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Vehicles
          </button>
          <button
            onClick={() => setActiveView("schedules")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              activeView === "schedules"
                ? "bg-[#8B2323] text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Schedules
          </button>
        </div>

        <div className="flex gap-6 items-start min-w-0">
          {/* Vehicles Table */}
          {activeView === "vehicles" && (
          <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-md min-w-0">
            <div className="overflow-x-auto">
              {vehiclesLoading ? (
                <div className="p-8 text-center text-gray-600">Loading vehicles...</div>
              ) : vehiclesError ? (
                <div className="p-8 text-center text-red-600">
                  Error loading vehicles. Please try again.
                </div>
              ) : vehicles.length === 0 ? (
                <div className="p-8 text-center text-gray-600">
                  No vehicles found. Create your first vehicle to get started.
                </div>
              ) : (
              <table className="w-full">
                  <thead className="bg-[#E0E0E0]">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                        Vehicle Number
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {vehicles.map((vehicle) => {
                      const vehicleSchedules = getVehicleSchedules(vehicle.id);
                      return (
                        <tr key={vehicle.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {vehicle.vehicleNo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                            {vehicle.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                            {vehicle.capacity} Seats
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                                vehicle.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                                  : vehicle.status === "MAINTENANCE"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                        >
                              {vehicle.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenScheduleModal(undefined, vehicle.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                title="Create schedule for this vehicle"
                              >
                                <FaCalendarAlt className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenVehicleModal(vehicle)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors cursor-pointer"
                                title="Edit vehicle"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteVehicle(vehicle.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                title="Delete vehicle"
                                disabled={isDeletingVehicle}
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </div>
                      </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          )}

          {/* Schedules Table */}
          {activeView === "schedules" && (
          <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-md flex flex-col min-w-0">
            {/* Table Header with Filter */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Schedules & Routes Data
              </h2>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Status:</label>
                <select
                  value={scheduleStatusFilter}
                  onChange={(e) => setScheduleStatusFilter(e.target.value as "OPEN" | "CLOSED" | "CANCELLED")}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900 cursor-pointer bg-white"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto overflow-y-auto min-w-0" style={{ maxHeight: '600px' }}>
              {schedulesLoading ? (
                <div className="p-8 text-center text-gray-600">Loading schedules...</div>
              ) : schedules.length === 0 ? (
                <div className="p-8 text-center text-gray-600">
                  No {scheduleStatusFilter.toLowerCase()} schedules found. {scheduleStatusFilter === "OPEN" && "Create your first schedule to get started."}
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-[#E0E0E0] sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                        Route
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                        Vehicle
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                        Departure Time
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                        Arrival Time
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                        Available Seats
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {schedules.map((schedule) => {
                        const vehicle = vehicles.find(v => v.id === schedule.vehicleId);
                        return (
                          <tr key={schedule.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {schedule.origin} → {schedule.destination}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {schedule.vehicleNo}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {formatScheduleTime(schedule.departureTime)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {formatScheduleTime(schedule.arrivalTime)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {schedule.availableSeats}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                                  schedule.scheduleStatus === "OPEN"
                                    ? "bg-green-100 text-green-700"
                                    : schedule.scheduleStatus === "CLOSED"
                                    ? "bg-gray-100 text-gray-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {schedule.scheduleStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                              ₦{schedule.price?.toLocaleString() || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleOpenScheduleModal(schedule)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                  title="Edit schedule"
                                >
                                  <FaEdit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSchedule(schedule.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                  title="Delete schedule"
                                  disabled={isDeletingSchedule}
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
              )}
            </div>
          </div>
          )}

          {/* Right Sidebar */}
          <div className="w-80 space-y-4">
            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleOpenVehicleModal()}
                className="bg-[#8B2323] text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#7A1F1F] transition-colors cursor-pointer"
              >
                <FaPlus className="w-4 h-4" />
                <span>Add New Vehicle</span>
              </button>
              <button 
                onClick={() => handleOpenScheduleModal()}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                disabled={trips.length === 0 || vehicles.filter(v => v.status === "ACTIVE").length === 0}
                title={trips.length === 0 ? "Create trips first" : vehicles.filter(v => v.status === "ACTIVE").length === 0 ? "Create active vehicles first" : "Create a new schedule"}
              >
                <FaCalendarAlt className="w-4 h-4" />
                <span>Create Schedule</span>
              </button>
            </div>

            {/* Info Card - Workflow Guide */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-md">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                📋 How to Create Schedules
              </h3>
              <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                <li>Create a <strong>Trip</strong> first (in Trips page)</li>
                <li>Create a <strong>Vehicle</strong> (button above)</li>
                <li>Create schedule using:
                  <ul className="list-disc list-inside ml-2 mt-1">
                    <li>"Create Schedule" button (select any vehicle)</li>
                    <li>Calendar icon on a vehicle (pre-selects that vehicle)</li>
                  </ul>
                </li>
              </ol>
              {trips.length === 0 && (
                <p className="text-xs text-red-600 mt-2 font-medium">
                  ⚠️ No trips available. Create trips first!
                </p>
              )}
              {vehicles.filter(v => v.status === "ACTIVE").length === 0 && vehicles.length > 0 && (
                <p className="text-xs text-orange-600 mt-2 font-medium">
                  ⚠️ No active vehicles. Activate a vehicle first!
                </p>
              )}
              {vehicles.length === 0 && (
                <p className="text-xs text-red-600 mt-2 font-medium">
                  ⚠️ No vehicles available. Create vehicles first!
                </p>
              )}
            </div>

            {/* Active Buses Location Card */}
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="text-base font-medium text-gray-900 mb-3">
                Active Buses Location
              </h3>
              <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center text-gray-400 relative overflow-hidden">
                <span className="text-xs">Map of Nigeria</span>
                <div className="absolute bottom-12 right-16">
                  <div className="w-5 h-5 bg-[#8B2323] rounded-full flex items-center justify-center">
                    <FaBus className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
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
                <h3 className="text-sm font-medium text-gray-600">Total Active Vehicles</h3>
                <FaChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-end gap-4 mb-2">
                <p className="text-5xl font-bold text-gray-900">{activeVehiclesCount}</p>
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

      {/* Add/Edit Vehicle Modal */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url(/Hero-1.jpeg)'
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
              </h2>
              <button
                onClick={handleCloseVehicleModal}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVehicleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Registration Number */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Vehicle Number
                    </label>
                    <span className="text-xs text-[#A65555]">(License Plate)</span>
                  </div>
                  <input
                    type="text"
                    value={vehicleFormData.vehicleNo}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, vehicleNo: e.target.value })}
                    placeholder="Enter vehicle number"
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900"
                  />
                </div>

                {/* Vehicle Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Code
                  </label>
                  <input
                    type="text"
                    value={vehicleFormData.vehicleCode}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, vehicleCode: e.target.value })}
                    placeholder="Enter vehicle code"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type
                  </label>
                  <div className="relative">
                    <select
                      value={vehicleFormData.type}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, type: e.target.value as "BUS" | "TRAIN" | "FLIGHT" })}
                      required
                      className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900 cursor-pointer appearance-none bg-white"
                    >
                      <option value="BUS">BUS</option>
                      <option value="TRAIN">TRAIN</option>
                      <option value="FLIGHT">FLIGHT</option>
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seat Capacity
                  </label>
                  <input
                    type="number"
                    value={vehicleFormData.capacity || ""}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, capacity: parseInt(e.target.value) || 0 })}
                    placeholder="Enter capacity"
                    required
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                    <div className="relative">
                      <select
                    value={vehicleFormData.status}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, status: e.target.value as "ACTIVE" | "INACTIVE" | "MAINTENANCE" })}
                    required
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900 cursor-pointer appearance-none bg-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                      </select>
                      <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

              <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                  onClick={handleCloseVehicleModal}
                  className="px-6 py-2.5 border border-[#8B2323] text-[#8B2323] rounded-lg font-medium hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingVehicle || isUpdatingVehicle}
                  className="px-6 py-2.5 bg-[#8B2323] text-white rounded-lg font-medium hover:bg-[#7A1F1F] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingVehicle || isUpdatingVehicle ? "Saving..." : editingVehicle ? "Update Vehicle" : "Create Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url(/Hero-1.jpeg)'
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingSchedule ? "Edit Schedule" : "Create Schedule"}
              </h2>
              <button
                onClick={handleCloseScheduleModal}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-6">
              {/* Trip Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Trip
                </label>
                <div className="relative">
                  <select
                    value={scheduleFormData.tripId}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, tripId: parseInt(e.target.value) || 0 })}
                    required
                    disabled={tripsLoading}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900 cursor-pointer appearance-none bg-white disabled:bg-gray-100"
                  >
                    <option value={0}>Select a trip</option>
                    {trips.map((trip) => (
                      <option key={trip.id} value={trip.id}>
                        {trip.origin} → {trip.destination} (₦{trip.amount.toLocaleString()})
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
                {trips.length === 0 && !tripsLoading && (
                  <p className="text-xs text-red-500 mt-1">No trips available. Please create a trip first.</p>
                )}
              </div>

              {/* Vehicle Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Vehicle
                </label>
                    <div className="relative">
                      <select
                    value={scheduleFormData.vehicleId}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, vehicleId: parseInt(e.target.value) || 0 })}
                    required
                    disabled={vehiclesLoading}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900 cursor-pointer appearance-none bg-white disabled:bg-gray-100"
                  >
                    <option value={0}>Select a vehicle</option>
                    {vehicles.filter(v => v.status === "ACTIVE").map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.vehicleNo} - {vehicle.type} ({vehicle.capacity} seats)
                      </option>
                    ))}
                      </select>
                      <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                {vehicles.filter(v => v.status === "ACTIVE").length === 0 && !vehiclesLoading && (
                  <p className="text-xs text-red-500 mt-1">No active vehicles available. Please create a vehicle first.</p>
                )}
              </div>

              {/* Departure Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departure Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduleFormData.departureTime}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, departureTime: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900"
                />
              </div>

              {/* Arrival Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arrival Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduleFormData.arrivalTime}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, arrivalTime: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900"
                />
              </div>

              {/* Available Seats */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Seats
                </label>
                <input
                  type="number"
                  value={scheduleFormData.availableSeats || ""}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, availableSeats: parseInt(e.target.value) || 0 })}
                  required
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900"
                />
                  </div>

              {/* Schedule Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Status
                </label>
                <div className="relative">
                  <select
                    value={scheduleFormData.scheduleStatus}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, scheduleStatus: e.target.value as "OPEN" | "CLOSED" | "CANCELLED" })}
                    required
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900 cursor-pointer appearance-none bg-white"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

              <div className="flex justify-end gap-4 pt-4">
              <button
                  type="button"
                  onClick={handleCloseScheduleModal}
                className="px-6 py-2.5 border border-[#8B2323] text-[#8B2323] rounded-lg font-medium hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  disabled={isCreatingSchedule || isUpdatingSchedule || trips.length === 0 || vehicles.filter(v => v.status === "ACTIVE").length === 0}
                  className="px-6 py-2.5 bg-[#8B2323] text-white rounded-lg font-medium hover:bg-[#7A1F1F] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {isCreatingSchedule || isUpdatingSchedule ? "Saving..." : editingSchedule ? "Update Schedule" : "Create Schedule"}
              </button>
            </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
