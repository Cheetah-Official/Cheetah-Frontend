"use client";

import { Search, Smartphone } from "lucide-react";
import Image from "next/image";

export default function FeaturesSection() {
  return (
    <section className="bg-[#000080] py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F5F5F5] mb-4">
            Just a Ride with Your Coverage
          </h2>
          <p className="text-[#919191] text-lg">
            Safety and connectivity now come standard with every trip
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Compare & Book Easily */}
          <div className="bg-[#F5F5F5] rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-[#800000] rounded-full flex items-center justify-center flex-shrink-0">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#323232]">
                  Compare & Book Easily
                </h3>
                <p className="text-sm text-[#1B1F26B8]">
                  Unified search across trusted transport providers
                </p>
              </div>
            </div>
          </div>

          {/* Free Accident Insurance */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="h-32 relative">
              <Image
                src="/Insurance.png"
                alt="Free Accident Insurance"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-[#323232]">
                Free Accident Insurance
              </h3>
              <p className="text-sm text-[#1B1F26B8]">
                Peace of mind included with every ticket
              </p>
            </div>
          </div>

          {/* Free In-Trip Wi-Fi */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="h-32 relative">
              <Image
                src="/Free-Wifi.png"
                alt="Free In-Trip Wi-Fi"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-[#323232]">
                Free In-Trip Wi-Fi
              </h3>
              <p className="text-sm text-[#1B1F26B8]">
                Stay connected on the go
              </p>
            </div>
          </div>

          {/* Available on Web & Mobile */}
          <div className="bg-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#800000] rounded-full flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#323232]">
                  Available on Web & Mobile
                </h3>
                <p className="text-sm text-[#1B1F26B8]">
                  Access the full experience on your phone
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
