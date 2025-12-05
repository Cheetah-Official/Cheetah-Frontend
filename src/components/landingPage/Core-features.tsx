"use client";

import { Wifi, Shield, User, Search } from "lucide-react";
import Image from "next/image";

export default function CoreFeaturesSection() {
  return (
    <section className="bg-[#000080] py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#EBEDF0] mb-4">
            Core Features
          </h2>
          <p className="text-[#E0E0E0] text-lg max-w-3xl mx-auto">
            Our platform is designed to enhance your intercity travel experience
            without handling bookings. We make sure your journey is protected,
            connected, and stress-free
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Free Wi-Fi Access On-the-Go */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex">
              <div className="flex-1 p-6">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-10 h-10 bg-[#800000] rounded-full flex items-center justify-center flex-shrink-0">
                    <Wifi className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#323232]">
                    Free Wi-Fi Access On-the-Go
                  </h3>
                </div>
                <p className="text-sm text-[#1B1F26B8]">
                  Stay connected during your trip. QR codes and one-time access
                  codes provided after checkout.
                </p>
              </div>
              <div className="w-32 h-32 relative">
                <Image
                  src="/Wifi-2.png"
                  alt="WiFi Access"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Free Accident Insurance */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex">
              <div className="flex-1 p-6">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-10 h-10 bg-[#800000] rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#323232]">
                    Free Accident Insurance
                  </h3>
                </div>
                <p className="text-sm text-[#1B1F26B8]">
                  Each traveler is automatically covered by our partner
                  insurers. View your policy in your profile and receive it by
                  email or SMS.
                </p>
              </div>
              <div className="w-32 h-32 relative">
                <Image
                  src="/Accident-free.png"
                  alt="Accident Insurance"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Traveler Profiles */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex">
              <div className="flex-1 p-6">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-10 h-10 bg-[#800000] rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#323232]">
                    Traveler Profiles
                  </h3>
                </div>
                <p className="text-sm text-[#1B1F26B8]">
                  Track bookings, access tickets, view insurance details, and
                  manage your account easily
                </p>
              </div>
              <div className="w-32 h-32 relative">
                <Image
                  src="/Passenger.jpg"
                  alt="Traveler Profile"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Unified Booking Experience */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex">
              <div className="flex-1 p-6">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-10 h-10 bg-[#800000] rounded-full flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#323232]">
                    Unified Booking Experience
                  </h3>
                </div>
                <p className="text-sm text-[#1B1F26B8]">
                  Search by route, date, or price and view multiple transport
                  options — all in one place.
                </p>
              </div>
              <div className="w-32 h-32 relative">
                <Image
                  src="/UNI-Booking.jpg"
                  alt="Unified Booking"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
