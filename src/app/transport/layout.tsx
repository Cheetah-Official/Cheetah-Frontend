"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function TransportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-60 bg-[#F3F3F3] min-h-screen p-6 flex flex-col">
          {/* Logo */}
          <div className="mb-8">
            <img src="/Cheetah 2.svg" alt="Cheetah Logo" className="h-10" />
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            <Link href="/transport" className="w-full">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  pathname === "/transport"
                    ? "bg-red-800 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <img src="/bus-vector.png" alt="Bus Icon" className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </Link>

            <Link href="/transport/buses-routes" className="w-full">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  pathname === "/transport/buses-routes"
                    ? "bg-red-800 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <img src="/bus-vector.png" alt="Bus Icon" className="w-5 h-5" />
                <span>Buses & Routes</span>
              </button>
            </Link>
          </nav>

          {/* Bottom Buttons */}
          <div className="space-y-2 mt-auto">
            {/* Back Button */}
            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Back</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-200 rounded-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        {children}
      </div>
    </div>
  );
}