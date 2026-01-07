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
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 sm:gap-4 md:gap-0">
          {/* Route Selection */}
          <div className="flex items-center space-x-2 sm:space-x-2 md:space-x-3 lg:space-x-3 w-full sm:w-auto justify-center sm:justify-start">
            {/* From City */}
            <div className="relative flex-1 sm:flex-none min-w-0 sm:min-w-[100px] md:min-w-[120px] lg:min-w-[130px]">
              <select
                name="fromCity"
                aria-label="Departure city"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full sm:w-auto px-3 sm:px-3 md:px-4 lg:px-4 py-2 bg-gray-100/90 backdrop-blur-sm rounded-lg text-gray-800 text-xs sm:text-xs md:text-sm lg:text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-200 appearance-none pr-7 sm:pr-7 md:pr-8 lg:pr-8"
              >
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Kano">Kano</option>
                <option value="Port Harcourt">Port Harcourt</option>
                <option value="Kaduna">Kaduna</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4 text-gray-600 pointer-events-none" />
            </div>

            {/* Swap Icon */}
            <button
              onClick={swapCities}
              className="p-1.5 sm:p-1.5 md:p-2 lg:p-2 rounded-full bg-gray-100/90 backdrop-blur-sm hover:bg-gray-200/90 active:bg-gray-300/90 transition-all duration-200 flex-shrink-0"
              title="Swap cities"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4 text-gray-600" />
            </button>

            {/* To City */}
            <div className="relative flex-1 sm:flex-none min-w-0 sm:min-w-[100px] md:min-w-[120px] lg:min-w-[130px]">
              <select
                name="toCity"
                aria-label="Destination city"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full sm:w-auto px-3 sm:px-3 md:px-4 lg:px-4 py-2 bg-gray-100/90 backdrop-blur-sm rounded-lg text-gray-800 text-xs sm:text-xs md:text-sm lg:text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-200 appearance-none pr-7 sm:pr-7 md:pr-8 lg:pr-8"
              >
                <option value="Abuja">Abuja</option>
                <option value="Lagos">Lagos</option>
                <option value="Kano">Kano</option>
                <option value="Port Harcourt">Port Harcourt</option>
                <option value="Kaduna">Kaduna</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4 text-gray-600 pointer-events-none" />
            </div>

            {/* Compare Button */}
            <button
              className="bg-[#800000] hover:bg-[#800000] active:bg-[#700000] text-white px-4 sm:px-4 md:px-5 lg:px-6 py-2 rounded-lg font-semibold text-xs sm:text-xs md:text-sm lg:text-sm transition-all duration-200 transform hover:scale-105 active:scale-100 whitespace-nowrap flex-shrink-0"
              onClick={onCompareClick}
            >
              Compare
            </button>
          </div>

          {/* Logo - Right Side */}
          <div className="flex items-center space-x-2 order-first sm:order-last">
            <div className="w-24 h-20 sm:w-28 sm:h-24 md:w-32 md:h-28 lg:w-36 lg:h-32">
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
