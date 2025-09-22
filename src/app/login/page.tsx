"use client"

import Link from "next/link"
import { useState } from "react"
import { FaApple, FaGoogle, FaFacebookF, FaUser, FaEnvelope, FaPhone, FaHome, FaLock } from "react-icons/fa"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: ""
  })
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign up logic here
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2384]">
      <div className="bg-white rounded-2xl shadow-xl p-4 w-full max-w-sm flex flex-col items-center">
        <div className="mb-3 flex flex-col items-center">
          <img src="/Logo.png" alt="Cheetah Logo" className="h-8 mb-1" />
          <h2 className="text-xl font-bold mb-0.5 text-[#1A1A1A]">Sign Up Account</h2>
          <p className="text-gray-500 text-center text-xs max-w-xs mb-1">
            Get access to Free travel insurance, Free Wi-Fi, and your coverage history - all in one place.
          </p>
        </div>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-1.5">
            <div className="flex items-center mb-0.5">
              <FaUser className="text-gray-400 w-3 h-3 mr-1" />
              <label className="font-bold text-black text-xs" htmlFor="fullName">Full Name</label>
            </div>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-3 text-black py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] focus:outline-none text-sm"
              required
              autoComplete="name"
            />
          </div>
          <div className="mb-1.5">
            <div className="flex items-center mb-0.5">
              <FaEnvelope className="text-gray-400 w-3 h-3 mr-1" />
              <label className="font-bold text-black text-xs" htmlFor="email">Email</label>
            </div>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-3 py-1.5 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] focus:outline-none text-sm"
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-1.5">
            <div className="flex items-center mb-0.5">
              <FaPhone className="text-gray-400 w-3 h-3 mr-1" />
              <label className="font-bold text-black text-xs" htmlFor="phone">Phone Number</label>
            </div>
            <input
              id="phone"
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full px-3 py-1.5 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] focus:outline-none text-sm"
              required
              autoComplete="tel"
            />
          </div>
          <div className="mb-1.5">
            <div className="flex items-center mb-0.5">
              <FaHome className="text-gray-400 w-3 h-3 mr-1" />
              <label className="font-bold text-black text-xs" htmlFor="address">Home Address</label>
            </div>
            <input
              id="address"
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Home Address"
              className="w-full px-3 py-1.5 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] focus:outline-none text-sm"
              required
              autoComplete="street-address"
            />
          </div>
          <div className="mb-1.5">
            <div className="flex items-center mb-0.5">
              <FaLock className="text-gray-400 w-3 h-3 mr-1" />
              <label className="font-bold text-black text-xs" htmlFor="password">Create Password</label>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create Password"
              className="w-full px-3 py-1.5 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] focus:outline-none text-sm"
              required
              autoComplete="new-password"
            />
          </div>
          <div className="mb-1.5">
            <div className="flex items-center mb-0.5">
              <FaLock className="text-gray-400 w-3 h-3 mr-1" />
              <label className="font-bold text-black text-xs" htmlFor="confirmPassword">Confirm Password</label>
            </div>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full px-3 py-1.5 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] focus:outline-none text-sm"
              required
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#8B2323] text-white py-2 rounded-lg font-semibold transition-all duration-200 hover:opacity-90 mb-1 cursor-pointer"
          >
            Sign Up
          </button>
        </form>
        <div className="text-xs text-gray-600 mt-1 mb-1.5">
          Already have an account?{' '}
          <Link href="/signin" className="text-[#8B2323] font-semibold hover:underline cursor-pointer">Sign In</Link>
        </div>
        <div className="flex items-center w-full my-1.5">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-xs">or continue with</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <div className="flex justify-center gap-4 w-full mt-1">
          <button className="border border-[#8B2323] text-[#8B2323] rounded-full p-2 hover:bg-[#8B2323]/10 transition-colors cursor-pointer">
            <FaApple className="w-4 h-4" />
          </button>
          <button className="border border-[#8B2323] text-[#8B2323] rounded-full p-2 hover:bg-[#8B2323]/10 transition-colors cursor-pointer">
            <FaGoogle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
} 