"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { FaTimes } from "react-icons/fa"
import { useRouter } from "next/navigation"

export default function CompareResult() {
  const [passengers, setPassengers] = useState(1)
  const [departureDate, setDepartureDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const router = useRouter()

  // Format current date as DD/MM/YYYY
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Set default dates on component mount
  useEffect(() => {
    // Don't set default dates - let placeholders show
    setDepartureDate("")
    setReturnDate("")
  }, [])

  // Handle date input formatting
  const handleDateChange = (value: string, setDate: (date: string) => void) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '')
    
    // Format as DD/MM/YYYY
    let formatted = numbers
    if (numbers.length >= 2) {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2)
    }
    if (numbers.length >= 4) {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8)
    }
    
    // Limit to 10 characters (DD/MM/YYYY)
    if (formatted.length <= 10) {
      setDate(formatted)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Blurred background image */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/Hero-1.jpeg')", filter: 'blur(8px)' }} />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      {/* Centered Card */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <div className="absolute left-8 top-8">
          <button 
            className="bg-white rounded-full shadow p-2 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => router.push('/')}
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="mx-auto flex bg-white rounded-2xl shadow-2xl p-8 items-center gap-10 max-w-4xl w-full justify-center">
          {/* Bus Image */}
          <div className="flex-shrink-0">
            <Image src="/Cheetah Bus Image 1.png" alt="Cheetah Bus" width={320} height={200} className="object-contain" />
          </div>
          {/* Details Card */}
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-2">
              <Image src="/PeaceMass-Logo.jpg" alt="Peace Mass" width={48} height={48} className="object-contain rounded-lg" />
              <div>
                <div className="font-bold text-lg text-[#222]">Peace Mass</div>
                <div className="text-gray-500 text-sm">Lagos - Abuja</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-black font-medium">Passenger</span>
              <div className="flex items-center border rounded-lg bg-white">
                <button type="button" className="px-3 py-1 text-lg text-black cursor-pointer" onClick={() => setPassengers(p => Math.max(1, p - 1))}>-</button>
                <span className="px-4 font-semibold text-black">{passengers}</span>
                <button type="button" className="px-3 py-1 text-lg text-black cursor-pointer" onClick={() => setPassengers(p => p + 1)}>+</button>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Departure Date</span>
                <input 
                  type="text" 
                  value={departureDate}
                  onChange={(e) => handleDateChange(e.target.value, setDepartureDate)}
                  placeholder="DD/MM/YYYY" 
                  className="px-4 py-2 rounded-lg border text-gray-700 bg-white focus:outline-none w-36 font-medium" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Return Date <span className="text-xs text-[#E08B2F]">(if round trip)</span></span>
                <input 
                  type="text" 
                  value={returnDate}
                  onChange={(e) => handleDateChange(e.target.value, setReturnDate)}
                  placeholder="DD/MM/YYYY" 
                  className="px-4 py-2 rounded-lg border text-gray-700 bg-white focus:outline-none w-36 font-medium" 
                />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#1CBF4B] mt-2 mb-2">₦26,000</div>
            <button className="bg-[#8B2323] text-white px-10 py-3 rounded-lg font-semibold text-lg cursor-pointer w-full" onClick={() => router.push('/dashboard')}>Proceed</button>
          </div>
        </div>
      </div>
    </div>
  )
} 