import { useState } from "react";
import Image from "next/image";
import { Button, SwapButton } from "@/components/ui/buttons";
import { CitySelect } from "@/components/ui/forms/CitySelect";

const CITIES = [
  { value: "Lagos", label: "Lagos" },
  { value: "Abuja", label: "Abuja" },
  { value: "Kano", label: "Kano" },
  { value: "Port Harcourt", label: "Port Harcourt" },
  { value: "Kaduna", label: "Kaduna" },
];

interface HeaderProps {
  onCompareClick?: () => void;
  className?: string;
}

export function Header({ onCompareClick, className = "" }: HeaderProps) {
  const [fromCity, setFromCity] = useState("Lagos");
  const [toCity, setToCity] = useState("Abuja");

  const swapCities = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };

  return (
    <header className={`absolute top-0 left-0 right-0 z-50 ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Route Selection */}
          <div className="flex items-center space-x-3">
            <CitySelect
              value={fromCity}
              onChange={setFromCity}
              options={CITIES}
              className="w-40"
              id="from-city"
              name="from-city"
            />

            <SwapButton
              onClick={swapCities}
              title="Swap cities"
              variant="ghost"
              size="md"
            />

            <CitySelect
              value={toCity}
              onChange={setToCity}
              options={CITIES}
              className="w-40"
              id="to-city"
              name="to-city"
            />

            <Button
              variant="primary"
              size="md"
              onClick={onCompareClick}
              className="px-6"
            >
              Compare
            </Button>
          </div>

          {/* Logo */}
          <div
            className="flex items-center
          
          "
          >
            <div className="w-32 h-28">
              <Image
                src="/Cheetah 2.svg"
                alt="Cheetah Logo"
                width={82}
                height={82}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
