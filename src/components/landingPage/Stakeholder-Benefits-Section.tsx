"use client";

import { Wifi, Shield, Check } from "lucide-react";
import Image from "next/image";

export default function StakeholderBenefitsSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* For Transport Companies */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Mobile Mockup */}
          <div className="relative">
            <div className="rounded-3xl shadow-2xl max-w-sm mx-auto">
              <div className="rounded-2xl overflow-hidden">
                <div className="relative h-96">
                  <Image
                    src="/Hero-2.jpeg"
                    alt="Road Background"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />

                  {/* Transport Companies Interface */}
                  <div className="absolute top-4 left-4 right-4 h-80 flex flex-col">
                    {/* Header */}
                    <div className=" bg-[#43434352] backdrop-blur-28 rounded-t-lg p-4 flex-shrink-0">
                      <h3 className="text-white font-semibold text-center text-lg">
                        Transports Companies
                      </h3>
                    </div>

                    {/* Scrollable Company Listings */}
                    <div className="bg-[#43434352] backdrop-blur-28 rounded-b-lg flex-1 overflow-y-auto cursor-pointer">
                      <div className="p-3 space-y-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                          <div
                            key={item}
                            className="bg-[#43434352] backdrop-blur-38 rounded-lg p-3 flex items-center justify-between border-[#00000059] border transition-all duration-200 hover:bg-[#00000059]"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                                <img
                                  src="/PeaceMass-Logo.jpg"
                                  alt="Company Logo"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-sm text-white truncate">
                                  Peace Mass
                                </p>
                                <p className="text-xs text-gray-300">
                                  Lagos - Abuja
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-400 font-medium">
                                Booked
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Register Button */}
                    <div className="bg-[#43434352] backdrop-blur-28 rounded-b-lg p-3 flex-shrink-0 -mt-1">
                      <button className="w-full bg-[#800000] hover:bg-[#800000] cursor-pointer text-[#FFFFFF] font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                        Register Transport Company
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              For Transport Companies
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-gray-600" />
                </div>
                <p className="text-gray-700">
                  Real-time schedule and seat integration via API or CSV upload.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-gray-600" />
                </div>
                <p className="text-gray-700">
                  Increase visibility and bookings with minimal effort.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* For Insurance & Wi-Fi Provided */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              For Insurance & Wi-Fi Provided
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-gray-600" />
                </div>
                <p className="text-gray-700">
                  Seamless integration into booking flows.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-gray-600" />
                </div>
                <p className="text-gray-700">
                  Gain access to thousands of daily travelers.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Mockup */}
          <div className="relative">
            <div className="rounded-3xl shadow-2xl max-w-sm mx-auto">
              <div className="rounded-2xl overflow-hidden">
                <div className="relative h-96">
                  <Image
                    src="/picture.png"
                    alt="Bus Interior"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />

                  {/* Insurance & Wi-Fi Interface */}
                  <div className="absolute top-4 left-4 right-4">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 mb-6">
                      <h3 className="text-white font-semibold text-center">
                        Free Insurance and Wi-Fi
                      </h3>
                    </div>

                    {/* Service Options */}
                    <div className="space-y-4">
                      <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                            <Image
                              src="/WIFI-logo.png"
                              alt="Wi-Fi Icon"
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          </div>
                          <span className="font-semibold text-white">
                            Wi-Fi
                          </span>
                        </div>
                        <span className=" text-white px-3 py-1 rounded-full text-sm font-medium">
                          Free
                        </span>
                      </div>

                      <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                            <Image
                              src="/FirstAid-Box.jpg"
                              alt="Insurance Icon"
                              width={82}
                              height={82}
                              className="object-cover"
                            />
                          </div>
                          <span className="font-semibold text-white">
                            Insurance
                          </span>
                        </div>
                        <span className=" text-white px-3 py-1 rounded-full text-sm font-medium">
                          Free
                        </span>
                      </div>
                    </div>

                    <button className="w-full bg-[#800000] text-white py-3 rounded-lg font-semibold mt-6 transition-colors duration-200">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
