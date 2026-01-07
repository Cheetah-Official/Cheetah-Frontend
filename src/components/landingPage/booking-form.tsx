"use client";

import React, { useState } from "react";
import { Calendar, Building, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
// TODO: Replace with RTK Query hooks
// Note: getProviderStatistics may need a different endpoint or be removed if not in Swagger
// Check if this should use schedule/trip endpoints instead

const transportOptions = [
  {
    name: "Peace Mass Transit",
    logo: "/PeaceMass-Logo.jpg",
    price: "₦26,000",
    route: "Lagos - Abuja",
  },
  {
    name: "ABC Transport",
    logo: "/file.svg",
    price: "₦28,000",
    route: "Lagos - Abuja",
  },
  {
    name: "God Is Good Motors",
    logo: "/Logo.png",
    price: "₦30,000",
    route: "Lagos - Abuja",
  },
];

export type CompareModalProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (option: { name: string; logo: string; price?: string; route?: string }) => void;
};

export function CompareModal({ open, onClose, onSelect }: CompareModalProps) {
  // TODO: Replace with RTK Query hook
  // Note: Provider statistics endpoint may not exist in Swagger
  // May need to use schedule/trip endpoints or create a new endpoint
  // const { data, isLoading } = useGetAllSchedulesQuery(); // Example - adjust as needed
  const data = null; // TODO: Get from RTK Query
  const isLoading = false; // TODO: Get from RTK Query

  const providerLogo = (name: string) => {
    const n = (name || "").toLowerCase();
    if (n.includes("peace")) return "/PeaceMass-Logo.jpg";
    if (n.includes("gigm") || n.includes("god is good"))
      return "/GIGMotors_Logo 1.png";
    if (n.includes("guo")) return "/GUO.png";
    if (n.includes("chisco")) return "/CHISCO.png";
    return "/Logo.png";
  };

  // Try to derive options from backend response; fallback to static
  const derived: Array<{
    name: string;
    logo: string;
    price?: string;
    route?: string;
  }> = Array.isArray((data as any)?.providers)
    ? (data as any).providers.map((p: any) => ({
        name: p.provider_name || p.name || "Provider",
        logo: providerLogo(p.provider_name || p.name),
        price: p.average_price
          ? `₦${Math.round(p.average_price).toLocaleString()}`
          : undefined,
        route: p.top_route || undefined,
      }))
    : [];

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-xl p-4 sm:p-5 md:p-6 lg:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.2)" }}
      >
        <button
          onClick={onClose}
          className="float-right font-bold text-xl sm:text-2xl md:text-3xl bg-none border-none cursor-pointer text-gray-600 hover:text-gray-800 active:text-gray-900 transition-colors"
          aria-label="Close modal"
        >
          ×
        </button>
        <h2 className="mt-0 mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold" style={{ color: "#800000" }}>
          Compare Transport Options
        </h2>
        <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8 rounded-lg overflow-hidden">
          <Image
            src="/Hero-2.jpeg"
            alt="Comparison"
            width={350}
            height={120}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
        <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
          {(isLoading
            ? transportOptions
            : derived.length
              ? derived
              : transportOptions
          ).map((opt, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 border border-gray-200 rounded-lg p-2 sm:p-3 md:p-4 lg:p-5"
            >
              <Image
                src={opt.logo}
                alt={opt.name}
                width={40}
                height={40}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-md object-contain flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl truncate">{opt.name}</div>
                {opt.route ? (
                  <div className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 truncate">{opt.route}</div>
                ) : null}
                {opt.price ? (
                  <div className="text-green-600 font-medium text-xs sm:text-sm md:text-base lg:text-lg">
                    {opt.price}
                  </div>
                ) : null}
              </div>
              <button
                onClick={() => onSelect(opt)}
                className="bg-[#800000] text-white border-none rounded-md px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3 text-xs sm:text-sm md:text-base lg:text-lg font-medium cursor-pointer hover:bg-[#700000] active:bg-[#600000] transition-colors flex-shrink-0 whitespace-nowrap"
              >
                Pick
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BookingForm({
  onCompareClick,
}: {
  onCompareClick?: () => void;
}) {
  const [tripType, setTripType] = useState("one-way");
  const [formData, setFormData] = useState({
    transportCompany: "",
    from: "",
    to: "",
    departure: "",
    return: "",
  });
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.from || !formData.to || !formData.departure) {
      alert("Please select From, To and a Departure date");
      return;
    }
    // Redirect to signup page - after signup, user will be redirected to dashboard
    router.push('/signup');
  };

  const handlePick = (option: any) => {
    setFormData({ ...formData, transportCompany: option.name });
  };

  return (
    <div
      className="rounded-2xl p-4 sm:p-5 md:p-5 lg:p-8 shadow-2xl max-w-md w-full backdrop-blur-20 mx-auto sm:mx-auto md:mx-0 md:max-w-sm lg:max-w-md"
      style={{ backgroundColor: "#1C1C1C80" }}
    >
      <div className="space-y-3 sm:space-y-3.5 md:space-y-4 lg:space-y-6">
        {/* Trip Type Radio Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 md:gap-3 lg:gap-6 mb-3 sm:mb-4 md:mb-4 lg:mb-6 justify-center sm:justify-start">
          <label className="flex items-center space-x-1.5 sm:space-x-2 cursor-pointer">
            <div className="relative">
              <input
                type="radio"
                name="tripType"
                value="one-way"
                checked={tripType === "one-way"}
                onChange={(e) => setTripType(e.target.value)}
                className="sr-only"
              />
              <div
                className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: "#A65555" }}
              >
                {tripType === "one-way" && (
                  <div
                    className="w-2 h-2 md:w-2 md:h-2 lg:w-3 lg:h-3 rounded-full"
                    style={{ backgroundColor: "#A65555" }}
                  />
                )}
              </div>
            </div>
            <span className="text-white text-xs sm:text-xs md:text-xs lg:text-base">One-Way</span>
          </label>

          <label className="flex items-center space-x-1.5 sm:space-x-2 cursor-pointer">
            <div className="relative">
              <input
                type="radio"
                name="tripType"
                value="round-trip"
                checked={tripType === "round-trip"}
                onChange={(e) => setTripType(e.target.value)}
                className="sr-only"
              />
              <div
                className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: "#A65555" }}
              >
                {tripType === "round-trip" && (
                  <div
                    className="w-2 h-2 md:w-2 md:h-2 lg:w-3 lg:h-3 rounded-full"
                    style={{ backgroundColor: "#A65555" }}
                  />
                )}
              </div>
            </div>
            <span className="text-white text-xs sm:text-xs md:text-xs lg:text-base">Round Trip</span>
          </label>

          <label className="flex items-center space-x-1.5 sm:space-x-2 cursor-pointer">
            <div className="relative">
              <input
                type="radio"
                name="tripType"
                value="hire-bus"
                checked={tripType === "hire-bus"}
                onChange={(e) => setTripType(e.target.value)}
                className="sr-only"
              />
              <div
                className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: "#A65555" }}
              >
                {tripType === "hire-bus" && (
                  <div
                    className="w-2 h-2 md:w-2 md:h-2 lg:w-3 lg:h-3 rounded-full"
                    style={{ backgroundColor: "#A65555" }}
                  />
                )}
              </div>
            </div>
            <span className="text-white text-xs sm:text-xs md:text-xs lg:text-base">Hire Bus</span>
          </label>
        </div>

        {/* Transport Company */}
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center space-x-2 text-white text-xs sm:text-xs md:text-xs lg:text-base">
            <Building className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
            <span>Transport Company</span>
          </div>
          <div className="relative">
            <select
              value={formData.transportCompany}
              onChange={(e) =>
                setFormData({ ...formData, transportCompany: e.target.value })
              }
              className="w-full px-3 sm:px-3 md:px-3 lg:px-5 py-2 sm:py-2 md:py-2.5 lg:py-4 rounded-lg bg-white text-gray-900 text-xs sm:text-xs md:text-xs lg:text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] transition-all duration-200 appearance-none"
              title="Select a transport company"
            >
              <option value="">Select Transport Company</option>
              <option value="peace-mass">Peace Mass Transit</option>
              <option value="abc-transport">ABC Transport</option>
              <option value="god-is-good">God Is Good Motors</option>
            </select>
            <ChevronDown
              className="absolute right-2.5 sm:right-2.5 md:right-3 lg:right-4 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 md:w-3.5 md:h-3.5 lg:w-5 lg:h-5 pointer-events-none"
              style={{ color: "#8B8A8A" }}
            />
          </div>
        </div>

        {/* From/To Section */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2 md:gap-2 lg:gap-4">
          <div className="space-y-1">
            <label className="text-white text-xs">From</label>
            <div className="relative">
              <select
                value={formData.from}
                onChange={(e) =>
                  setFormData({ ...formData, from: e.target.value })
                }
                className="w-full px-2 sm:px-2 md:px-2.5 lg:px-4 py-2 sm:py-2 md:py-2.5 lg:py-4 rounded-lg bg-white text-gray-900 text-xs sm:text-xs md:text-xs lg:text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] transition-all duration-200 appearance-none"
                title="Select departure city"
              >
                <option value="">Select City</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Kano">Kano</option>
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-3 sm:h-3 md:w-3 md:h-3 lg:w-4 lg:h-4 pointer-events-none"
                style={{ color: "#8B8A8A" }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-white text-xs">To</label>
            <div className="relative">
              <select
                value={formData.to}
                onChange={(e) =>
                  setFormData({ ...formData, to: e.target.value })
                }
                className="w-full px-2 sm:px-2 md:px-2.5 lg:px-4 py-2 sm:py-2 md:py-2.5 lg:py-4 rounded-lg bg-white text-gray-900 text-xs sm:text-xs md:text-xs lg:text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] transition-all duration-200 appearance-none"
                title="Select destination city"
              >
                <option value="">Select City</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Kano">Kano</option>
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-3 sm:h-3 md:w-3 md:h-3 lg:w-4 lg:h-4 pointer-events-none"
                style={{ color: "#8B8A8A" }}
              />
            </div>
          </div>
        </div>

        {/* Date Section */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2 md:gap-2 lg:gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-1.5 lg:space-x-2.5 text-white text-xs">
              <Calendar className="w-3 h-3 sm:w-3 sm:h-3 md:w-3 md:h-3 lg:w-4 lg:h-4 flex-shrink-0" />
              <span className="truncate">Departure Date</span>
            </div>
            <input
              type="date"
              value={formData.departure}
              onChange={(e) =>
                setFormData({ ...formData, departure: e.target.value })
              }
              className="w-full px-2 sm:px-2 md:px-2.5 lg:px-4 py-2 sm:py-2 md:py-2.5 lg:py-4 rounded-lg bg-white text-gray-900 text-xs sm:text-xs md:text-xs lg:text-base border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323]"
              aria-label="Departure Date"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-1.5 lg:space-x-2.5 text-white text-xs">
              <Calendar className="w-3 h-3 sm:w-3 sm:h-3 md:w-3 md:h-3 lg:w-4 lg:h-4 flex-shrink-0" />
              <span className="truncate">
                Return {tripType === "one-way" ? "(if round trip)" : "Date"}
              </span>
            </div>
            <input
              type="date"
              value={formData.return}
              onChange={(e) =>
                setFormData({ ...formData, return: e.target.value })
              }
              className="w-full px-2 sm:px-2 md:px-2.5 lg:px-4 py-2 sm:py-2 md:py-2.5 lg:py-4 rounded-lg bg-white text-gray-900 text-xs sm:text-xs md:text-xs lg:text-base border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] disabled:bg-gray-100 disabled:text-gray-400"
              disabled={tripType === "one-way"}
              aria-label="Return Date"
            />
          </div>
        </div>

        {/* Book Now Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full hover:opacity-90 active:opacity-75 text-white py-2.5 sm:py-2.5 md:py-3 lg:py-4 rounded-lg font-semibold text-sm sm:text-sm md:text-base lg:text-xl transition-all duration-200 transform hover:scale-105 active:scale-100 mt-3 sm:mt-4 md:mt-4 lg:mt-6 cursor-pointer"
          style={{ backgroundColor: "#800000" }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
