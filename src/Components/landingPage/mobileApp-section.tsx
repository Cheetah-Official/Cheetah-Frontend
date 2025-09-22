"use client"

import { Apple, Play } from "lucide-react"
import Image from "next/image"

export default function MobileAppSection() {
  return (
    <section className="bg-[#000080] py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Phone Image */}
          <div className="relative flex justify-center">
            {/* Decorative Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[500px] h-[500px] bg-[#800000] rounded-full"></div>
            </div>

            {/* Your Phone Image */}
            <div className="relative z-10">
              <Image
                src="/MobileApp.png"
                alt="Cheetah Mobile App"
                width={300}
                height={600}
                className="w-auto h-auto max-w-sm mx-auto drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Content */}
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Mobile App Coming Soon</h2>
            <p className="text-lg text-purple-200 mb-8 leading-relaxed">
              Your favorite travel booking platform will soon be available as a native app on Android and iOS!
            </p>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Download mobile app now</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* App Store Button */}
                <button className="bg-white text-black px-6 py-3 rounded-lg flex items-center space-x-3 hover:bg-gray-100 transition-colors duration-200">
                  <Apple className="w-6 h-6 fill-black"/>
                  <div className="text-left">
                    <div className="text-xs">DOWNLOAD ON THE</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </button>

                {/* Google Play Button */}
                <button className="bg-white text-black px-6 py-3 rounded-lg flex items-center space-x-3 hover:bg-gray-100 transition-colors duration-200">
                    <Image 
                        src="/Andriod.png"
                        alt="Google Play" 
                        width={24} 
                        height={24}
                        className="w-6 h-6"
                    />
                    <div className="text-left">
                        <div className="text-xs">GET IT ON</div>
                        <div className="font-semibold">Google Play</div>
                    </div>
                    </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
