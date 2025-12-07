"use client";

import type React from "react";
import { useState } from "react";
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
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          minWidth: 320,
          maxWidth: 400,
          boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            float: "right",
            fontWeight: "bold",
            fontSize: 18,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ×
        </button>
        <h2 style={{ marginTop: 0, marginBottom: 16, color: "#800000" }}>
          Compare Transport Options
        </h2>
        <Image
          src="/Hero-2.jpeg"
          alt="Comparison"
          width={350}
          height={120}
          style={{ borderRadius: 8, marginBottom: 16, objectFit: "cover" }}
        />
        <div>
          {(isLoading
            ? transportOptions
            : derived.length
              ? derived
              : transportOptions
          ).map((opt, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
                border: "1px solid #eee",
                borderRadius: 8,
                padding: 8,
              }}
            >
              <Image
                src={opt.logo}
                alt={opt.name}
                width={40}
                height={40}
                style={{
                  borderRadius: 6,
                  marginRight: 12,
                  objectFit: "contain",
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{opt.name}</div>
                {opt.route ? (
                  <div style={{ fontSize: 13, color: "#555" }}>{opt.route}</div>
                ) : null}
                {opt.price ? (
                  <div style={{ color: "#008000", fontWeight: 500 }}>
                    {opt.price}
                  </div>
                ) : null}
              </div>
              <button
                onClick={() => onSelect(opt)}
                style={{
                  background: "#800000",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 14px",
                  cursor: "pointer",
                }}
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
      className="rounded-2xl p-6 shadow-2xl max-w-md w-full backdrop-blur-20"
      style={{ backgroundColor: "#1C1C1C80" }}
    >
      <div className="space-y-4">
        {/* Trip Type Radio Buttons */}
        <div className="flex space-x-6 mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
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
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: "#1C1C1C80" }}
              >
                {tripType === "one-way" && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#A65555" }}
                  />
                )}
              </div>
            </div>
            <span className="text-white text-sm">One-Way</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
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
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: "#A65555" }}
              >
                {tripType === "round-trip" && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#A65555" }}
                  />
                )}
              </div>
            </div>
            <span className="text-white text-sm">Round Trip</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
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
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: "#A65555" }}
              >
                {tripType === "hire-bus" && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#A65555" }}
                  />
                )}
              </div>
            </div>
            <span className="text-white text-sm">Hire Bus</span>
          </label>
        </div>

        {/* Transport Company */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-white text-sm">
            <Building className="w-4 h-4" />
            <span>Transport Company</span>
            <button
              type="button"
              onClick={() => {
                // Check if form is filled
                if (formData.from && formData.to && formData.departure) {
                  // Redirect to signup page
                  router.push('/signup');
                } else {
                  // If form not filled, show compare modal (original behavior)
                  if (onCompareClick) {
                    onCompareClick();
                  }
                }
              }}
              style={{
                marginLeft: 12,
                background: "#fff",
                color: "#800000",
                border: "none",
                borderRadius: 6,
                padding: "2px 10px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Compare Transport
            </button>
          </div>
          <div className="relative">
            <select
              value={formData.transportCompany}
              onChange={(e) =>
                setFormData({ ...formData, transportCompany: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] transition-all duration-200 appearance-none"
              title="Select a transport company"
            >
              <option value="">Select Transport Company</option>
              <option value="peace-mass">Peace Mass Transit</option>
              <option value="abc-transport">ABC Transport</option>
              <option value="god-is-good">God Is Good Motors</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "#8B8A8A" }}
            />
          </div>
        </div>

        {/* From/To Section */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-white text-xs">From</label>
            <div className="relative">
              <select
                value={formData.from}
                onChange={(e) =>
                  setFormData({ ...formData, from: e.target.value })
                }
                className="w-full px-3 py-3 rounded-lg bg-white text-gray-900 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] transition-all duration-200 appearance-none"
                title="Select departure city"
              >
                <option value="">Select City</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Kano">Kano</option>
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none"
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
                className="w-full px-3 py-3 rounded-lg bg-white text-gray-900 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] transition-all duration-200 appearance-none"
                title="Select destination city"
              >
                <option value="">Select City</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Kano">Kano</option>
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none"
                style={{ color: "#8B8A8A" }}
              />
            </div>
          </div>
        </div>

        {/* Date Section */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-white text-xs">
              <Calendar className="w-3 h-3" />
              <span>Departure Date</span>
            </div>
            <input
              type="date"
              value={formData.departure}
              onChange={(e) =>
                setFormData({ ...formData, departure: e.target.value })
              }
              className="w-full px-3 py-3 rounded-lg bg-white text-gray-900 text-sm border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323]"
              aria-label="Departure Date"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-white text-xs">
              <Calendar className="w-3 h-3" />
              <span>
                Return Date {tripType === "one-way" ? "(if round trip)" : ""}
              </span>
            </div>
            <input
              type="date"
              value={formData.return}
              onChange={(e) =>
                setFormData({ ...formData, return: e.target.value })
              }
              className="w-full px-3 py-3 rounded-lg bg-white text-gray-900 text-sm border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] disabled:bg-gray-100 disabled:text-gray-400"
              disabled={tripType === "one-way"}
              aria-label="Return Date"
            />
          </div>
        </div>

        {/* Book Now Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full hover:opacity-90 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 mt-6 cursor-pointer"
          style={{ backgroundColor: "#800000" }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
