"use client"

import Link from "next/link"
import { useState } from "react"
import { FaApple, FaGoogle, FaFacebookF, FaEnvelope, FaPhone, FaLock } from "react-icons/fa"

export default function SignInPage() {
  const [form, setForm] = useState({
    identifier: "", // email or phone
    password: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign in logic here
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2384]">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md flex flex-col items-center">
        <div className="mb-4 flex flex-col items-center">
          <img src="/Logo.png" alt="Cheetah Logo" className="h-10 mb-1" />
          <h2 className="text-2xl font-bold mb-0.5 text-[#1A1A1A]">Sign In</h2>
          <p className="text-gray-500 text-center text-sm max-w-xs mb-1">
            Welcome back! Sign in to access your account.
          </p>
        </div>
        <form className="w-full" onSubmit={handleSubmit} autoComplete="on">
          <div className="mb-2">
            <div className="flex items-center mb-0.5">
              <FaEnvelope className="text-gray-400 w-4 h-4 mr-1" />
              <FaPhone className="text-gray-400 w-4 h-4 mr-1" />
              <label className="font-bold text-black text-sm" htmlFor="identifier">Email or Phone Number</label>
            </div>
            <input
              id="identifier"
              type="text"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              placeholder="Email or Phone Number"
              className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] focus:outline-none text-sm"
              required
              autoComplete="username"
            />
          </div>
          <div className="mb-2">
            <div className="flex items-center mb-0.5">
              <FaLock className="text-gray-400 w-4 h-4 mr-1" />
              <label className="font-bold text-black text-sm" htmlFor="password">Password</label>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] focus:outline-none text-sm"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#8B2323] text-white py-2.5 rounded-lg font-semibold transition-all duration-200 hover:opacity-90 mb-1 cursor-pointer"
          >
            Sign In
          </button>
        </form>
        <div className="text-sm text-gray-600 mt-1 mb-2">
          Don't have an account?{' '}
          <Link href="/login" className="text-[#8B2323] font-semibold hover:underline cursor-pointer">Sign Up</Link>
        </div>
        <div className="flex items-center w-full my-2">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-xs">or continue with</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <div className="flex justify-center gap-6 w-full mt-1">
          <button className="border border-[#8B2323] text-[#8B2323] rounded-full p-2.5 hover:bg-[#8B2323]/10 transition-colors cursor-pointer">
            <FaApple className="w-5 h-5" />
          </button>
          <button className="border border-[#8B2323] text-[#8B2323] rounded-full p-2.5 hover:bg-[#8B2323]/10 transition-colors cursor-pointer">
            <FaGoogle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
} 