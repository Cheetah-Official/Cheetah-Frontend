"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length,
    );
  };

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

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        title="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        title="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 cursor-pointer"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            title={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-200 cursor-pointer ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-4">
          <Header onCompareClick={() => setShowCompare(true)} />
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-white space-y-6 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Compare,
                <br />
                Book, and
                <br />
                Travel Smarter
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-lg">
                Discover a seamless way to book intercity buses and trains
                across multiple providers — all in one place.{" "}
              </p>
              <button
                onClick={() => router.push("/signin")}
                className="bg-[#8B2323] text-white px-8 py-3 rounded-lg font-semibold text-base md:text-lg hover:bg-[#7A1F1F] transition-colors cursor-pointer shadow-md"
              >
                Sign in
              </button>
            </div>

            {/* Right Content - Booking Form */}
            <div className="lg:justify-self-end animate-fade-in-left">
              <BookingForm onCompareClick={() => setShowCompare(true)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
