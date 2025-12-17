"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FaArrowRight, FaHome } from "react-icons/fa";
import Image from "next/image";

export default function TransportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('transporter');
    router.push('/transport-signin');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-screen p-6 flex flex-col border-r border-gray-200">
          {/* Logo */}
          <div className="mb-8">
            <button 
              onClick={() => router.push("/")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Go to home page"
            >
              <Image src="/Cheetah 2.svg" alt="Cheetah Logo" width={120} height={45} className="h-auto" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            <Link href="/transport" className="w-full">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 font-semibold cursor-pointer ${
                  pathname === "/transport"
                    ? "bg-[#8B2323] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FaHome className={`w-5 h-5 ${pathname === "/transport" ? "text-white" : "text-gray-400"}`} />
                <span>Dashboard</span>
              </button>
            </Link>

            <Link href="/transport/buses-routes" className="w-full">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 font-medium cursor-pointer ${
                  pathname === "/transport/buses-routes"
                    ? "bg-[#8B2323] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Image 
                  src="/Bus-route.png" 
                  alt="Buses & Routes" 
                  width={20} 
                  height={20} 
                  className={`w-5 h-5 ${pathname === "/transport/buses-routes" ? "opacity-100" : "opacity-60"}`} 
                />
                <span>Buses & Routes</span>
              </button>
            </Link>
          </nav>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 font-medium cursor-pointer"
          >
            <FaArrowRight className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </aside>

        {/* Main Content */}
        {children}
      </div>
    </div>
  );
}