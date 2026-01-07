"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaExchangeAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentAccessToken, selectCurrentUser } from "@/feature/authentication/authSlice";
import { useGetAuthenticatedUserQuery } from "@/feature/auth/authApiSlice";
import {
  useGetTripsByCompanyQuery,
  useCreateTripMutation,
  useUpdateTripMutation,
  useDeleteTripMutation,
} from "@/feature/trips/tripApiSlice";

// Trip type definition
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

type TripFormData = {
  companyId: number;
  origin: string;
  destination: string;
  amount: number;
  distance: number;
  estimatedDurationMinutes: number;
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

export default function TripsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const accessToken = useSelector(selectCurrentAccessToken);
  const reduxUser = useSelector(selectCurrentUser);
  const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const hasToken = !!(accessToken || localStorageToken);

  const { data: authUser, isFetching: authUserFetching, error: authUserError } = useGetAuthenticatedUserQuery(undefined, {
    skip: !hasToken,
  });

  // Get companyId from authUser or reduxUser
  const companyId = authUser?.companyId || authUser?.id || authUser?.userId || reduxUser?.companyId || reduxUser?.id || reduxUser?.userId;

  const { data: tripsData, isLoading: tripsLoading, error: tripsError, refetch } = useGetTripsByCompanyQuery(Number(companyId), {
    skip: !hasToken || !companyId,
  });

  const [createTrip, { isLoading: isCreating }] = useCreateTripMutation();
  const [updateTrip, { isLoading: isUpdating }] = useUpdateTripMutation();
  const [deleteTrip, { isLoading: isDeleting }] = useDeleteTripMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [formData, setFormData] = useState<TripFormData>({
    companyId: 0,
    origin: "",
    destination: "",
    amount: 0,
    distance: 0,
    estimatedDurationMinutes: 0,
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Use state to prevent hydration mismatch for company name and code
  const [companyName, setCompanyName] = useState("Transport Company");
  const [companyCode, setCompanyCode] = useState("");

  useEffect(() => {
    if (authUserError && (authUserError as any)?.status === 401) {
      dispatch(logOut());
      router.replace("/transport-signin");
    }
  }, [authUserError, dispatch, router]);

  // Set companyId when authUser is loaded
  useEffect(() => {
    const companyId = authUser?.companyId || authUser?.id || authUser?.userId || reduxUser?.companyId || reduxUser?.id || reduxUser?.userId;
    if (companyId && formData.companyId === 0) {
      setFormData(prev => ({ ...prev, companyId: Number(companyId) }));
    }
  }, [authUser, reduxUser, formData.companyId]);

  // Update company name and code after mount to prevent hydration mismatch
  useEffect(() => {
    const name = authUser?.companyName || reduxUser?.companyName || "Transport Company";
    const code = authUser?.companyCode || reduxUser?.companyCode || "";
    setCompanyName(name);
    setCompanyCode(code);
  }, [authUser?.companyName, reduxUser?.companyName, authUser?.companyCode, reduxUser?.companyCode]);

  const trips: Trip[] = tripsData || [];

  const handleOpenModal = (trip?: Trip) => {
    if (trip) {
      setEditingTrip(trip);
      setFormData({
        companyId: trip.companyId,
        origin: trip.origin,
        destination: trip.destination,
        amount: trip.amount,
        distance: trip.distance,
        estimatedDurationMinutes: trip.estimatedDurationMinutes,
      });
    } else {
      setEditingTrip(null);
      const companyId = authUser?.companyId || authUser?.id || authUser?.userId || reduxUser?.companyId || reduxUser?.id || reduxUser?.userId || 0;
      setFormData({
        companyId: Number(companyId),
        origin: "",
        destination: "",
        amount: 0,
        distance: 0,
        estimatedDurationMinutes: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTrip(null);
    const companyId = authUser?.companyId || authUser?.id || authUser?.userId || reduxUser?.companyId || reduxUser?.id || reduxUser?.userId || 0;
    setFormData({
      companyId: Number(companyId),
      origin: "",
      destination: "",
      amount: 0,
      distance: 0,
      estimatedDurationMinutes: 0,
    });
  };

  const handleSwapCities = () => {
    setFormData({
      ...formData,
      origin: formData.destination,
      destination: formData.origin,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTrip) {
        await updateTrip({
          id: editingTrip.id,
          ...formData,
        }).unwrap();
      } else {
        await createTrip(formData).unwrap();
      }
      handleCloseModal();
      refetch();
    } catch (error: any) {
      console.error("Error saving trip:", error);
      alert(error?.data?.message || error?.message || "Failed to save trip. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this trip?")) {
      return;
    }

    try {
      await deleteTrip(id).unwrap();
      setDeleteConfirmId(null);
      refetch();
    } catch (error: any) {
      console.error("Error deleting trip:", error);
      alert(error?.data?.message || error?.message || "Failed to delete trip. Please try again.");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <main className="flex-1 bg-[#F3F3F3]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-2xl">🚌</span>
          <h1 className="text-xl font-medium">
            {authUserFetching ? "Loading..." : `Trips Management - ${companyName}`}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {companyCode && (
            <span className="text-gray-600 text-sm">{companyCode}</span>
          )}
          <div className="w-10 h-10 rounded-full bg-[#8B2323] flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {companyName.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 4)}
            </span>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="p-8 bg-[#F3F3F3]">
        {/* Action Bar */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">All Trips</h2>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#8B2323] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#7A1F1F] transition-colors cursor-pointer"
          >
            <FaPlus className="w-4 h-4" />
            Create Trip
          </button>
        </div>

        {/* Trips Table */}
        <div className="bg-white rounded-xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            {tripsLoading ? (
              <div className="p-8 text-center text-gray-600">Loading trips...</div>
            ) : tripsError ? (
              <div className="p-8 text-center text-red-600">
                Error loading trips. Please try again.
              </div>
            ) : trips.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                {companyId ? (
                  <>No trips found for your company. Create your first trip to get started.</>
                ) : (
                  <>Loading company information...</>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-[#E0E0E0] sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                      Distance (km)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                      Duration (min)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 bg-[#E0E0E0]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {trips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        #{trip.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{trip.origin}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-medium">{trip.destination}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {trip.companyName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                        {formatCurrency(trip.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {trip.distance} km
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {trip.estimatedDurationMinutes} min
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(trip.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenModal(trip)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="Edit trip"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(trip.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Delete trip"
                            disabled={isDeleting}
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Trip Modal */}
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
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6 z-10 max-h-[90vh] overflow-y-auto">
            {/* Title */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingTrip ? "Edit Trip" : "Create New Trip"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Route Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Route
                </label>
                <div className="flex items-end gap-3">
                  {/* Origin */}
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 pointer-events-none z-10">
                        From
                      </div>
                      <select
                        value={formData.origin}
                        onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                        required
                        className="w-full pl-12 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900 cursor-pointer appearance-none bg-white"
                        aria-label="Select origin city"
                      >
                        <option value="">Select origin</option>
                        {NIGERIAN_CITIES.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Swap Icon */}
                  <button
                    type="button"
                    onClick={handleSwapCities}
                    className="mb-1 p-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                    aria-label="Swap cities"
                  >
                    <FaExchangeAlt className="w-4 h-4" />
                  </button>

                  {/* Destination */}
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 pointer-events-none z-10">
                        To
                      </div>
                      <select
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        required
                        className="w-full pl-12 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900 cursor-pointer appearance-none bg-white"
                        aria-label="Select destination city"
                      >
                        <option value="">Select destination</option>
                        {NIGERIAN_CITIES.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount, Distance, Duration Row */}
              <div className="grid grid-cols-3 gap-4">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₦)
                  </label>
                  <input
                    type="number"
                    value={formData.amount || ""}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900"
                  />
                </div>

                {/* Distance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    value={formData.distance || ""}
                    onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) || 0 })}
                    required
                    min="0"
                    step="0.1"
                    placeholder="0.0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedDurationMinutes || ""}
                    onChange={(e) => setFormData({ ...formData, estimatedDurationMinutes: parseInt(e.target.value) || 0 })}
                    required
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] text-gray-900"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 border border-[#8B2323] text-[#8B2323] rounded-lg font-medium hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-6 py-2.5 bg-[#8B2323] text-white rounded-lg font-medium hover:bg-[#7A1F1F] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating || isUpdating ? "Saving..." : editingTrip ? "Update Trip" : "Create Trip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

