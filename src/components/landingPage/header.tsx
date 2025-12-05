"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown, ArrowLeftRight } from "lucide-react";

export default function Header({
  onCompareClick,
}: {
  onCompareClick?: () => void;
}) {
  const [fromCity, setFromCity] = useState("Lagos");
  const [toCity, setToCity] = useState("Abuja");

  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Route Selection */}
          <div className="flex items-center space-x-3">
            {/* From City */}
            <div className="relative">
              <select
                name="fromCity"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="px-4 py-2 bg-gray-100/90 backdrop-blur-sm rounded-lg text-gray-800 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-200 appearance-none pr-8"
              >
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Kano">Kano</option>
                <option value="Port Harcourt">Port Harcourt</option>
                <option value="Kaduna">Kaduna</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            </div>

            {/* Swap Icon */}
            <button
              onClick={swapCities}
              className="p-2 rounded-full bg-gray-100/90 backdrop-blur-sm hover:bg-gray-200/90 transition-all duration-200"
              title="Swap cities"
            >
              <ArrowLeftRight className="w-4 h-4 text-gray-600" />
            </button>

            {/* To City */}
            <div className="relative">
              <select
                name="toCity"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="px-4 py-2 bg-gray-100/90 backdrop-blur-sm rounded-lg text-gray-800 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-200 appearance-none pr-8"
              >
                <option value="Abuja">Abuja</option>
                <option value="Lagos">Lagos</option>
                <option value="Kano">Kano</option>
                <option value="Port Harcourt">Port Harcourt</option>
                <option value="Kaduna">Kaduna</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            </div>

            {/* Compare Button */}
            <button
              className="bg-[#800000] hover:bg-[#800000] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              onClick={onCompareClick}
            >
              Compare
            </button>
          </div>

          {/* Logo - Right Side */}
          <div className="flex items-center space-x-2">
            <div className="w-32 h-28">
              <Image
                src="/Cheetah 2.svg"
                alt="Cheetah Logo"
                width={82}
                height={82}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
