"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  const [email, setEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Subscribe email:", email)
    setEmail("")
  }

  return (
    <footer className="bg-gray-50 py-12 border-t border-gray-200">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 gap-16 items-start mb-12">
          {/* Left Side - Logo and Description */}
          <div className="space-y-8">
            {/* Logo and Tagline */}
            <div>
              <div className="mb-4">
                <div className="w-32 h-8">
                  <Image
                    src="/Cheetah 2.svg"
                    alt="Cheetah Logo"
                    width={96}
                    height={82}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">
                One platform to search, compare, and <br /> book buses or trains — with free <br /> insurance and Wi-Fi included.
              </p>
            </div>

            {/* Social Media */}
            <div className="border-t border-gray-200 pt-3 flex items-center gap-3 w-full">
            <p className="text-gray-800 font-medium text-sm">Connect with us</p>
            <div className="flex items-center space-x-3">
              <Link href="#" className="text-[#800000] hover:text-red-700 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-[#800000] hover:text-red-700 transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-[#800000] hover:text-red-700 transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
          </div>

          {/* Right Side - Newsletter Signup */}
          <div>
            <p className="text-gray-600 mb-4 text-sm">Join our mailing list for early access and travel deals</p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your e-mail address..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-l-md outline-none text-gray-700 placeholder-gray-400 bg-white text-sm"
                required
              />
              <button
                type="submit"
                className="bg-[#800000] hover:bg-red-700 text-white px-6 py-2.5 rounded-r-md font-medium transition-colors duration-200 whitespace-nowrap text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-200">
          {/* Legal Links */}
          <div className="flex items-center gap-6 mb-4 md:mb-0">
            <Link href="#" className="text-gray-600 hover:text-[#800000] transition-colors duration-200 text-sm">
              Terms of Use
            </Link>
            <Link href="#" className="text-gray-600 hover:text-[#800000] transition-colors duration-200 text-sm">
              Privacy Policy
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500">© Cheetah 2025, All Rights Reserved</div>
        </div>
      </div>
    </footer>
  )
}