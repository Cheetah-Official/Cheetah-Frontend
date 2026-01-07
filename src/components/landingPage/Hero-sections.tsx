"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import BookingForm from "./booking-form";
import Header from "./header";
import { CompareModal } from "./booking-form";
import { useRouter } from "next/navigation";

const heroImages = [
  "/Hero-1.jpeg",
  "/Hero-2.jpeg",
  "/Hero-3.jpeg",
  "/Hero-4.jpeg",
];

// Price comparison data
const priceComparison = [
  {
    name: "Peace Mass",
    logo: "/PeaceMass-Logo.jpg",
    route: "Lagos - Abuja",
    price: "N26,000",
    color: "text-green-500",
  },
  {
    name: "CHISCO",
    logo: "/Chisco-Logo.png",
    route: "Lagos - Abuja",
    price: "N30,000",
    color: "text-green-500",
  },
  {
    name: "GIGM",
    logo: "/GIGM-Logo.png",
    route: "Lagos - Abuja",
    price: "N23,000",
    color: "text-green-500",
  },
  {
    name: "GUO",
    logo: "/GUO-Logo.png",
    route: "Lagos - Abuja",
    price: "N24,000",
    color: "text-green-500",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showCompare, setShowCompare] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(timer);
  }, []);


  const handlePick = (option: any) => {
    setShowCompare(false);
    router.push("/compare/result");
  };

  return (
    <section className="relative h-screen overflow-hidden">
      <CompareModal
        open={showCompare}
        onClose={() => setShowCompare(false)}
        onSelect={handlePick}
      />
      {/* Background Images Carousel */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 lg:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            title={`Go to slide ${index + 1}`}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 rounded-full transition-all duration-200 cursor-pointer ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 h-full flex items-center pt-20 sm:pt-24 md:pt-28 lg:pt-0">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <Header onCompareClick={() => setShowCompare(true)} />
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-8 lg:gap-12 items-start md:items-center mt-8 sm:mt-10 md:mt-12 lg:mt-0">
            {/* Left Content */}
            <div className="text-white space-y-4 sm:space-y-5 md:space-y-5 lg:space-y-8 animate-fade-in-up text-center sm:text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Compare,
                <br />
                Book, and
                <br />
                Travel Smarter
              </h1>
              <p className="text-base sm:text-lg md:text-lg lg:text-xl xl:text-2xl text-white/90 max-w-lg mx-auto sm:mx-auto md:mx-0">
                Discover a seamless way to book intercity buses and trains
                across multiple providers  all in one place.{" "}
              </p>
              <button
                onClick={() => router.push("/signin")}
                className="bg-[#8B2323] text-white px-6 sm:px-7 md:px-6 lg:px-10 py-2.5 sm:py-3 md:py-2.5 lg:py-4 rounded-lg font-semibold text-sm sm:text-base md:text-base lg:text-xl hover:bg-[#7A1F1F] active:bg-[#6B1A1A] transition-colors cursor-pointer shadow-md w-full sm:w-auto"
              >
                Sign in
              </button>
            </div>

            {/* Right Content - Booking Form */}
            <div className="md:justify-self-end md:self-center animate-fade-in-left w-full sm:w-full md:w-auto">
              <BookingForm onCompareClick={() => setShowCompare(true)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
